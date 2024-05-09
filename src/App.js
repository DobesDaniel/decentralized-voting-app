

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css'; 
import contractAddress from './contractAddress';
import contractABI from './contractABI';
import VotingGrid from './VotingGrid';
import VotingDetail from './VotingDetail';


function App() {
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [votings, setVotings] = useState([]);
  const [selectedVoting, setSelectedVoting] = useState(null);
  let web3;

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3.eth.getAccounts();
          setConnectedAccount(accounts[0]);
        } catch (error) {
          console.error('User denied account access');
        }
      } else {
        console.error('Please install MetaMask');
      }
    }
    loadWeb3();
  }, []);

  useEffect(() => {
    async function loadVotings() {
      if (web3) {
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const votings = await contract.methods.getVotings().call();
        setVotings(votings);
      }
    }
    loadVotings();

  }, [web3]);

  async function realodVotings() {
    if (!web3) {
      if (window.ethereum) web3 = new Web3(window.ethereum);
      else console.error('Please install MetaMask');
    }
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const votings = await contract.methods.getVotings().call();
    setVotings(votings);
  }

  return (
    <div>
      <div className="connected-account">Connected Account: {connectedAccount}</div>
  
      {selectedVoting ? (
        <VotingDetail 
          voting={selectedVoting} 
          onBack={() => setSelectedVoting(null)}
          connectedAccount={connectedAccount} 
        />
      ) : (
        <VotingGrid 
          votings={votings} 
          onSelectVoting={(voting) => setSelectedVoting(voting)} 
          selectedVoting={selectedVoting}
          reloadVotings={realodVotings}
          connectedAccount={connectedAccount} 
        />
      )}
    </div>
  );
}

export default App;
