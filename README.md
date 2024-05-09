# BDM project

Project for class: Blockchain and digital currencies. Using Smart Contracts on the Sepolia test network.

# Deployment:
- **Author:** Daniel Dobeš
- **Deployment:** [decentralized-voting-app](https://dobesdaniel.github.io/decentralized-voting-app/)

MetaMask extention needed!!!

# Expectations:
    - Any user is able to create "Voting"
    - Voting has "title", "options", "start", "timelimit"
    - Modes for voting by other users that is defined when creating:
        1. One user has only one vote
        2. One user has set amount of votes that can be assigned
        3. One user has set amount of possitive votes and negative votes
    - Voting contract has set time limit during other users can vote
    - After time limit ends noone can vote anymore
    - There is no list of who can vote when contract is created
    - Each Voting is distinct by different ID

# How it should work
    - There is one contract that has all Votings (these could be struct)
    - There should be function that returns all Votings, that is called when user loads website and connects metamask
        - could take param users address or something to confirm
    - When user is connected and all Votings are return they are displayed in gallery/grid/table style (title)
        - by clicking on some Voting: new more detailed view is shown to user that is showing options and button to vote
        - probably function getVoting() that returns details
    - view is based on voting mode and button probably calls different function based on the voting
    - user can vote only once per Voting, but can still view that Voting
    - on main page where all votings are displayed there is a way to create new Voting

# Front-end
    - Loading screen - and connecting using metamask to login
    - When login - show all votings in galery/grid/table style (function getVotings())
    - By clicking on any voting detail is shown which allows to vote (function vote())

# Login
    - basically to switch accounts switch account in metamask and f5

# TODO:
## Primary
    - css designs
    - what is actually displayed? ()
    - "loading" after pressing button to create cotract and awaiting for its creation
    - votings block colors based on upcomming | ongoing | finished in voting grid
    - alignments
    - set height for blocks?
    - time format
    - back button position?
    - looks / colors

## Secondary
    - different voting modes
    - generate url for votings (or just easy way to get there)
    - filter votings
    - split votings based on finished | ongoing | upcomming

# Current State:
  - Only 1 Voting Mode (1 vote per person)
  - Any user is able to create "Voting"
  - Voting has "title", "options", "start", "timelimit"
  - MetaMask Extention needed!


