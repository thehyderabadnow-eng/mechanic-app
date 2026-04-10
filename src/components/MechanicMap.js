"use client";
import * as React from 'react';
import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function MechanicMap({ mechanics }) {
  const [selectedMech, setSelectedMech] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: 78.5950,
    latitude: 17.3280,
    zoom: 12
  });

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = { longitude: pos.coords.longitude, latitude: pos.coords.latitude };
        setUserLocation(coords);
        setViewState({ ...viewState, ...coords, zoom: 14, transitionDuration: 1000 });
      });
    }
  };

  return (
    <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-md border border-gray-200">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {/* Locate Me Button */}
        <button 
          onClick={handleLocateMe}
          className="absolute top-4 right-4 z-10 bg-white p-3 rounded-full shadow-xl hover:bg-gray-50 text-red-600 transition-all active:scale-95"
        >
          <Navigation size={20} fill="currentColor" />
        </button>

        {/* User Location Blue Dot */}
        {userLocation && (
          <Marker longitude={userLocation.longitude} latitude={userLocation.latitude} anchor="center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-ping"></div>
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
            </div>
          </Marker>
        )}

        {/* Mechanic Markers */}
        {mechanics.map((mech) => (
          <Marker 
            key={mech.id} 
            longitude={parseFloat(mech.lng)} 
            latitude={parseFloat(mech.lat)} 
            anchor="bottom"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedMech(mech); }}
              className="text-red-600 hover:scale-125 transition-transform"
            >
              <MapPin size={32} fill="white" className="drop-shadow-lg" />
            </button>
          </Marker>
        ))}

        {selectedMech && (
          <Popup
            longitude={parseFloat(selectedMech.lng)}
            latitude={parseFloat(selectedMech.lat)}
            anchor="top"
            onClose={() => setSelectedMech(null)}
          >
            <div className="p-1">
              <h4 className="font-bold text-gray-900">{selectedMech.name}</h4>
              <p className="text-[10px] text-red-600 font-bold uppercase">{selectedMech.type}</p>
              {selectedMech.distance && (
                <p className="text-[10px] text-gray-500">{selectedMech.distance.toFixed(1)} km away</p>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}