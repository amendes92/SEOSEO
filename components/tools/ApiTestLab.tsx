import React, { useState } from 'react';
import { 
  ShieldAlert, Eye, Languages, BrainCircuit, LayoutTemplate, 
  BarChart3, Store, MapPin, Gauge, TrendingUp, Search, 
  Type, FileSpreadsheet, Play, Loader2, CheckCircle2, AlertCircle,
  FlaskConical, Sun, Wind, Flower2, Route, Mountain, Clock,
  Navigation, Globe, Layers, Map as MapIcon, LocateFixed, Zap
} from 'lucide-react';
import { simulateApi, performLiveSearch, performMapsQuery, analyzeImage } from '../../services/geminiService';

interface ApiCardProps {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  defaultInput: string;
  inputType: 'text' | 'image';
  category: 'MAPS' | 'AI' | 'DATA';
  handler: (input: string) => Promise<string>;
}

const ApiTestLab: React.FC = () => {
  const [results, setResults] = useState<Record<string, { status: 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR', output: string }>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<'ALL' | 'MAPS' | 'AI' | 'DATA'>('ALL');

  // Use the environment variable, but fallback to the provided token if missing/undefined in the browser context
  const API_KEY = process.env.API_KEY || "AIzaSyDnPfZQAuZP9Hl3S734fvXM1q4UrxhXZ-w";

  const apiList: ApiCardProps[] = [
    // --- MAPS & ENVIRONMENT ---
    { 
      id: 'places_new', name: 'Places API (New)', icon: MapPin, category: 'MAPS',
      description: 'Query detailed place data (Grounding).', 
      defaultInput: 'Best vegan restaurants in New York', inputType: 'text',
      handler: (input) => performMapsQuery(input)
    },
    { 
      id: 'solar', name: 'Solar API', icon: Sun, category: 'MAPS',
      description: 'Solar potential & savings estimates.', 
      defaultInput: 'Solar potential for 1600 Amphitheatre Pkwy', inputType: 'text',
      handler: (input) => simulateApi('Solar API', input)
    },
    { 
      id: 'airquality', name: 'Air Quality API', icon: Wind, category: 'MAPS',
      description: 'Current air quality index (AQI).', 
      defaultInput: 'Air quality in Tokyo', inputType: 'text',
      handler: (input) => simulateApi('Air Quality API', input)
    },
    { 
      id: 'pollen', name: 'Pollen API', icon: Flower2, category: 'MAPS',
      description: 'Allergen forecasts & heatmaps.', 
      defaultInput: 'Pollen forecast for London', inputType: 'text',
      handler: (input) => simulateApi('Pollen API', input)
    },
    { 
      id: 'routes', name: 'Routes API', icon: Route, category: 'MAPS',
      description: 'Eco-friendly & advanced routing.', 
      defaultInput: 'Eco route from Berlin to Munich', inputType: 'text',
      handler: (input) => simulateApi('Routes API', input)
    },
    { 
      id: 'elevation', name: 'Maps Elevation API', icon: Mountain, category: 'MAPS',
      description: 'Elevation data for coordinates.', 
      defaultInput: 'Elevation of Machu Picchu', inputType: 'text',
      handler: (input) => simulateApi('Maps Elevation API', input)
    },
    { 
      id: 'aerial', name: 'Aerial View API', icon: Layers, category: 'MAPS',
      description: 'Cinematic video of landmarks.', 
      defaultInput: 'Aerial view of Golden Gate Bridge', inputType: 'text',
      handler: (input) => simulateApi('Aerial View API', input)
    },
    { 
      id: 'address_val', name: 'Address Validation API', icon: CheckCircle2, category: 'MAPS',
      description: 'Validate & correct addresses.', 
      defaultInput: 'Validate: 1600 Amphitheatre Pkwy, CA', inputType: 'text',
      handler: (input) => simulateApi('Address Validation API', input)
    },
    { 
      id: 'geolocation', name: 'Geolocation API', icon: LocateFixed, category: 'MAPS',
      description: 'Locate device via cell/wifi.', 
      defaultInput: 'Geolocate current IP context', inputType: 'text',
      handler: (input) => simulateApi('Geolocation API', input)
    },
    { 
      id: 'roads', name: 'Roads API', icon: Navigation, category: 'MAPS',
      description: 'Snap to roads & speed limits.', 
      defaultInput: 'Snap GPS trace to nearest road', inputType: 'text',
      handler: (input) => simulateApi('Roads API', input)
    },
    { 
      id: 'timezone', name: 'Time Zone API', icon: Clock, category: 'MAPS',
      description: 'Time zone data for location.', 
      defaultInput: 'Time zone for Sydney, Australia', inputType: 'text',
      handler: (input) => simulateApi('Time Zone API', input)
    },
    { 
      id: 'maps_static', name: 'Maps Static API', icon: MapIcon, category: 'MAPS',
      description: 'Generate static map images.', 
      defaultInput: 'Static map of Paris center', inputType: 'text',
      handler: (input) => simulateApi('Maps Static API', input)
    },

    // --- AI & INTELLIGENCE ---
    { 
      id: 'vision', name: 'Cloud Vision API', icon: Eye, category: 'AI',
      description: 'Image analysis & OCR.', 
      defaultInput: '', inputType: 'image',
      handler: (input) => {
        let mimeType = 'image/jpeg';
        let base64Data = input;
        if (input.startsWith('data:')) {
          const parts = input.split(',');
          const match = parts[0].match(/:(.*?);/);
          if (match) mimeType = match[1];
          base64Data = parts[1];
        }
        return analyzeImage(base64Data, mimeType, "Analyze this image.");
      }
    },
    { 
      id: 'translate', name: 'Cloud Translation API', icon: Languages, category: 'AI',
      description: 'Multilingual neural translation.', 
      defaultInput: 'Translate "Hello" to 10 languages', inputType: 'text',
      handler: (input) => simulateApi('Cloud Translation API', input)
    },
    { 
      id: 'nlp', name: 'Natural Language API', icon: BrainCircuit, category: 'AI',
      description: 'Sentiment & Entity analysis.', 
      defaultInput: 'Analyze sentiment of this review', inputType: 'text',
      handler: (input) => simulateApi('Cloud Natural Language API', input)
    },
    { 
      id: 'webrisk', name: 'Web Risk API', icon: ShieldAlert, category: 'AI',
      description: 'Malware & Phishing detection.', 
      defaultInput: 'Check http://unsafe-site.example.com', inputType: 'text',
      handler: (input) => simulateApi('Web Risk API', input)
    },

    // --- DATA & BUSINESS ---
    { 
      id: 'search', name: 'Custom Search API', icon: Search, category: 'DATA',
      description: 'Web search grounding.', 
      defaultInput: 'Latest stock market news', inputType: 'text',
      handler: (input) => performLiveSearch(input)
    },
    { 
      id: 'trends', name: 'Google Trends', icon: TrendingUp, category: 'DATA',
      description: 'Search interest analytics.', 
      defaultInput: 'Interest in "AI" vs "Crypto"', inputType: 'text',
      handler: (input) => simulateApi('Google Trends', input)
    },
    { 
      id: 'charts', name: 'Google Charts API', icon: BarChart3, category: 'DATA',
      description: 'Data visualization config.', 
      defaultInput: 'Pie chart of browser usage', inputType: 'text',
      handler: (input) => simulateApi('Google Charts API', input)
    },
    { 
      id: 'business', name: 'Business Profile API', icon: Store, category: 'DATA',
      description: 'Manage location metrics.', 
      defaultInput: 'Performance metrics for main store', inputType: 'text',
      handler: (input) => simulateApi('Business Profile API', input)
    },
    { 
      id: 'ads', name: 'Ads Editor API', icon: FileSpreadsheet, category: 'DATA',
      description: 'Campaign management tools.', 
      defaultInput: 'Create campaign for Summer Sale', inputType: 'text',
      handler: (input) => simulateApi('Google Ads API', input)
    },
    { 
      id: 'pagespeed', name: 'PageSpeed Insights', icon: Gauge, category: 'DATA',
      description: 'Web performance scoring.', 
      defaultInput: 'Analyze google.com', inputType: 'text',
      handler: (input) => simulateApi('PageSpeed Insights API', input)
    },
    { 
      id: 'crux', name: 'Chrome UX Report', icon: LayoutTemplate, category: 'DATA',
      description: 'Real-world user experience.', 
      defaultInput: 'UX metrics for wikipedia.org', inputType: 'text',
      handler: (input) => simulateApi('Chrome UX Report API', input)
    }
  ];

  const handleRunTest = async (apiId: string, handler: (i: string) => Promise<string>, defaultVal: string) => {
    const inputVal = inputs[apiId] ?? defaultVal;
    if (!inputVal && apiId !== 'vision') return;

    setResults(prev => ({ ...prev, [apiId]: { status: 'LOADING', output: '' } }));
    
    try {
      const output = await handler(inputVal);
      setResults(prev => ({ ...prev, [apiId]: { status: 'SUCCESS', output } }));
    } catch (error) {
      setResults(prev => ({ ...prev, [apiId]: { status: 'ERROR', output: 'API Request Failed' } }));
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange(id, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredApiList = filter === 'ALL' ? apiList : apiList.filter(api => api.category === filter);

  return (
    <div className="space-y-8 animate-fadeIn">
       <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                 <FlaskConical className="text-blue-500 w-8 h-8" /> API Test Lab
              </h1>
              <p className="text-slate-400">
                Test console for all installed Google Cloud APIs.
              </p>
              <div className="flex items-center gap-2 mt-2">
                 <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                 <span className="text-xs text-slate-500 font-mono">Token Active: {API_KEY.substring(0, 6)}...</span>
              </div>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              {(['ALL', 'MAPS', 'AI', 'DATA'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filter === f 
                    ? 'bg-slate-800 text-white shadow' 
                    : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f === 'ALL' ? 'All APIs' : f}
                </button>
              ))}
            </div>
          </div>
       </div>

       {/* Map Embed Special Test Card */}
       {filter === 'MAPS' || filter === 'ALL' ? (
         <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                 <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">Maps Embed API (Visual Test)</h3>
                <p className="text-xs text-slate-500">Real-time rendering test using your API key.</p>
              </div>
           </div>
           <div className="w-full h-48 bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
             <iframe
               width="100%"
               height="100%"
               style={{ border: 0 }}
               loading="lazy"
               allowFullScreen
               src={`https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=Google+Plex+Mountain+View`}
             ></iframe>
           </div>
         </div>
       ) : null}

       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredApiList.map((api) => {
             const result = results[api.id];
             const currentInput = inputs[api.id] ?? api.defaultInput;
             const isImage = api.inputType === 'image';

             return (
                <div key={api.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col hover:border-slate-700 transition-colors group">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-lg border border-slate-800/50 group-hover:border-slate-700">
                           <api.icon className={`w-5 h-5 ${
                             api.category === 'MAPS' ? 'text-emerald-400' :
                             api.category === 'AI' ? 'text-purple-400' : 'text-blue-400'
                           }`} />
                        </div>
                        <h3 className="font-semibold text-slate-200">{api.name}</h3>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-900 text-slate-500 border border-slate-800">
                        {api.category}
                      </span>
                   </div>
                   
                   <p className="text-xs text-slate-500 mb-4 h-8">{api.description}</p>

                   <div className="mb-4 flex-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Input</label>
                      {isImage ? (
                        <div className="border border-dashed border-slate-700 rounded-lg p-3 text-center cursor-pointer hover:bg-slate-900 transition-colors">
                           <input type="file" onChange={(e) => handleFileUpload(api.id, e)} className="hidden" id={`file-${api.id}`} />
                           <label htmlFor={`file-${api.id}`} className="cursor-pointer text-xs text-slate-400 flex flex-col items-center">
                              <Eye className="w-4 h-4 mb-1" />
                              {inputs[api.id] ? 'Image Selected' : 'Select Image'}
                           </label>
                        </div>
                      ) : (
                        <input 
                           type="text" 
                           value={currentInput}
                           onChange={(e) => handleInputChange(api.id, e.target.value)}
                           className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-600"
                           placeholder={api.defaultInput}
                        />
                      )}
                   </div>

                   {/* Output Section */}
                   {result && (
                      <div className={`mb-4 rounded-lg p-3 text-xs font-mono overflow-auto max-h-32 custom-scrollbar animate-fadeIn
                         ${result.status === 'ERROR' ? 'bg-red-950/30 text-red-300 border border-red-900' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}>
                         {result.status === 'LOADING' ? (
                            <div className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Running Request...</div>
                         ) : (
                            <div className="whitespace-pre-wrap">{result.output}</div>
                         )}
                      </div>
                   )}

                   <div className="mt-auto flex justify-between items-center pt-3 border-t border-slate-800">
                      <div className="flex items-center gap-2">
                         <span className={`w-2 h-2 rounded-full ${
                            !result ? 'bg-slate-600' : 
                            result.status === 'LOADING' ? 'bg-blue-500 animate-pulse' : 
                            result.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-red-500'
                         }`} />
                         <span className="text-xs text-slate-400">
                            {!result ? 'Ready' : result.status}
                         </span>
                      </div>
                      <button 
                         onClick={() => handleRunTest(api.id, api.handler, api.defaultInput)}
                         disabled={result?.status === 'LOADING'}
                         className="flex items-center gap-2 bg-slate-800 hover:bg-blue-600 hover:text-white disabled:opacity-50 text-slate-300 text-xs px-3 py-1.5 rounded-md transition-all border border-slate-700 hover:border-blue-500"
                      >
                         <Play className="w-3 h-3" /> Test API
                      </button>
                   </div>
                </div>
             );
          })}
       </div>
    </div>
  );
};

export default ApiTestLab;