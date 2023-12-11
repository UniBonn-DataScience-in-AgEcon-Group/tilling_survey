import React, { useState, useEffect } from "react";
import Home from "./Home.jsx";
import UserAgreement from "./UserAgreement.jsx";
import MapboxSurvey from "./MapboxSurvey.jsx";
import Survey from "./Survey.jsx";
import "./App.css"
import PouchDB from "pouchdb-browser";

const dbName = import.meta.env.VITE_DB_NAME

function App() {
  const [showAgreement, setShowAgreement] = useState(false);
  const [showMapboxSurvey, setShowMapboxSurvey] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false); // Add a flag for Survey
  const [responses, setResponses] = useState({});
  const [db, setDb] = useState(null);

  useEffect(() => {
    // Initialize PouchDB with the database name
    const pouchDb = new PouchDB(dbName);

    // Save the PouchDB instance to state
    setDb(pouchDb);

    // Do any other setup or data fetching here

    // Cleanup on unmount
    return () => {
      pouchDb.close();
    };
  }, []); // Empty dependency array to run this effect only once

  const handleToUserAgreement = () => {
    setShowAgreement(true);
  };

  const handleAcceptAgreement = () => {
    setShowAgreement(false);
    setShowMapboxSurvey(true); // Show MapboxSurvey when the agreement is accepted
    setShowSurvey(false);
  };

  const handleBackToHome = () => {
    setShowAgreement(false);
    setShowMapboxSurvey(false); // Hide MapboxSurvey when going back to Home
    setShowSurvey(false); // Hide Survey as well
  };

  const handleBackToAgreement = () => {
    setShowAgreement(true);
    setShowMapboxSurvey(false); // Hide MapboxSurvey when going back to Agreement
    setShowSurvey(false); // Hide Survey as well
  };

  const handleMapboxResponses = (mapboxResponses) => {
    const updatedResponses = { ...responses };

    mapboxResponses.forEach((response, index) => {
      // Create a key like "coords_0", "coords_1", etc.
      const key = `coords_${index}`;
      
      // Add the response data to the updatedResponses object
      updatedResponses[key] = response;
    });

    setResponses(updatedResponses);
    setShowSurvey(true);
    setShowMapboxSurvey(false);
  };

  const handleSurveyResponses = (surveyResponses) => {
    const updatedResponses = { ...responses, ...surveyResponses };

    setResponses(updatedResponses);
  }

  const handleSubmitFinal = () => {
    if (db) {
      // Use the post method to add a new document with a generated ID
      db.post(responses)
        .then(response => {
          console.log('Document saved successfully:', response);

          // After posting, fetch and log all entries from the database
          return db.allDocs({ include_docs: true });
        })
        .then(result => {
          console.log('All entries in the database:', result.rows.map(row => row.doc));
        })
        .catch(error => {
          console.error('Error saving or fetching documents:', error);
        });
    }
  }

  return (
    <div className="App">
      {!showAgreement && !showMapboxSurvey && !showSurvey && (
        <Home onToUserAgreement={handleToUserAgreement} />
      )}
      {showAgreement && (
        <UserAgreement onAccept={handleAcceptAgreement}
          onBack={handleBackToHome}
        />
      )}
      {showMapboxSurvey && (
        <MapboxSurvey onComplete={handleMapboxResponses}
          onBack={handleBackToAgreement}
          responses={responses}
          updateResponses={setResponses}
        />
      )}
      {showSurvey &&
        <Survey onBack={handleAcceptAgreement}
          responses={responses}
          updateResponses={setResponses}
          onComplete={handleSubmitFinal}
        />}
    </div>
  );
}

export default App;
