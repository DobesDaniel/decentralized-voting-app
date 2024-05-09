import React, { useState, useEffect } from 'react';
import './NewVotingForm.css'; 
import Web3 from 'web3';
import contractAddress from './contractAddress';
import contractABI from './contractABI';

function NewVotingForm({ onCancel, connectedAccount}) {
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [options, setOptions] = useState([]);
    const [newOption, setNewOption] = useState('');

    let web3;

    useEffect(() => {
        async function loadWeb3() {
            if (window.ethereum) web3 = new Web3(window.ethereum);
            else console.error('Please install MetaMask');
        }
        loadWeb3();
    }, []);

    const handleAddOption = () => {
        if (newOption.trim() !== '') {
            setOptions([...options, newOption.trim()]);
            setNewOption('');
        }
    };

    const handleRemoveOption = (index) => {
      const updatedOptions = [...options];
      updatedOptions.splice(index, 1);
      setOptions(updatedOptions);
    };

    async function handleCreateVoting () {
        if (!web3) {
            if (window.ethereum) web3 = new Web3(window.ethereum);
            else console.error('Please install MetaMask');
        }

        if (!title.trim()) {
            console.error("Title cannot be empty");
            return;
        }

        if (!startTime) {
            console.error("Start time must be selected");
            return;
        }
      
        if (!endTime) {
            console.error("End time must be selected");
            return;
        }
      
        if (new Date(startTime) >= new Date(endTime)) {
          console.error("Start time must be before end time");
          return;
        }

        if (new Date(startTime) <= new Date()) {
            console.error("Start time must be in the future");
          return;
        }
      
        if (options.length < 2) {
          console.error("At least two options are required");
          return;
        }
      
        const uniqueOptions = new Set(options.map(option => option.trim().toLowerCase()));
        if (uniqueOptions.size !== options.length) {
          console.error("Options must be unique");
          return;
        }
      
        const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
        const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);

        const timeLimit = endTimestamp - startTimestamp;
  
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        try {
            await contract.methods.createVoting(title, options, startTimestamp, timeLimit).send({ from: connectedAccount });
            onCancel()
        } catch (error) {
            console.error('Error voting:', error);
        }

    };
   

  return (
    <div className="new-voting-form">
      <h1>Create New Voting</h1>
      <div>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label>Start Time:</label>
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </div>
      <div>
        <label>End Time:</label>
        <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      </div>
      <div>
        <label>Options:</label>
        <div className="options-container">
          {options.map((option, index) => (
            <div key={index} className="option-block remove-option" onClick={() => handleRemoveOption(index)}>
              <div className="option-title">{option}</div>
              remove
            </div>
          ))}
          <div className="option-block add-option" onClick={handleAddOption}>
            <input type="text" value={newOption} onChange={(e) => setNewOption(e.target.value)} />
            add
          </div>
        </div>
      </div>
      <div className="buttons">
        <button onClick={onCancel}>Back</button>
        <button onClick={handleCreateVoting}>Create</button>
      </div>
      
    </div>
  );
}

export default NewVotingForm;
