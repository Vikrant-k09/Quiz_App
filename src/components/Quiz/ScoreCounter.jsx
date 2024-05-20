import React from 'react';
import './Quiz.css';

const ScoreCounter= ({ score, totalQuestions }) => {
  return (
    <div className="container">
      <h1>Quiz Completed</h1>
      <hr />
      <h2>Your Score: {score} / {totalQuestions}</h2>
      <p>Thank you for participating!</p>
    </div>
  );
};

export default ScoreCounter;
