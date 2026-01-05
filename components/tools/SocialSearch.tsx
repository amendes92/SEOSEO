import React, { useState } from 'react';
import { 
  Search, Facebook, Instagram, Linkedin, Twitter, Youtube, 
  Globe, ExternalLink, Loader2, Share2, UserCheck, AlertCircle 
} from 'lucide-react';
import { findSocialProfiles } from '../../services/geminiService';
import { SocialProfileResult, ProcessingState } from '../../types';

const SocialSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProcessingState>(ProcessingState.IDLE);
  const [result, setResult] = useState<SocialProfileResult | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setStatus(ProcessingState.PROCESSING);
    setResult(null);
    try {
      const data = await findSocialProfiles(query);
      setResult(data);
      setStatus(ProcessingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(ProcessingState.ERROR);
    }
  };

  const platforms = [
    { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
    { key: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-600/10', border: 'border-blue-600/20' },
    { key: 'twitter', label: 'X / Twitter', icon: Twitter, color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', bg: 'bg-blue-700/10', border: 'border-blue-700/20' },
    { key: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-600', bg: 'bg-red-600/10', border: 'border-red-600/20' },
    { key: 'website', label: 'Website', icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-4">
             <div className="bg-purple-500/10 p-4 rounded-full border border-purple-500/20">
               <Share2 className="w-8 h-8 text-purple-500" />
             </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Social Radar</h1>
          <p className="text-slate-400 mb-8">
            Enter a person or company name to instantly discover their official social media footprint and digital presence using Google Search Grounding.
          </p>
          
          <div className="flex gap-2 relative">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search name (e.g., 'Elon Musk', 'Coca-Cola', 'Anitta')"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button 
              onClick={handleSearch}
              disabled={status === ProcessingState.PROCESSING || !query}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {status === ProcessingState.PROCESSING ? <Loader2 className="animate-spin" /> : "Scan"}
            </button>
          </div>
        </div>
      </div>

      {status === ProcessingState.PROCESSING && (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-4">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          <p>Scanning social networks...</p>
        </div>
      )}

      {status === ProcessingState.ERROR && (
        <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-6 text-center text-red-300">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Could not find profiles for this query. Please check the spelling or try a more specific name.</p>
        </div>
      )}

      {status === ProcessingState.SUCCESS && result && (
        <div className="animate-slideUp space-y-6">
          
          {/* Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-start gap-4">
             <div className="p-3 bg-slate-800 rounded-full hidden md:block">
               <UserCheck className="w-8 h-8 text-slate-300" />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-white mb-2">{result.entityName}</h2>
               <p className="text-slate-300 leading-relaxed">{result.summary}</p>
             </div>
          </div>

          {/* Social Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((platform) => {
              // @ts-ignore
              const url = result.profiles[platform.key];
              const Icon = platform.icon;
              
              return (
                <div 
                  key={platform.key}
                  className={`relative p-5 rounded-xl border transition-all ${
                    url 
                    ? `bg-slate-900 border-slate-800 hover:border-slate-600` 
                    : 'bg-slate-950 border-slate-900 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${platform.bg}`}>
                      <Icon className={`w-5 h-5 ${platform.color}`} />
                    </div>
                    <span className={`font-semibold ${url ? 'text-white' : 'text-slate-600'}`}>
                      {platform.label}
                    </span>
                  </div>

                  {url ? (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-500 truncate">{url}</p>
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors gap-2"
                      >
                        View Profile <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <div className="h-12 flex items-center text-sm text-slate-600 italic">
                      Not found
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
};

export default SocialSearch;