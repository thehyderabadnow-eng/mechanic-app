"use client";
import { PhoneCall, MapPin, Wrench, Car, Truck } from "lucide-react";

export default function MechanicCard({ name, location, type, status, phone, distance }) {
  // Gradient themes by service type
  const themes = {
    Bike: "from-orange-400 to-red-500",
    Car: "from-blue-500 to-indigo-600",
    Towing: "from-gray-700 to-gray-900",
  };

  const getVisualHeader = () => (
    <div
      className={`h-44 sm:h-56 w-full bg-gradient-to-br ${themes[type] || themes.Bike
        } relative flex items-center justify-center overflow-hidden`}
    >
      {/* Distance Badge */}
      {distance !== null && (
        <div className="absolute top-5 right-5 bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full border border-white/30 shadow-sm z-20">
          {distance < 1 ? `${(distance * 1000).toFixed(0)}M` : `${distance.toFixed(1)} KM`} AWAY
        </div>
      )}

      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10 flex flex-wrap gap-6 p-4 rotate-12 scale-150 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <Wrench key={i} size={28} className="text-white" />
        ))}
      </div>

      {/* Central Icon */}
      <div className="z-10 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
        {type === "Bike" && <Wrench size={48} className="text-white" />}
        {type === "Car" && <Car size={48} className="text-white" />}
        {type === "Towing" && <Truck size={48} className="text-white" />}
      </div>
    </div>
  );

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      {getVisualHeader()}

      <div className="p-6 sm:p-8">
        {/* Identity */}
        <div className="mb-5">
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-500">
            <MapPin size={16} className="text-red-500" />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">
              {location}
            </span>
          </div>
        </div>

        {/* Service & Status */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Specialization
            </span>
            <span className="text-sm font-semibold text-gray-700">
              {type} Services
            </span>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
            <span
              className={`w-2 h-2 rounded-full ${status === "Available"
                  ? "bg-green-500 animate-pulse"
                  : "bg-orange-400"
                }`}
            ></span>
            <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">
              {status}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <a
          href={`tel:${phone}`}
          className="flex items-center justify-center gap-3 w-full bg-blue-600 text-white font-black py-5 rounded-[1.8rem] hover:bg-gray-900 transition-all cursor-pointer shadow-xl shadow-blue-200 active:scale-95"
        >
          <PhoneCall size={20} />
          CONTACT NOW
        </a>
      </div>
    </div>
  );
}
