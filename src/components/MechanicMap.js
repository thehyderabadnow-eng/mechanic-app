"use client";
import * as React from 'react';
import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';

export default function MechanicMap({ mechanics }) {
  const [selectedMech, setSelectedMech] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: 78.5950,
    latitude: 17.3280,
    zoom: 12,
    pitch: 45 // Adds a slight 3D perspective to the map
  });

  // Function to find the user's GPS position
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = { 
          longitude: pos.coords.longitude, 
          latitude: pos.coords.latitude 
        };
        setUserLocation(coords);
        setViewState({ 
          ...viewState, 
          ...coords, 
          zoom: 15, 
          transitionDuration: 1500 
        });
      });
    }
  };

  return (
    <div className="relative h-[600px] w-full bg-white group">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        className="w-full h-full"
      >
        {/* 1. PREMIUM LOCATE ME BUTTON */}
        <button 
          onClick={handleLocateMe}
          className="absolute top-6 right-6 z-20 bg-white text-red-600 p-4 rounded-2xl shadow-2xl hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer active:scale-90 border border-gray-100"
          title="Find my location"
        >
          <Navigation size={22} fill="currentColor" />
        </button>

        {/* 2. USER LOCATION (THE BLUE PULSE) */}
        {userLocation && (
          <Marker longitude={userLocation.longitude} latitude={userLocation.latitude} anchor="center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-10 h-10 bg-blue-500/30 rounded-full animate-ping"></div>
              <div className="absolute w-6 h-6 bg-blue-500/20 rounded-full"></div>
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
            </div>
          </Marker>
        )}

        {/* 3. MECHANIC MARKERS */}
        {mechanics.map((mech) => (
          <Marker 
            key={mech.id} 
            longitude={parseFloat(mech.lng)} 
            latitude={parseFloat(mech.lat)} 
            anchor="bottom"
          >
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                setSelectedMech(mech); 
              }}
              className="group/marker flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-125"
            >
              <div className="bg-white p-1 rounded-full shadow-lg border border-gray-100 mb-1">
                 <div className="bg-red-600 p-2 rounded-full text-white shadow-inner">
                    <MapPin size={20} fill="currentColor" />
                 </div>
              </div>
              {/* Subtle label that appears on hover */}
              <span className="bg-gray-900 text-white text-[8px] font-black px-2 py-0.5 rounded opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-tighter">
                {mech.name}
              </span>
            </button>
          </Marker>
        ))}

        {/* 4. ELEGANT INFO POPUP */}
        {selectedMech && (
          <Popup
            longitude={parseFloat(selectedMech.lng)}
            latitude={parseFloat(selectedMech.lat)}
            anchor="top"
            onClose={() => setSelectedMech(null)}
            closeButton={false} // We will use our own close style
            className="z-50"
          >
            <div className="p-3 min-w-[150px] relative">
              <button 
                onClick={() => setSelectedMech(null)}
                className="absolute -top-1 -right-1 text-gray-400 hover:text-red-600 transition-colors"
              >
                <X size={14} />
              </button>

              <h4 className="font-black text-gray-900 text-sm mb-1 leading-tight">
                {selectedMech.name}
              </h4>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                <span className="text-[9px] font-black text-red-600 uppercase tracking-widest">
                  {selectedMech.type}
                </span>
                {selectedMech.distance && (
                  <span className="text-[9px] font-bold text-gray-400">
                    {selectedMech.distance.toFixed(1)} KM
                  </span>
                )}
              </div>
              
              <a 
                href={`tel:${selectedMech.phone}`}
                className="mt-3 block text-center bg-gray-900 text-white text-[10px] font-black py-2 rounded-lg hover:bg-red-600 transition-colors uppercase tracking-widest"
              >
                Call Now
              </a>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}