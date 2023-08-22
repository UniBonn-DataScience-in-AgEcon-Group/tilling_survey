import React from "react";

const Home = ({ onToUserAgreement }) => {
  return (
    <div>
      <h1>Willkommen zu unserer Umfrage zur Pflügetiefe!</h1>
      <p>Platzhalter</p>
      <button onClick={onToUserAgreement}>Zur Einverständniserklärung</button>
    </div>
  );
};

export default Home;