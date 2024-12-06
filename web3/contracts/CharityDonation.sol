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
        Request request;
        mapping(address => uint) contributions; // Track each contributor's contribution
        mapping(address => bool) contributorsVoted;
        address[] contributorList; // Store contributors' addresses for refunds
        uint votesInFavor;
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

    mapping(address => Owner) public owners;

function addOwner(string memory _ownerName) public {
    require(owners[msg.sender].owner == address(0), "Owner already exists");
    owners[msg.sender].owner = msg.sender;
    owners[msg.sender].ownerName = _ownerName;
    owners[msg.sender].verified = true;
    emit OwnerAdded(owners[msg.sender].owner, owners[msg.sender].ownerName);
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
    uint minContribution
) {
    require(campaigns[_id].exists, "Campaign does not exist");

    return (
        campaigns[_id].owner,
        campaigns[_id].id,
        campaigns[_id].title,
        campaigns[_id].description,
        campaigns[_id].minContribution
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

function getContributionForAddress(uint256 campaignId, address contributor) 
    public 
    view 
    returns (uint256) 
{
    return campaigns[campaignId].contributions[contributor];
}


function getContributorsForCampaign(uint campaignId) public view returns (address[] memory) {
    return campaigns[campaignId].contributorList;
}


    mapping(uint => Campaign) public campaigns;
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

    function addCampaign(
        string memory _title,
        string memory _description,
        uint _goal,
        uint _deadline,
        uint _minContribution
    ) public {
        require(_deadline > 0, "Deadline must be greater than 0 days");

        Campaign storage newCampaign = campaigns[campaignCount];
        newCampaign.id = campaignCount;
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.goal = _goal;
        newCampaign.deadline = block.timestamp + (_deadline * 1 days);
        newCampaign.minContribution = _minContribution;
        newCampaign.balance = 0;
        newCampaign.noOfContributors = 0;
        newCampaign.owner = msg.sender;
        newCampaign.request = Request({reqMsg: "", requested: false});
        newCampaign.exists = true;
        
        emit CampaignAdded(campaignCount, _title, _goal, newCampaign.deadline);
        campaignCount++;
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
        require(campaigns[campaignId].balance >= campaigns[campaignId].goal, "Goal has not been reached");

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

    function processCampaignOutcome(uint campaignId) public {
        Campaign storage campaign = campaigns[campaignId];

        uint contributors = campaign.noOfContributors;
        uint votes = campaign.votesInFavor;

        if (campaign.balance >= campaign.goal && votes > contributors / 2) {
            uint balance = campaign.balance;
            require(balance > 0, "No balance to withdraw");
            payable(campaign.owner).transfer(balance);
            campaign.balance = 0;

            emit FundsTransferred(campaignId, campaign.owner, balance);
        } else {
            refundContributors(campaignId);
        }
    }

    function getOwnerBalance(uint campaignId) public view returns (uint) {
        return campaigns[campaignId].owner.balance;
    }

    function refundContributors(uint campaignId) internal {
        Campaign storage campaign = campaigns[campaignId];

        for (uint i = 0; i < campaign.contributorList.length; i++) {
            address contributor = campaign.contributorList[i];
            uint contributedAmount = campaign.contributions[contributor];

            if (contributedAmount > 0) {
                payable(contributor).transfer(contributedAmount);
                campaign.contributions[contributor] = 0;
                emit RefundIssued(campaignId, contributor, contributedAmount);
            }
        }

        campaign.balance = 0;
    }

 

    function getCampaignBalance(uint campaignId) public view returns (uint) {
        return campaigns[campaignId].balance;
    }

    function getNumberOfContributors(uint campaignId) public view returns (uint) {
        return campaigns[campaignId].noOfContributors;
    }

    function getVotesInFavor(uint campaignId) public view returns (uint) {
        return campaigns[campaignId].votesInFavor;
    }
    function getCampaignCount() public view returns (uint) {
    return campaignCount;
}

}   
