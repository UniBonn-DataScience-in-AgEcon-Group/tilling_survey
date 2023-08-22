import React, { useState } from "react";

const UserAgreement = ({ onAccept, onBack }) => {
  const [accepted, setAccepted] = useState(false);

  const handleCheckboxChange = () => {
    setAccepted(!accepted);
  };

  const handleAccept = () => {
    if (accepted) {
      onAccept();
    }
  };

  return (
    <div>
      <h1>Einverständniserklärung</h1>
      <p>Bitte lesen Sie sich die folgende Einverständniserklärung sorgfältig durch.</p>
      <label>
        <input
          type="checkbox"
          checked={accepted}
          onChange={handleCheckboxChange}
        />
        Ich habe die Einverständniserklärung gelesen und akzeptiert.
      </label>
      <br />
    {!accepted && <p><strong>Um zur Umfrage fortzufahren, akzeptieren Sie bitte die Einverständniserklärung.</strong></p>}
      <button onClick={onBack}>Zurück zur Startseite</button>
      <button onClick={handleAccept} disabled={!accepted}>
        Zur Umfrage fortfahren
      </button>
    </div>
  );
};

export default UserAgreement;