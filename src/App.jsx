import React, { useState } from "react";
import Home from "./Home.jsx";
import UserAgreement from "./UserAgreement.jsx";
import Survey from "./Survey.jsx";
import "./App.css"

function App() {
  const [showAgreement, setShowAgreement] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);

  const handleToUserAgreement = () => {
    setShowAgreement(true);
  };

  const handleAcceptAgreement = () => {
    setShowAgreement(false);
    setShowSurvey(true);
  };

  const handleBackToHome = () => {
    setShowAgreement(false);
    setShowSurvey(false);
  };

  const handleBackToAgreement = () => {
    setShowAgreement(true);
    setShowSurvey(false);
  };

  return (
    <div className="App">
      {!showAgreement && !showSurvey && (
        <Home onToUserAgreement={handleToUserAgreement} />
      )}
      {showAgreement && (
        <UserAgreement onAccept={handleAcceptAgreement} onBack={handleBackToHome} />
      )}
      {showSurvey && <Survey onBack={handleBackToAgreement} />}
    </div>
  );
}

export default App;