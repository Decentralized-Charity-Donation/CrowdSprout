// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.27;

contract CharityDonation {

   
    struct Campaign {
        address owner;
        uint id;
        string title;
        string description;
        uint goal;
        uint deadline;
        uint minContribution;
        uint balance;
        uint noOfContributors;
        bool exists;
        mapping(address => uint) contributions; 
        mapping(address => bool) contributorsVoted;
        address[] contributorList; 
        uint votesInFavor;
    }


    struct Owner {
        address owner;
        string ownerName;
        bool verified;
    }


     struct Update {
        string title;          
        string description;     
        string[] images;              
    }




    mapping(address => Owner) public owners;
    mapping(uint => Campaign) public campaigns;
    mapping(uint => string) public cardImage;
    mapping(uint256 => Update[]) public updates;
    mapping(address=>string) public approvedOwners;
    address[] public ownerArray;
    uint public campaignCount = 0;




    modifier onlyOwner(uint campaignId) {
        require(msg.sender == campaigns[campaignId].owner, "Only owner can call this function");
        _;
    }


modifier onlyOwner1() {
    require(bytes(approvedOwners[msg.sender]).length > 0, "Not an approved owner");
    _;
}


    modifier onlyContributor(uint campaignId) {
        require(campaigns[campaignId].contributions[msg.sender] > 0, "Only contributors can call this function");
        _;
    }


    modifier onlyAdmin() {
    require(msg.sender == 0x70997970C51812dc3A010C7d01b50e0d17dc79C8, "Not an admin");
    _;
}

    


function checkIfAdmin(address a) public view returns(bool){
    return a==0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
}


function addApprovedOwners(address o,string memory cid) public onlyAdmin {
approvedOwners[o]=cid;
ownerArray.push(o);
}


function checkIfApprovedOwner(address o) public view returns (bool) {
    return bytes(approvedOwners[o]).length > 0;
}


function getAllApprovedOwners() public view returns (address[] memory, string[] memory) {
    uint n = ownerArray.length;
    address[] memory addresses = new address[](n);
    string[] memory cids = new string[](n);
    
    for (uint i = 0; i < n; i++) {
        addresses[i] = ownerArray[i];
        cids[i] = approvedOwners[ownerArray[i]];
    }
    
    return (addresses, cids);
}




    function addOwner(string memory _ownerName) public onlyOwner1 {
        require(owners[msg.sender].owner == address(0), "Owner already exists");
        owners[msg.sender].owner = msg.sender;
        owners[msg.sender].ownerName = _ownerName;
        owners[msg.sender].verified = true;
    }


    function addCampaign(
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _days,
        uint256 _hours,
        uint256 _minutes,
        uint256 _minContribution
    ) public onlyOwner1 {
        uint256 totalDuration = (_days * 1 days) + (_hours * 1 hours) + (_minutes * 1 minutes);
        require(totalDuration > 0, "Total duration must be greater than zero");
        uint256 deadline = block.timestamp + totalDuration;
        Campaign storage newCampaign = campaigns[campaignCount];
        newCampaign.id = campaignCount;
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.goal = _goal;
        newCampaign.deadline = deadline;
        newCampaign.minContribution = _minContribution;
        newCampaign.balance = 0;
        newCampaign.noOfContributors = 0;
        newCampaign.owner = msg.sender;
        newCampaign.exists = true;
        campaignCount++;
    }


    function getOwner(address ownerAddress) public view returns (address, string memory, bool) {
        Owner memory owner = owners[ownerAddress];
        return (owner.owner, owner.ownerName, owner.verified);
    }


    function getCampaignBasicDetails(uint _id) public view returns (
        address owner,
        uint id,
        string memory title,
        string memory description,
        uint minContribution,
        uint deadline
    ) {
        return (
            campaigns[_id].owner,
            campaigns[_id].id,
            campaigns[_id].title,
            campaigns[_id].description,
            campaigns[_id].minContribution,
            campaigns[_id].deadline
        );
    }


    function getCampaignFinancialDetails(uint _id) public view returns (
        uint goal,
        uint balance,
        uint noOfContributors
    ) {
        return (
            campaigns[_id].goal,
            campaigns[_id].balance,
            campaigns[_id].noOfContributors
        );
    }


    function getContributionForAddress(uint256 campaignId, address contributor) public view returns (uint256) {
        return campaigns[campaignId].contributions[contributor];
    }


    function getContributorsForCampaign(uint campaignId) public view returns (address[] memory) {
        return campaigns[campaignId].contributorList;
    }


       function addUpdate(
        uint256 campaignId,
        string memory updateTitle,
        string memory updateDescription,
        string[] memory updateImages
    ) public onlyOwner(campaignId) {
        require(campaigns[campaignId].exists, "Campaign does not exist");
        require(msg.sender==campaigns[campaignId].owner,"Not owner");
        Update memory newUpdate;
        newUpdate.title = updateTitle;
        newUpdate.description = updateDescription;
        newUpdate.images = updateImages;
        updates[campaignId].push(newUpdate);
    }


   function updateCardImage(uint campaignId, string memory imageUrl) public onlyOwner(campaignId) {
        require(campaigns[campaignId].exists, "Campaign does not exist");
        require(msg.sender == campaigns[campaignId].owner, "Only owner can update card image");
        cardImage[campaignId] = imageUrl;
    }


   function getUpdates(uint256 campaignId)
    public
    view
    returns (Update[] memory)
{
    return updates[campaignId];
}


    function getCardImage(uint campaignId) public view returns (string memory) {
        return cardImage[campaignId];
    }





    function fund(uint256 campaignId) public payable {
        require(msg.value >= campaigns[campaignId].minContribution, "Must fund amount greater than min contribution");
        require(block.timestamp < campaigns[campaignId].deadline, "Campaign has ended");
        require(msg.sender != campaigns[campaignId].owner, "You are an owner");
        Campaign storage campaign = campaigns[campaignId];
        if (campaign.contributions[msg.sender] == 0) {
            campaign.contributorList.push(msg.sender);
            campaign.noOfContributors++;
        }

        campaign.contributions[msg.sender] += msg.value;
        campaign.balance += msg.value;
    }



    function voteForWithdrawal(uint campaignId) public onlyContributor(campaignId){
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.contributions[msg.sender] > 0, "Only contributors can vote");
        require(!campaign.contributorsVoted[msg.sender], "Already voted");
        campaign.contributorsVoted[msg.sender] = true;
        campaign.votesInFavor++;
    }

    
