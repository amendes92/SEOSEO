import React, { useState } from 'react';
import { 
  Store, MapPin, Phone, Globe, Star, Clock, 
  Navigation, MessageSquare, Search, Loader2, Map as MapIcon, Eye
} from 'lucide-react';
import { getBusinessProfile } from '../../services/geminiService';
import { BusinessProfile, ProcessingState } from '../../types';

const GoogleBusinessProfile: React.FC = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.IDLE);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'reviews' | 'map' | 'streetview'>('reviews');

  // Use the environment variable, but fallback to the provided token if missing/undefined in the browser context
  const API_KEY = process.env.API_KEY || "AIzaSyDnPfZQAuZP9Hl3S734fvXM1q4UrxhXZ-w";

  const handleSearch = async () => {
    if (!query.trim()) return;
    setStatus(ProcessingState.PROCESSING);
    setProfile(null);
    try {
      const data = await getBusinessProfile(query);
      setProfile(data);
      setStatus(ProcessingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(ProcessingState.ERROR);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-4 h-4 ${star <= Math.round(rating) ? 'fill-current' : 'text-slate-600'}`} 
          />
        ))}
      </div>
    );
  };

  // Construct URLs for Google Maps Embed API
  const getEmbedUrl = (location: string) => {
    const q = encodeURIComponent(location);
    return `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${q}`;
  };

  // Updated to use Embed API (Interactive)
  const getStreetViewEmbedUrl = (lat: number, lng: number) => {
    // Default fallback coordinates if lat/lng are missing (using the ones provided in prompt as safe default)
    const latitude = lat || -23.605717;
    const longitude = lng || -46.66553;
    return `https://www.google.com/maps/embed/v1/streetview?key=${API_KEY}&location=${latitude},${longitude}&heading=0&pitch=0&fov=90`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-4">
             <div className="bg-blue-500/10 p-4 rounded-full border border-blue-500/20">
               <Store className="w-8 h-8 text-blue-500" />
             </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Google Meu Negócio</h1>
          <p className="text-slate-400 mb-8">
            Manage your presence on Google. Retrieve detailed Business Profiles, aggregate reviews, and view map data via Places API (New) & Maps Embed API.
          </p>
          
          <div className="flex gap-2 relative">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search business (e.g., 'Padaria do João SP' or 'Ibirapuera Park')"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button 
              onClick={handleSearch}
              disabled={status === ProcessingState.PROCESSING || !query}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {status === ProcessingState.PROCESSING ? <Loader2 className="animate-spin" /> : "Search"}
            </button>
          </div>
        </div>
      </div>

      {status === ProcessingState.PROCESSING && (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p>Connecting to Places API & Aggregating Reviews...</p>
        </div>
      )}

      {status === ProcessingState.ERROR && (
        <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-6 text-center text-red-300">
          <p>Could not find business information. Please try a more specific name or location.</p>
        </div>
      )}

      {status === ProcessingState.SUCCESS && profile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slideUp">
          
          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                  <p className="text-slate-400 text-sm mt-1">{profile.category}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">{profile.rating}</span>
                    {renderStars(profile.rating)}
                  </div>
                  <span className="text-xs text-slate-500">({profile.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start gap-3 text-slate-300">
                  <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{profile.address}</span>
                </div>
                {profile.phoneNumber && (
                  <div className="flex items-center gap-3 text-slate-300">
                    <Phone className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm">{profile.phoneNumber}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-3 text-slate-300">
                    <Globe className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white underline decoration-slate-600 underline-offset-4">
                      Visit Website
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3 text-slate-300">
                  <Clock className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span className={`text-sm font-medium ${profile.isOpen ? 'text-emerald-400' : 'text-red-400'}`}>
                    {profile.isOpen ? 'Open Now' : 'Closed'}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <MessageSquare className="w-24 h-24 text-blue-500" />
               </div>
               <h3 className="text-lg font-semibold text-white mb-3">AI Business Summary</h3>
               <p className="text-slate-300 leading-relaxed">
                 {profile.summary}
               </p>
            </div>

            {/* Tabs Area */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="flex border-b border-slate-800">
                <button 
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'reviews' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <MessageSquare className="w-4 h-4" /> Reviews
                </button>
                <button 
                  onClick={() => setActiveTab('map')}
                  className={`flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'map' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <MapIcon className="w-4 h-4" /> Location Map
                </button>
                <button 
                  onClick={() => setActiveTab('streetview')}
                  className={`flex-1 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'streetview' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <Eye className="w-4 h-4" /> Street View
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {profile.reviews && profile.reviews.length > 0 ? (
                      profile.reviews.map((review, idx) => (
                        <div key={idx} className="border-b border-slate-800 last:border-0 pb-4 last:pb-0">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-white text-sm">{review.author}</span>
                            <span className="text-xs text-slate-500">{review.relativeTime}</span>
                          </div>
                          <div className="mb-2">
                             {renderStars(review.rating)}
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed">"{review.text}"</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-center py-4">No detailed reviews available via API.</p>
                    )}
                  </div>
                )}

                {activeTab === 'map' && (
                  <div className="w-full h-[400px] bg-slate-950 rounded-lg overflow-hidden border border-slate-800 relative">
                     <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        src={getEmbedUrl(profile.address || profile.name)}
                      ></iframe>
                  </div>
                )}

                {activeTab === 'streetview' && (
                   <div className="w-full h-[400px] bg-slate-950 rounded-lg overflow-hidden border border-slate-800 relative">
                     {profile.location ? (
                       <iframe
                         width="100%"
                         height="100%"
                         style={{ border: 0 }}
                         loading="lazy"
                         allowFullScreen
                         src={getStreetViewEmbedUrl(profile.location.lat, profile.location.lng)}
                       ></iframe>
                     ) : (
                       <div className="text-slate-500 text-center h-full flex flex-col items-center justify-center">
                         <Navigation className="w-12 h-12 mx-auto mb-2 opacity-50" />
                         <p>Street View coordinates not available.</p>
                       </div>
                     )}
                   </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar / Actions */}
          <div className="space-y-6">
             <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
               <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
               <div className="space-y-3">
                 <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                   Reply to Reviews
                 </button>
                 <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700">
                   Edit Profile Info
                 </button>
                 <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700">
                   Manage Photos
                 </button>
               </div>
             </div>

             <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4">Performance</h3>
                <div className="space-y-4">
                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span className="text-slate-400">Profile Views</span>
                       <span className="text-white font-mono">1,240</span>
                     </div>
                     <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 w-[70%]"></div>
                     </div>
                   </div>
                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span className="text-slate-400">Searches</span>
                       <span className="text-white font-mono">856</span>
                     </div>
                     <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 w-[55%]"></div>
                     </div>
                   </div>
                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span className="text-slate-400">Website Clicks</span>
                       <span className="text-white font-mono">320</span>
                     </div>
                     <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-purple-500 w-[40%]"></div>
                     </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default GoogleBusinessProfile;