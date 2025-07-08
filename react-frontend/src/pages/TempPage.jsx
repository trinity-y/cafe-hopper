import React from 'react';
import Reaction from '../components/Reaction';

const TestReaction = () => {
  const handleReactionChange = (action) => {
    console.log('Reaction changed:', action);
  };

  return (
    <div>
      <h1>Test Reaction Component</h1>
      <Reaction 
        reviewId={1} 
        onReactionChange={handleReactionChange}
      />
    </div>
  );
};

export default TestReaction;