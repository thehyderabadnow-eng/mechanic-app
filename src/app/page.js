"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import MechanicCard from "@/components/MechanicCard";
import { Search, Loader2, LayoutGrid, Map as MapIcon, Navigation } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically import the Map to prevent SSR errors
const MechanicMap = dynamic(() => import('@/components/MechanicMap'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center">Loading Map...</div>
});

// The Math Logic: Haversine Formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

export default function Home() {
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
    setLoading(true);
    const { data, error } = await supabase.from('mechanics').select('*');
    if (!error) setMechanics(data || []);
    setLoading(false);
  };

  // Logic: Filter -> Calculate Distance -> Sort
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
      if (a.distance && b.distance) return a.distance - b.distance;
      return 0;
    });

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-black text-red-600 mb-2">URGENT MECH</h1>
        <p className="text-gray-600">Find the nearest help in Hyderabad</p>
      </header>

      {/* Search & Category Section */}
      <div className="max-w-6xl mx-auto space-y-6 mb-8">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search location or name..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none shadow-sm"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {["All", "Bike", "Car", "Towing"].map((type) => (
            <button
              key={type}
              onClick={() => setCategory(type)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                category === type ? "bg-red-600 text-white shadow-lg" : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex justify-end gap-2">
          <div className="bg-gray-200 p-1 rounded-xl flex">
            <button onClick={() => setView("list")} className={`p-2 rounded-lg ${view === "list" ? "bg-white shadow-sm" : "text-gray-500"}`}><LayoutGrid size={20} /></button>
            <button onClick={() => setView("map")} className={`p-2 rounded-lg ${view === "map" ? "bg-white shadow-sm" : "text-gray-500"}`}><MapIcon size={20} /></button>
          </div>
        </div>
      </div>

      <section className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-red-600" size={40} /></div>
        ) : (
          view === "list" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredMechanics.map((mech) => <MechanicCard key={mech.id} {...mech} />)}
            </div>
          ) : (
            <MechanicMap mechanics={filteredMechanics} />
          )
        )}
      </section>
    </main>
  );
}