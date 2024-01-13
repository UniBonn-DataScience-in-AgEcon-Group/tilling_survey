import React, { useState, useEffect } from "react";
import surveyQuestions from "./Questions";

const Survey = ({ onBack, responses, updateResponses, onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  /*const [responses, setResponses] = useState(appResponses["survey_questions"]);*/

  const handleInputChange = (questionId, value) => {
    const updatedResponses = {...responses};
    updatedResponses["survey_questions"][currentPage] = { ...updatedResponses["survey_questions"][currentPage], [questionId]: value };
    updateResponses(updatedResponses);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleComplete = () => {
    /*onComplete(responses);*/
    onComplete();
  };

  const renderQuestion = (question) => {
    const { id, text, type, options } = question;

    if (type === "text") {
      return (
        <div key={id}>
          <label>{text}</label>
          <input
            type="text"
            value={responses["survey_questions"][currentPage][id] || ""}
            onChange={(e) => handleInputChange(id, e.target.value)}
          />
        </div>
      );
    } else if (type === "radio") {
      return (
        <div key={id}>
          <p>{text}</p>
          {options.map((option, index) => (
            <label key={index}>
              <input
                type="radio"
                name={`question_${id}`}
                value={option}
                checked={responses["survey_questions"][currentPage][id] === option}
                onChange={() => handleInputChange(id, option)}
              />
              {option}
            </label>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <h1>Umfrage</h1>
      {surveyQuestions[currentPage].map(renderQuestion)}
      <div>
        {currentPage == 0 && <button onClick={onBack}>Vorherige Seite</button>}
        {currentPage > 0 && <button onClick={handlePreviousPage}>Vorherige Seite</button>}
        {currentPage < surveyQuestions.length - 1 && <button onClick={handleNextPage}>Nächste Seite</button>}
        {currentPage === surveyQuestions.length - 1 && <button onClick={handleComplete}>Nächste Seite</button>}
      </div>
    </div>
  );
};

export default Survey;
