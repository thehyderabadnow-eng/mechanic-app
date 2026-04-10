"use client";
import { PhoneCall, MapPin, Wrench, Car, Truck } from "lucide-react";

// 1. Add 'distance' to the list of props
export default function MechanicCard({ name, location, type, status, phone, distance }) {

  // Helper to show the right icon based on type
  const getIcon = () => {
    switch (type) {
      case "Bike": return <Wrench size={18} />; // Changed Tool to Wrench
      case "Car": return <Car size={18} />;
      case "Towing": return <Truck size={18} />;
      default: return <Wrench size={18} />;
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">

      {/* 2. DISTANCE BADGE - Only shows if distance is calculated */}
      {distance !== null && distance !== undefined && (
        <div className="absolute top-4 right-4 bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-lg border border-green-100">
          {distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)} km`} away
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-red-50 text-red-600 rounded-xl">
          {getIcon()}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <MapPin size={14} /> {location}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Service: <span className="text-gray-700">{type}</span>
        </span>
        <span className={`text-xs font-bold px-2 py-1 rounded-md ${status === "Available" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
          }`}>
          {status}
        </span>
      </div>

      {/* 3. CLICK TO CALL LOGIC */}
      <a
        href={`tel:${phone}`}
        className="flex items-center justify-center gap-2 w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-all active:scale-95"
      >
        <PhoneCall size={18} />
        Call Now
      </a>
    </div>
  );
}