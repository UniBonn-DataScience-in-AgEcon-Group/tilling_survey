import React, { useState, useEffect } from "react";

const Completion = ({ onBack, appResponses, updateResponses, onComplete, database }) => {
  const [postStatus, setPostStatus] = useState(null);
  const [contestAndResultsInfo, setContestAndResultsInfo] = useState({
    isParticipatingInContest: false,
    isInterestedInResults: false,
    email: ""
  });

  const handleChange = (field, value) => {
    setContestAndResultsInfo(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleSubmitFinal = () => {
    if (database) {
      // Use the post method to add a new document with a generated ID
      const documentsToSave = [appResponses, contestAndResultsInfo];
      database.bulkDocs(documentsToSave)
        .then(response => {
          console.log('Document saved successfully:', response);

          // After posting, fetch and log all entries from the database
          setPostStatus('success');
          return database.allDocs({ include_docs: true });
        })
        .then(result => {
          console.log('All entries in the database:', result.rows.map(row => row.doc));
        })
        .catch(error => {
          console.error('Error saving or fetching documents:', error);
          setPostStatus('error');
        });
    }
  }

  return (
    <div>
      <h1>Teilnahme am Gewinnspiel & Bekanntgabe der Ergebnisse</h1>
      <div>
      <p>Falls Sie Interesse haben, können Sie an unserem Gewinnspiel teilnehmen. Außerdem können wir Ihnen Bescheid geben, sobald unsere Ergebnisse veröffentlicht sind.<br/>
      Klicken Sie dazu die unteren Felder an und hinterlassen Sie uns ihre E-Mail Adresse. Die E-Mail Adresse wird getrennt von ihren Angaben in der Umfrage gespeichert<br/>
      und lässt keine Rückschlüsse auf Ihre Antworten zu.</p>

      <div>
      <input
            type="checkbox"
            checked={contestAndResultsInfo.isParticipatingInContest}
            onChange={(e) => handleChange('isParticipatingInContest', e.target.checked)}
          />
          <label>Teilnahme am Gewinnspiel</label>
        </div>
        
        <div>
          <input
            type="checkbox"
            checked={contestAndResultsInfo.isInterestedInResults}
            onChange={(e) => handleChange('isInterestedInResults', e.target.checked)}
          />
          <label>Interessiert an den Ergebnissen</label>
        </div>

        <div>
          <input
            type="email"
            value={contestAndResultsInfo.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Ihre E-Mail Adresse"
          />
        </div>

        <button onClick={onBack}>Vorherige Seite</button>
        <button onClick={handleSubmitFinal}>Abschicken</button>
        {postStatus === 'success' && <p style={{ color: 'green' }}>Ihre Ergebnisse wurden erfolgreich abgeschickt. Vielen Dank für Ihre Teilnahme!</p>}
        {postStatus === 'error' && <p style={{ color: 'red' }}>Es ist leider ein Fehler aufgetreten. Bitte versuchen Sie es nachher erneut. Wir bitte, die Unannehmlichkeiten zu entschuldigen.</p>}
      </div>
    </div>
  );
};

export default Completion;
