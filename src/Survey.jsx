import React, { useState, useEffect } from "react";
import surveyQuestions from "./Questions";
import MapboxComponent from "./Mapbox";
import GLOBALS from "./Globals"

const Survey = ({ onBack }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [responses, setResponses] = useState(Array(surveyQuestions.length).fill({}));
  const [mapMarks, setMapMarks] = useState([]);
  const minMapMarks = GLOBALS.minMapMarks; // Minimum required map marks

  const generateMarkQuestions = () => {
    const questions = [];
    for (let i = 0; i < mapMarks.length; i++) {
      questions.push({
        id: `mark_question_${i + 1}`,
        text: `Frage für Feld ${i + 1}`,
        type: "text",
      });
    }
    return questions;
  };

  // Mark questions generated based on the number of marks
  const [markQuestions, setMarkQuestions] = useState([]);

  // Update markQuestions whenever mapMarks changes
  useEffect(() => {
    const newMarkQuestions = generateMarkQuestions();
    setMarkQuestions(newMarkQuestions);
  }, [mapMarks]);

  const handleInputChange = (questionId, value) => {
    const updatedResponses = [...responses];
    updatedResponses[currentPage] = { ...updatedResponses[currentPage], [questionId]: value };
    setResponses(updatedResponses);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleMapMarks = (marks) => {
    setMapMarks(marks);
    if (mapMarks.length >= minMapMarks - 2) console.log("Huzzah")
  };

  const handleSubmit = () => {
    // No backend integration currently, so just log the survey response for debugging
    console.log(responses);
  };

  const renderQuestion = (question) => {
    const { id, text, type, options } = question;

    if (type === "text") {
      return (
        <div key={id}>
          <label>{text}</label>
          <input
            type="text"
            value={responses[currentPage][id] || ""}
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
                checked={responses[currentPage][id] === option}
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
      {/* Page 1: Map Marking */}
      {currentPage === 0 && (
        <div>
          <h2>Felder wählen</h2>
          {/* Insert your Mapbox component for map marking here */}
          {<MapboxComponent onComplete={handleMapMarks} />}
          <p>Bitte wählen Sie mindestens {minMapMarks} von Ihnen bestellte Felder auf der Karte aus.</p>
        </div>
      )}

      {/* Page 2 and onward: Questions */}
      {currentPage > 0 && currentPage <= mapMarks.length && (
        <div>
          <h2>Fragen für Feld {currentPage}</h2>
          {/* Display map centered on the corresponding mark here */}
          {<MapboxComponent center={mapMarks[currentPage - 1].coordinates} />}
          {markQuestions.map(renderQuestion)}
        </div>
      )}

      {/* Page after map marks: Miscellaneous Questions */}
      {currentPage > mapMarks.length && (
        <div>
          <h2>Andere Fragen</h2>
          {surveyQuestions[currentPage - mapMarks.length - 1].map(renderQuestion)}
        </div>
      )}

      <div>
        {currentPage === 0 && <button onClick={onBack}>Zurück zur Einverständniserklärung</button>}
        {currentPage > 0 && (
          <button onClick={handlePreviousPage}>
            Vorherige Seite
          </button>
        )}
        {currentPage < surveyQuestions.length && (
          <button onClick={handleNextPage} disabled={mapMarks.length <= minMapMarks - 2}>
            Nächste Seite
          </button>
        )}
        {currentPage === surveyQuestions.length && (
          <button onClick={handleSubmit}>Abschicken</button>
        )}
      </div>
    </div>
  );
};

export default Survey;
