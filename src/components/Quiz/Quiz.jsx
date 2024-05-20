import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Quiz.css'; 
import ScoreCounter from './ScoreCounter';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          'https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=multiple'
        );
        setQuestions(
          response.data.results.map(question => ({
            ...question,
            selectedAnswer: null, 
            userWasCorrect: null,
            all_answers: shuffle([...question.incorrect_answers, question.correct_answer])
          }))
        );
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleAnswer = (selectedAnswer) => {
    if (questions[currentQuestion].selectedAnswer !== null) {
      return;
    }

    const userWasCorrect = selectedAnswer === questions[currentQuestion].correct_answer;

    setQuestions(prevQuestions => prevQuestions.map((question, index) => {
      if (index === currentQuestion) {
        return {
          ...question,
          selectedAnswer,
          userWasCorrect,
        };
      }
      return question;
    }));

    if (userWasCorrect) {
      setScore(prevScore => prevScore + 1);
    }
  };


  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prevQuestion => prevQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestion(prevQuestion => prevQuestion - 1);
  };

  if (quizCompleted) {
    return <ScoreCounter score={score} totalQuestions={questions.length} />;
  }

  return (
    <div className="container">
      <h1>MCQ Quiz App</h1>
      <hr />
      {questions.length > 0 && (
        <>
          <h2 dangerouslySetInnerHTML={{ __html: questions[currentQuestion].question }} />
          <ul>
            {questions[currentQuestion].all_answers.map((answer, index) => (
              <li
                key={index}
                onClick={() => handleAnswer(answer)}
                className={questions[currentQuestion].selectedAnswer === answer ? (questions[currentQuestion].userWasCorrect ? 'correct' : 'incorrect') : ''}
                dangerouslySetInnerHTML={{ __html: answer }}
              />
            ))}
          </ul>

          <div className="button-wrapper">
            <button
              className="previous-button"
              disabled={currentQuestion === 0}
              onClick={handlePreviousQuestion}
            >
              Previous
            </button>
            <button
              className="next-button"
              onClick={handleNextQuestion}
            >
              {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
          <p>{currentQuestion + 1} of {questions.length} questions</p>
        </>
      )}
    </div>
  );
};

export default Quiz;