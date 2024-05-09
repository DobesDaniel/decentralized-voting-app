import React, { useState, useEffect } from 'react';
import './VotingDetail.css';
import Web3 from 'web3';
import contractAddress from './contractAddress';
import contractABI from './contractABI';

function VotingDetail({ voting, onBack, connectedAccount }) {
    const [options, setOptions] = useState([]);
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const [voted, setVoted] = useState(false);
    const [votingStarted, setVotingStarted] = useState(false);
    const [votingEnded, setVotingEnded] = useState(false);
    let web3;
     // 60 seconds after votings starts/ends autoRealod happens
    const autoRealodDelay = 60;

    useEffect(() => {
        async function loadWeb3() {
            if (window.ethereum) web3 = new Web3(window.ethereum);
            else console.error('Please install MetaMask');
        }
        loadWeb3();
    }, []);

    useEffect(() => {
        async function onLoad() {
            if (!web3) {
                if (window.ethereum) web3 = new Web3(window.ethereum);
                else console.error('Please install MetaMask');
            }
            const contract = new web3.eth.Contract(contractABI, contractAddress);
            const votingStarted = await contract.methods.hasStarted(voting.id).call();
            setVotingStarted(votingStarted);

            const votingEnded = await contract.methods.hasEnded(voting.id).call();
            setVotingEnded(votingEnded);
        
            const alreadyVoted = await contract.methods.hasVoted(voting.id, connectedAccount).call({ from: connectedAccount });
            setVoted(alreadyVoted);
        
            if (votingStarted) {
                const options = await contract.methods.getVotingOptions(voting.id).call();
                setOptions(options);
            }
        }

        async function autoLoadOnStart() {
            const now = Math.floor(Date.now() / 1000);
            const start = Number(voting.start);
            const timeUntilStart = start - now + autoRealodDelay;

            if (timeUntilStart <= 0) {
                onLoad();
                return;
            }
    
            setTimeout(() => {
                onLoad();
            }, timeUntilStart * 1000);
        }
    
        async function autoLoadOnEnd() {
            const now = Math.floor(Date.now() / 1000);
            const end = Number(voting.start) + Number(voting.timeLimit);
            const timeUntilEnd = end - now + autoRealodDelay;

            if (timeUntilEnd <= 0) {
                onLoad();
                return;
            }
            
            setTimeout(() => {
                onLoad();
            }, timeUntilEnd * 1000);
        }
    
        onLoad();
        autoLoadOnStart();
        autoLoadOnEnd();
    }, []);

    async function vote() {
        if (!web3) {
            if (window.ethereum) web3 = new Web3(window.ethereum);
            else console.error('Please install MetaMask');
        }
        if (!selectedOptionId) {
            console.error('Please select an option.');
            return;
        }
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        try {
            await contract.methods.vote(voting.id, selectedOptionId).send({ from: connectedAccount });
            setVoted(true);
        } catch (error) {
            console.error('Error voting:', error);
        }
    }

    function formatDateTime(timestamp) {
        const date = new Date(timestamp * 1000);
        const options = {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
      }

    return (
        <div className="voting-detail">
            {!votingEnded && votingStarted && (
                <h1>Ongoing voting</h1>
            )}
             {!votingStarted && (
                <h1>Voting has not started yet</h1>
            )}
             {votingEnded && (
                <h1>Voting Ended</h1>
            )}
            <h2>{voting.title}</h2>
            <p>Start Time: {formatDateTime(Number(voting.start))}</p>
            <p>End Time: {formatDateTime(Number(voting.start) + Number(voting.timeLimit))}</p>
        
            <h3>Options:</h3>
            {votingStarted && (
                <div className="options-container">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className={`option-block only-title ${selectedOptionId === option.id ? 'selected' : ''}`}
                            onClick={() => setSelectedOptionId(option.id)}
                        >
                            <div className='option-title'>{option.title}</div>
                            {(votingEnded || voted) && <div className='vote-count'>Votes: {String(option.vote_count)}</div>}
                        </div>
                    ))}
                </div>
            )}
            <div className='buttons'>
                <button onClick={onBack}>Back</button>
                {!votingEnded && !voted && votingStarted && (
                    <button onClick={vote}>Vote</button>
                )}
            </div>
        </div>
    );
}

export default VotingDetail;
