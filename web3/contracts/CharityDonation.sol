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
        mapping(address => uint) contributions; // Track each contributor's contribution
        mapping(address => bool) contributorsVoted;
        address[] contributorList; // Store contributors' addresses for refunds
        uint votesInFavor;
        Request request;
    }

    struct Request {
        string reqMsg;
        bool requested;
    }

    struct Owner {
        address owner;
        string ownerName;
        bool verified;
    }

     struct Update {
        string title;           // Title of the update
        string description;     // Description of the update
        string[] images;        // Array of image URLs
        uint timestamp;         // Time when the update was added
    }


    mapping(address => Owner) public owners;
    mapping(uint => Campaign) public campaigns;
    mapping(uint => string) public cardImage;
    mapping(uint => Update[]) public update; 
    uint public campaignCount = 0;

    event CampaignAdded(uint campaignId, string title, uint goal, uint deadline);
    event Funded(uint campaignId, address contributor, uint amount);
    event WithdrawalRequested(uint campaignId, string description);
    event VoteCasted(uint campaignId, address voter);
    event FundsTransferred(uint campaignId, address owner, uint amount);
    event RefundIssued(uint campaignId, address contributor, uint amount);
    event OwnerAdded(address indexed ownerAddress, string ownerName);

    modifier onlyOwner(uint campaignId) {
        require(msg.sender == campaigns[campaignId].owner, "Only owner can call this function");
        _;
    }

    modifier onlyContributor(uint campaignId) {
        require(campaigns[campaignId].contributions[msg.sender] > 0, "Only contributors can call this function");
        _;
    }

    function addOwner(string memory _ownerName) public {
        require(owners[msg.sender].owner == address(0), "Owner already exists");
        owners[msg.sender].owner = msg.sender;
        owners[msg.sender].ownerName = _ownerName;
        owners[msg.sender].verified = true;
        emit OwnerAdded(owners[msg.sender].owner, owners[msg.sender].ownerName);
    }

    function addCampaign(
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _days,
        uint256 _hours,
        uint256 _minutes,
        uint256 _minContribution
    ) public {
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
        newCampaign.request = Request({reqMsg: "", requested: false});
        newCampaign.exists = true;

        emit CampaignAdded(campaignCount, _title, _goal, newCampaign.deadline);
        campaignCount++;
    }

    function addUpdate(
        uint campaignId,
        string memory updateTitle,
        string memory updateDescription,
        string[] memory updateImages
    ) public onlyOwner(campaignId) {
        require(campaigns[campaignId].exists, "Campaign does not exist");

        Update memory newUpdate;
        newUpdate.title = updateTitle;
        newUpdate.description = updateDescription;
        newUpdate.images = updateImages;
        newUpdate.timestamp = block.timestamp;
       update[campaignId].push(newUpdate);
    }


   function updateCardImage(uint campaignId, string memory imageUrl) public {
        require(campaigns[campaignId].exists, "Campaign does not exist");
        require(msg.sender == campaigns[campaignId].owner, "Only owner can update card image");
        cardImage[campaignId] = imageUrl;
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
        require(campaigns[_id].exists, "Campaign does not exist");

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
        require(campaigns[_id].exists, "Campaign does not exist");

        return (
            campaigns[_id].goal,
            campaigns[_id].balance,
            campaigns[_id].noOfContributors
        );
    }

    function getCampaignVoteRequestDetails(uint _id) public view returns (
        bool requestStatus,
        uint votesInFavor
    ) {
        require(campaigns[_id].exists, "Campaign does not exist");

        return (
            campaigns[_id].request.requested,
            campaigns[_id].votesInFavor
        );
    }

    function getContributionForAddress(uint256 campaignId, address contributor) public view returns (uint256) {
        return campaigns[campaignId].contributions[contributor];
    }

    function getContributorsForCampaign(uint campaignId) public view returns (address[] memory) {
        return campaigns[campaignId].contributorList;
    }

    

    function getUpdates(uint campaignId) public view returns (Update[] memory) {
        require(campaigns[campaignId].exists, "Campaign does not exist");
        return update[campaignId];
    }

 

    function getCardImage(uint campaignId) public view returns (string memory) {
        require(campaigns[campaignId].exists, "Campaign does not exist");
        return cardImage[campaignId];
    }

    function fund(uint256 campaignId) public payable {
        require(msg.value >= campaigns[campaignId].minContribution, "Must fund amount greater than min contribution");
        require(block.timestamp < campaigns[campaignId].deadline, "Campaign has ended");

        Campaign storage campaign = campaigns[campaignId];

        if (campaign.contributions[msg.sender] == 0) {
            campaign.contributorList.push(msg.sender); // Add to list only if new contributor
            campaign.noOfContributors++;
        }

        campaign.contributions[msg.sender] += msg.value;
        campaign.balance += msg.value;
        emit Funded(campaignId, msg.sender, msg.value);
    }

    function requestWithdrawal(string memory _description, uint campaignId) public onlyOwner(campaignId) {
        require(!campaigns[campaignId].request.requested, "Request has already been created");
        require(campaigns[campaignId].balance >= (campaigns[campaignId].goal * 80) / 100, "Goal has not been reached");
        campaigns[campaignId].request.reqMsg = _description;
        campaigns[campaignId].request.requested = true;
        emit WithdrawalRequested(campaignId, _description);
    }

    function voteForWithdrawal(uint campaignId) public {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.request.requested, "No withdrawal request available");
        require(campaign.contributions[msg.sender] > 0, "Only contributors can vote");
        require(!campaign.contributorsVoted[msg.sender], "Already voted");
        campaign.contributorsVoted[msg.sender] = true;
        campaign.votesInFavor++;
        emit VoteCasted(campaignId, msg.sender);
    }
    
function ownerWithdraw(uint campaignId) public {
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


function refundContributors(uint campaignId) private {
    Campaign storage campaign = campaigns[campaignId];
    require(campaign.exists, "Campaign does not exist");

    for (uint i = 0; i < campaign.contributorList.length; i++) {
        address contributor = campaign.contributorList[i];
        uint contributedAmount = campaign.contributions[contributor];
        if (contributedAmount > 0) {
            payable(contributor).transfer(contributedAmount);
            campaign.balance -= contributedAmount;
            campaign.contributions[contributor] = 0;
            _removeContributor(campaignId, i);
            break; 
        }
    }
}

function _removeContributor(uint campaignId, uint index) private {
    Campaign storage campaign = campaigns[campaignId];
    address contributorToRemove = campaign.contributorList[index];
    delete campaign.contributions[contributorToRemove];
    campaign.contributorList[index] = campaign.contributorList[campaign.contributorList.length - 1];
    campaign.contributorList.pop();
}

  function getCampaignCount() public view returns (uint) {
    return campaignCount;
}

    function getOwnerBalance(uint campaignId) public view returns (uint) {
        return campaigns[campaignId].balance;
    }

   
}
