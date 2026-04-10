"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import MechanicCard from "@/components/MechanicCard";
import { Search, Loader2, LayoutGrid, Map as MapIcon, Wrench, Car, Truck } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically import the Map to prevent SSR/Window errors
const MechanicMap = dynamic(() => import('@/components/MechanicMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-white rounded-[2.5rem] flex items-center justify-center border border-gray-100 shadow-inner">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-red-500" size={32} />
        <p className="text-gray-400 font-bold text-xs tracking-widest uppercase">Initializing Map</p>
      </div>
    </div>
  )
});

// MATH: Haversine Formula for Proximity Sorting
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's Radius in KM
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Home() {
  // STATE MANAGEMENT
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [view, setView] = useState("list");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchMechanics();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      });
    }
  };

  const fetchMechanics = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('mechanics').select('*');
      if (error) throw error;
      setMechanics(data || []);
    } catch (err) {
      console.error("Database Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // LOGIC: Data Enrichment & Filtering
  const filteredMechanics = mechanics
    .map(mech => ({
      ...mech,
      distance: userLocation ? calculateDistance(userLocation.latitude, userLocation.longitude, mech.lat, mech.lng) : null
    }))
    .filter(mech => {
      const matchesSearch = mech.location.toLowerCase().includes(search.toLowerCase()) ||
        mech.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || mech.type === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Closest mechanics first
      if (a.distance && b.distance) return a.distance - b.distance;
      return 0;
    });

  return (
    <main className="min-h-screen bg-[#fafafa] relative overflow-x-hidden pb-20">

      {/* 1. PREMIUM MESH BACKGROUND */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-100 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px]"></div>
      </div>

      {/* 2. ELEGANT HEADER */}
      <header className="max-w-7xl mx-auto px-6 pt-16 pb-10 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-2">
            CITY<span className="text-blue-600">MECH</span>
          </h1>
          <p className="text-gray-400 font-bold text-xs tracking-[0.3em] uppercase">
            Hyderabad's Official Emergency Network
          </p>
        </div>

        {/* VIEW TOGGLE WITH POINTER CURSOR */}
        <div className="flex bg-white p-1.5 rounded-3xl shadow-sm border border-gray-100">
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${view === "list" ? "bg-gray-900 text-white shadow-xl" : "text-gray-400 hover:bg-gray-50"}`}
          >
            <LayoutGrid size={16} /> LIST
          </button>
          <button
            onClick={() => setView("map")}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${view === "map" ? "bg-gray-900 text-white shadow-xl" : "text-gray-400 hover:bg-gray-50"}`}
          >
            <MapIcon size={16} /> MAP
          </button>
        </div>
      </header>

      {/* 3. SEARCH & FILTERS */}
      <div className="max-w-7xl mx-auto px-6 mb-12 space-y-8">
        <div className="relative group max-w-2xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-red-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by area or workshop name..."
            className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-white border border-gray-100 focus:ring-4 focus:ring-red-500/5 outline-none transition-all shadow-sm text-gray-700 font-medium"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {["All", "Bike", "Car", "Towing"].map((type) => (
            <button
              key={type}
              onClick={() => setCategory(type)}
              className={`px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase whitespace-nowrap transition-all border cursor-pointer flex items-center gap-3 ${category === type
                  ? "bg-red-600 text-white border-red-600 shadow-xl shadow-red-500/20"
                  : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
                }`}
            >
              {type === "Bike" && <Wrench size={14} />}
              {type === "Car" && <Car size={14} />}
              {type === "Towing" && <Truck size={14} />}
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 4. MAIN CONTENT AREA */}
      <section className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-red-500 mb-6" size={48} />
            <p className="text-gray-400 font-black text-xs tracking-widest uppercase">Fetching Providers</p>
          </div>
        ) : filteredMechanics.length > 0 ? (
          view === "list" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredMechanics.map((mech) => (
                <MechanicCard key={mech.id} {...mech} />
              ))}
            </div>
          ) : (
            <div className="rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-gray-100">
              <MechanicMap mechanics={filteredMechanics} />
            </div>
          )
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <h3 className="text-gray-900 font-black text-xl mb-2">No mechanics found</h3>
            <p className="text-gray-400 text-sm">Try searching for a different area or category.</p>
          </div>
        )}
      </section>
    </main>
  );
}