function ownerWithdraw(uint campaignId) public onlyOwner(campaignId){
    Campaign storage campaign = campaigns[campaignId];
    require(msg.sender == campaign.owner, "Only the owner can withdraw");
    require(block.timestamp >= campaign.deadline, "Deadline not reached");
    require(campaign.votesInFavor > campaign.noOfContributors / 2, "Votes are less than 50% of contributors");
    uint amount = campaign.balance;
    require(amount > 0, "No funds available");
    campaign.balance = 0;
    campaign.exists=false;
    payable(campaign.owner).transfer(amount);
}


function refundMyContribution(uint campaignId) public onlyContributor(campaignId) {
    Campaign storage campaign = campaigns[campaignId];
    uint contributedAmount = campaign.contributions[msg.sender];
    require(contributedAmount > 0, "You have not contributed to this campaign");
    require(!isVotesInFavour(campaignId)||!isGoalReached(campaignId),"votes are in favor no refund or goal reached ");
    payable(msg.sender).transfer(contributedAmount);

    campaign.balance -= contributedAmount;
    campaign.contributions[msg.sender] = 0;
    _removeContributor(campaignId, msg.sender);
}

function _removeContributor(uint campaignId, address contributor) internal {
    Campaign storage campaign = campaigns[campaignId];
    uint index;
    bool found = false;
    for (uint i = 0; i < campaign.contributorList.length; i++) {
        if (campaign.contributorList[i] == contributor) {
            index = i;
            found = true;
            break;
        }
    }

    require(found, "Contributor not found");
    uint lastIndex = campaign.contributorList.length - 1;
    campaign.contributorList[index] = campaign.contributorList[lastIndex];
    campaign.contributorList.pop();
    campaign.contributions[contributor] = 0;
}



  function getCampaignCount() public view returns (uint) {
    return campaignCount;
}


function getContributorsIfVoted(uint campaignId) public view returns (bool){
    return campaigns[campaignId].contributorsVoted[msg.sender];
}


function isContributor(uint campaignId) public view returns (bool){
    return campaigns[campaignId].contributions[msg.sender]>0 ;
}



function isDeadlineReached(uint campaignId,uint dead) public view returns (bool) {
    Campaign storage campaign = campaigns[campaignId];
    if (dead >= campaign.deadline) {
        return true;  
    } else {
        return false; 
    }
}


function isVotesInFavour(uint campaignId) public view returns (bool) {
    Campaign storage campaign = campaigns[campaignId];
    return campaign.votesInFavor > campaign.noOfContributors / 2;
}


function exists(uint campaignId) public view returns (bool){
    Campaign storage campaign = campaigns[campaignId];
    return campaign.exists;
}


function isExists(uint campaignId) public {
        campaigns[campaignId].exists=false;
 }

  function getCid(address ad) public view returns (string memory) {
    return approvedOwners[ad];
}

function isGoalReached(uint campaignId) public view returns (bool) {
    Campaign storage campaign = campaigns[campaignId];
    return campaign.balance >= (campaign.goal * 80) / 100;
}
}



