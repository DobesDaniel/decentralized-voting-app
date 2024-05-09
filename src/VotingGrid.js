import React, { useState, useEffect } from 'react';
import './VotingGrid.css';
import NewVotingForm from './NewVotingForm';

function VotingGrid({ votings, onSelectVoting, reloadVotings, connectedAccount }) {
  const [hoveredVoting, setHoveredVoting] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [hoveredVotingTimeLeft, setHoveredVotingTimeLeft] = useState(null);
  const [hoveredVotingTimer, setHoveredVotingTimer] = useState(null);

  useEffect(() => {
    if (hoveredVoting) {
      setHoveredVotingTimeLeft(calculateTimeLeft(hoveredVoting));

      const timer = setInterval(() => {
        setHoveredVotingTimeLeft(calculateTimeLeft(hoveredVoting));
      }, 1000);

      setHoveredVotingTimer(timer);
    }
  }, [hoveredVoting]);

  useEffect(() => {
    return () => {
      clearInterval(hoveredVotingTimer);
    };
  }, [hoveredVotingTimer]);

  function calculateTimeLeft(voting) {
    const now = Math.floor(Date.now() / 1000);
    const startTime = Number(voting.start);
    const endTime = startTime + Number(voting.timeLimit);

    if (now < startTime) {
        const timeUntilStart = startTime - now;
        const days = Math.floor(timeUntilStart / (60 * 60 * 24));
        const hours = Math.floor((timeUntilStart % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((timeUntilStart % (60 * 60)) / 60);
        const seconds = timeUntilStart % 60;
        return `Voting starts in ${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (now < endTime) {
        const timeLeft = endTime - now;
        const days = Math.floor(timeLeft / (60 * 60 * 24));
        const hours = Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
        const seconds = timeLeft % 60;
        return `Voting ends in ${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
        return "Voting ended";
    }
}

const handleCreateNewVotingClick = () => {
    setShowCreateForm(true);
  };

  const handleCancelShowingCreateForm = () => {
    reloadVotings();
    setShowCreateForm(false);
  }

  return (
    <div>
      {showCreateForm ? (
        <NewVotingForm onCancel={() => handleCancelShowingCreateForm()} connectedAccount={connectedAccount}/>
      ) : (
        <div className='vtoing-grid-wrapper'>
        <div className="voting-grid">
          {votings.map((voting) => (
            <div
              key={voting.id}
              className="voting-block"
              onClick={() => onSelectVoting(voting)}
              onMouseEnter={() => {
                setHoveredVoting(voting);
              }}
              onMouseLeave={() => {
                setHoveredVoting(null);
                setHoveredVotingTimeLeft(null);
              }}
            >
              {hoveredVoting && voting.id === hoveredVoting.id ? (
                <div className="time-left">{hoveredVotingTimeLeft}</div>
              ) : (
                <h3>{voting.title}</h3>
              )}
            </div>
          ))}
          {}
          <div
            className="voting-block create-new"
            onClick={handleCreateNewVotingClick}
          >
            <div className='add-voting'>+</div>
          </div>
        </div>
      </div>
      )}
    </div>

  );
}

export default VotingGrid;
