// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract VotingContract {

    struct Option {
        uint id;
        string title;
        uint vote_count;
    }

    struct Voting {
        uint id;
        string title;
        uint256 start;
        uint256 timeLimit;
        uint[] option_ids;

        address[] voted_addresses;
    }

    uint voting_id_counter = 0;
    uint option_id_counter = 0;
    Voting[] internal votings;
    Option[] internal options;

    function createVoting( string memory _title, string[] memory _optionTitles, uint256 _start, uint256 _timeLimit) external {
            require(_optionTitles.length > 1, "At least two options are required");
            require(_timeLimit > 0, "Time limit must be greater than zero");
            
            Voting memory newVoting;
            newVoting.id = voting_id_counter;
            newVoting.title = _title;
            newVoting.start = _start;
            newVoting.timeLimit = _timeLimit;
            
            uint[] memory temp_option_ids = new uint[](_optionTitles.length);
            for (uint i = 0; i < _optionTitles.length; i++) {
                Option memory newOption;
                newOption.id = option_id_counter;
                newOption.title = _optionTitles[i];
                newOption.vote_count = 0;
                options.push(newOption);
                temp_option_ids[i] = option_id_counter;
                option_id_counter += 1;
            }
            newVoting.option_ids = temp_option_ids;

            votings.push(newVoting);
            voting_id_counter += 1;
        }
    
    function addressNotInList(address _address, address[] memory _list) internal pure returns (bool) {
        for (uint i = 0; i < _list.length; i++) {
            if (_list[i] == _address) {
                return false;
            }
        }
        return true;
    }

    function getVotings() public view returns (Voting[] memory) {
        return votings;
    }
    
    function getVotingIndexById(uint _voting_id) internal view returns (uint) {
        for (uint i = 0; i < votings.length; i++) {
            if (votings[i].id == _voting_id) {
                return i;
            }
        }
        return type(uint).max;
    }

    function getOptions() public view returns (Option[] memory){
        return options;
    }

    function getVotingOptions(uint _voting_id) public view returns (Option[] memory){
        
        uint _voting_index = getVotingIndexById(_voting_id);
        require(_voting_index < votings.length, "Invalid Voting ID");
        Voting memory voting = votings[_voting_index];
        Option[] memory voting_options = new Option[](voting.option_ids.length);
        
        for (uint j = 0; j < options.length; j++) {  // outer cycle over all options (more of them)
            for (uint i = 0; i < voting.option_ids.length; i++) {   // inner cycle over only options within voting
                if (voting.option_ids[i] == options[j].id) {
                    voting_options[i] = options[j];
                    break;
                }
            }
        }
        return voting_options;
    }

    function hasVoted(uint _voting_id, address voting_address) public view returns (bool) {
        
        uint _voting_index = getVotingIndexById(_voting_id);
        require(_voting_index < votings.length, "Invalid Voting ID");
        Voting memory voting = votings[_voting_index];

        for (uint i = 0; i < voting.voted_addresses.length; i++) {
            if (voting.voted_addresses[i] == voting_address) {
                return true;
            }
        }
        return false;
    }

    function hasStarted(uint _voting_id) public view returns (bool) {
        uint _voting_index = getVotingIndexById(_voting_id);
        return block.timestamp > votings[_voting_index].start;
    }

    function hasEnded(uint _voting_id) public view returns (bool) {
        uint _voting_index = getVotingIndexById(_voting_id);
        return block.timestamp > votings[_voting_index].start + votings[_voting_index].timeLimit;
    }

    function vote(uint _voting_id, uint _option_id) public {
       
        uint _voting_index = getVotingIndexById(_voting_id);
        require(_voting_index < votings.length, "Invalid Voting ID");

        bool alreadyVoted = hasVoted(_voting_id, msg.sender);
        require(!alreadyVoted, "Already voted");    // has not voted yet!
        
        bool onGoingVoting = hasStarted(_voting_id) && !hasEnded(_voting_id);
        require(onGoingVoting, "Voting period ended");

        uint _option_index = type(uint).max;
        for (uint i = 0; i < options.length; i++){
            if (options[i].id == _option_id) {
                _option_index = i;
                break;
            }
        }
        require(_option_index < options.length, "Invalid option ID");

        options[_option_index].vote_count += 1;
        votings[_voting_index].voted_addresses.push(msg.sender);
    }
}
