import React, { useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";
import GLOBALS from "./Globals"

import 'mapbox-gl/dist/mapbox-gl.css';

const mapboxApiKey = import.meta.env.VITE_MAPBOX_API_KEY

const MapboxComponent = ({ onComplete }) => {
  const [viewState, setViewState] = useState({
      latitude: 51.16,
      longitude: 10.45,
      zoom: 7
  });

  const [marks, setMarks] = useState([]);
  const [currentMark, setCurrentMark] = useState(1);

  const handleMapClick = (event) => {
    const newMark = {
      latitude: event.lngLat.lat,
      longitude: event.lngLat.lng,
      markNumber: currentMark,
    };
    console.log(newMark)
    setMarks([...marks, newMark]);
    setCurrentMark(currentMark + 1);

    console.log(marks)
    console.log(currentMark)

    onComplete(marks);
  };

  return (
    <div>

      <Map
        {...viewState}
        style={{width: 800, height: 600}}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={mapboxApiKey}
        onClick={handleMapClick}
        onMove={evt => setViewState(evt.viewState)}
      >
        {marks.map((mark) => (
            <Marker
              key={mark.markNumber}
              latitude={mark.latitude}
              longitude={mark.longitude}
            >
              <div className="marker">{mark.markNumber}</div>
            </Marker>
          ))}
      </Map>

    </div>
  );
};

export default MapboxComponent;
