import React, { useState } from "react";
import MapboxComponent from "./Mapbox.tsx";

const MapboxSurvey = ({ onComplete, onBack, responses, updateResponses }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [mapMarks, setMapMarks] = useState(responses["coords"] || []);
  const minMapMarks = 3;

  const handleMapMarks = (marks) => {
    setMapMarks(marks);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleComplete = () => {
    if (mapMarks.features && mapMarks.features.length >= minMapMarks) {
      onComplete(mapMarks);
    }
  };

  const handleMapboxResponse = (markNumber, questionId, value) => {
    // Update the responses object passed from App.jsx
    const updatedResponses = { ...responses };
    updatedResponses[questionId] = value;
    updatedResponses["coords"] = mapMarks;
    updateResponses(updatedResponses);
  };

  // Function to generate fixed questions for a mark
  const generateMarkQuestions = (markNumber) => {
    const questions = [];
    // Define questions for the marked farms here
    // Currently mostly placeholder
    questions.push({
      id: `mark_${markNumber}_question_1`,
      text: `Frage 1 für Feld ${markNumber + 1}`,
      type: "text",
    });
    questions.push({
      id: `mark_${markNumber}_question_2`,
      text: `Frage 2 für Feld ${markNumber + 1}`,
      type: "text",
    });
    // Add more questions as needed
    return questions;
  };

  const renderQuestions = () => {
    if (currentPage === 0) {
      // Page 1: Map Marking
      return (
        <div>
          <h2>Felder wählen</h2>
          <MapboxComponent mapMarks={mapMarks} onComplete={handleMapMarks} center={[11, 50]}/>
          <p>Bitte markieren Sie mindestens {minMapMarks} Ihrer Felder auf der Karte.</p>
        </div>
      );
    } else if (currentPage <= mapMarks.features.length) {
      const markNumber = currentPage - 1;
      const mark = mapMarks[markNumber];
      const markQuestions = generateMarkQuestions(markNumber);
      window.marks = mapMarks;

      return (
        <div>
          <h2>Questions for Mark {markNumber + 1}</h2>
          <MapboxComponent mapMarks={mapMarks} center={mapMarks.features[markNumber].geometry.coordinates[0][0]} onComplete={handleMapMarks} setCenter={true} />
          {markQuestions.map((question) => (
            <div key={question.id}>
              <label>{question.text}</label>
              <input
                type="text"
                value={responses[question.id] || ""}
                onChange={(e) =>
                  handleMapboxResponse(markNumber, question.id, e.target.value)
                }
              />
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div>
      <h1>Mapbox Survey</h1>
      {renderQuestions()}
      <div>
        {currentPage === 0 && <button onClick={onBack}>Zurück zur Einverständniserklärung</button>}
        {currentPage > 0 && (
          <button onClick={handlePreviousPage}>Vorherige Seite</button>
        )}
        {((mapMarks.features && currentPage < mapMarks.features.length) || currentPage == 0) && (
          <button
            onClick={handleNextPage}
            disabled={!mapMarks.features || mapMarks.features.length < minMapMarks}
          >
            Nächste Seite
          </button>
        )}
        {(mapMarks.features && currentPage === mapMarks.features.length && currentPage != 0) && (
          <button onClick={handleComplete}>Nächste Seite</button>
        )}
      </div>
    </div>
  );
};

export default MapboxSurvey;
