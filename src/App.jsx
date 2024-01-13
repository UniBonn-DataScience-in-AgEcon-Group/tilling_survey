import React, { useState, useEffect } from "react";
import Home from "./Home.jsx";
import UserAgreement from "./UserAgreement.jsx";
import MapboxSurvey from "./MapboxSurvey.jsx";
import Survey from "./Survey.jsx";
import surveyQuestions from "./Questions";
import Completion from "./Completion.jsx";
import "./App.css"
import PouchDB from "pouchdb-browser";

const dbName = import.meta.env.VITE_DB_NAME

function App() {
  const [showAgreement, setShowAgreement] = useState(false);
  const [showMapboxSurvey, setShowMapboxSurvey] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false); // Add a flag for Survey
  const [responses, setResponses] = useState({"coords": {features: [], type: "FeatureCollection"}, "survey_questions": Array(surveyQuestions.length).fill({})});
  const [db, setDb] = useState(null);
  const [currentPage, setCurrentPage] = useState("homepage");

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

  const handleToAgreement = () => {
    setCurrentPage("agreement");
  };

  const handleToHome = () => {
    setCurrentPage("homepage");
  };

  const handleToCompletion = () => {
    setCurrentPage("completion");
  }

  const handleToSurvey = () => {
    setCurrentPage("survey");
  }

  const handleToMapbox = () => {
    setCurrentPage("mapbox");
  }

  const handleMapboxResponses = (mapboxResponses) => {
    const updatedResponses = { ...responses };
    updatedResponses["coords"] = mapboxResponses;

    setResponses(updatedResponses);
    handleToSurvey();
  };

  const handleSurveyResponses = (surveyResponses) => {
    const updatedResponses = { ...responses, ...surveyResponses };

    setResponses(updatedResponses);
  }

  return (
    <div className="App">
      <header className="header">
        <p>Header Platzhalter</p>
      </header>

      <div className="Content">
          {currentPage === "homepage" && (
            <Home onToUserAgreement={handleToAgreement} />
          )}
          {currentPage === "agreement" && (
            <UserAgreement onAccept={handleToMapbox}
              onBack={handleToHome}
            />
          )}
          {currentPage === "mapbox" && (
            <MapboxSurvey onComplete={handleMapboxResponses}
              onBack={handleToAgreement}
              responses={responses}
              updateResponses={setResponses}
            />
          )}
          {currentPage === "survey" &&
            <Survey onBack={handleToMapbox}
              responses={responses}
              updateResponses={setResponses}
              onComplete={handleToCompletion}
          />}
          {currentPage === "completion" &&
            <Completion onBack={handleToSurvey}
              appResponses={responses}
              updateReponses={setResponses}
              database={db}
            />}
      </div>

      <footer className="footer">
        <p>Footer Platzhalter</p>
      </footer>  
    </div>
  );
}

export default App;
