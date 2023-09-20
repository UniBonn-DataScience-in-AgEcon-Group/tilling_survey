import React, { useState } from "react";
import Home from "./Home.jsx";
import UserAgreement from "./UserAgreement.jsx";
import MapboxSurvey from "./MapboxSurvey.jsx"; // Import the MapboxSurvey component
import Survey from "./Survey.jsx";
import "./App.css"

function App() {
  const [showAgreement, setShowAgreement] = useState(false);
  const [showMapboxSurvey, setShowMapboxSurvey] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false); // Add a flag for Survey
  const [responses, setResponses] = useState({});

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
    console.log(responses);
  }

  return (
    <div className="App">
      {!showAgreement && !showMapboxSurvey && !showSurvey && (
        <Home onToUserAgreement={handleToUserAgreement} />
      )}
      {showAgreement && (
        <UserAgreement onAccept={handleAcceptAgreement} onBack={handleBackToHome} />
      )}
      {showMapboxSurvey && (
        <MapboxSurvey onComplete={handleMapboxResponses}
          onBack={handleBackToHome}
          responses={responses}
          updateResponses={setResponses} />
      )}
      {/* Conditionally render the Survey component */}
      {showSurvey && <Survey onBack={handleAcceptAgreement} responses={responses} updateResponses={setResponses} onComplete={handleSurveyResponses}/>}
    </div>
  );
}

export default App;
