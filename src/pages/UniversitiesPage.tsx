
import React, { useState, useEffect } from 'react';
import { getUniversities } from '../services/tutorService';
import { University } from '../types';
import { Button, Card, Input } from '../components/UI';
import { TutorMatchingModal } from '../components/TutorMatchingModal';
import { Search, MapPin, CheckCircle, GraduationCap } from 'lucide-react';

export const UniversitiesPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedUni, setSelectedUni] = useState<University | null>(null);

  useEffect(() => {
    getUniversities().then(data => {
        setUniversities(data);
        setLoading(false);
    });
  }, []);

  const filteredUnis = universities.filter(u => {
      const matchesType = filterType === 'All' || u.type === filterType;
      const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.shortName.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
  });

  const handleMatch = () => {
      onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
        
        {/* HEADER */}
        <div className="bg-blue-900 text-white py-16 px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-4">Accredited Universities in Zambia</h1>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">Find verified tutors and past papers for your specific institution. Fully verified by HEA & TEVETA listings.</p>
        </div>

        {/* CONTROLS */}
        <div className="max-w-7xl mx-auto px-4 py-8 sticky top-16 z-20 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20}/>
                    <input 
                        className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Search university..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                    {['All', 'Public', 'Private', 'College', 'Technical'].map(type => (
                        <button 
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filterType === type ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* GRID */}
        <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
            {loading ? (
                <div className="text-center py-20"><div className="animate-spin inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUnis.map(uni => (
                        <Card key={uni.id} className="group hover:shadow-xl transition-all border-t-4 border-t-transparent hover:border-t-blue-600 cursor-pointer overflow-hidden" onClick={() => setSelectedUni(uni)}>
                            <div className="p-6 flex items-start gap-4">
                                <div className="w-16 h-16 bg-white rounded-lg shadow-sm border p-1 flex-shrink-0">
                                    <img src={uni.logo} alt={uni.shortName} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{uni.name}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin size={12}/> {uni.location}</p>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded mt-2 inline-block ${uni.type === 'Public' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                                        {uni.type}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center group-hover:bg-blue-50 transition-colors">
                                <span className="text-xs font-medium text-gray-500 flex items-center gap-1"><CheckCircle size={12} className="text-blue-500"/> Accredited</span>
                                <span className="text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">Find Tutor <GraduationCap size={16}/></span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>

        {/* MODAL */}
        {selectedUni && (
            <TutorMatchingModal 
                university={selectedUni} 
                isOpen={!!selectedUni} 
                onClose={() => setSelectedUni(null)} 
                onSuccess={handleMatch}
            />
        )}
    </div>
  );
};
