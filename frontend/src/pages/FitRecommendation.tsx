import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Sparkles, Save, Upload, Ruler, CheckCircle } from 'lucide-react';

export const FitRecommendation: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
  
  // States for measurements
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');
  const [chest, setChest] = useState('38');
  const [waist, setWaist] = useState('32');
  const [hips, setHips] = useState('39');
  const [inseam, setInseam] = useState('30');
  const [gender, setGender] = useState('male');
  const [fitPreference, setFitPreference] = useState('regular');
  const [fabricStretch, setFabricStretch] = useState('medium');

  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
  const [recommendedFitScore, setRecommendedFitScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // Load existing measurements if authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      axios.get('http://localhost:5000/api/measurements', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (res.data) {
          setHeight(res.data.height?.toString() || '175');
          setWeight(res.data.weight?.toString() || '70');
          setChest(res.data.chest?.toString() || '38');
          setWaist(res.data.waist?.toString() || '32');
          setHips(res.data.hips?.toString() || '39');
          setInseam(res.data.inseam?.toString() || '30');
          setGender(res.data.gender || 'male');
          setFitPreference(res.data.fitPreference || 'regular');
          setFabricStretch(res.data.fabricStretch || 'medium');
        }
      })
      .catch(() => {
        // No measurements yet is fine, ignore 404
      });
    }
  }, [isAuthenticated, token]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Mock processing files
      setLoading(true);
      setTimeout(() => {
        setChest('40');
        setWaist('34');
        setHips('41');
        setInseam('32');
        setLoading(false);
        alert('Mock LiDAR file processed successfully!');
      }, 1000);
    }
  };

  const calculateRecommendation = () => {
    setLoading(true);
    setSaveSuccess(false);

    setTimeout(() => {
      const c = Number(chest);

      let size = 'M';
      if (c < 36) size = 'S';
      else if (c >= 36 && c < 39) size = 'M';
      else if (c >= 39 && c < 42) size = 'L';
      else if (c >= 42 && c < 45) size = 'XL';
      else if (c >= 45) size = 'XXL';

      // Fit score variance based on preference
      let score = 94;
      if (fitPreference === 'slim') score = 97;
      else if (fitPreference === 'loose') score = 92;

      setRecommendedSize(size);
      setRecommendedFitScore(score);
      setLoading(false);
    }, 800);
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      setError('Please log in or register to save your measurements.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/measurements', {
        height: Number(height),
        weight: Number(weight),
        chest: Number(chest),
        waist: Number(waist),
        hips: Number(hips),
        inseam: Number(inseam),
        gender,
        fitPreference,
        fabricStretch
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSaveSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save measurements.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F5F1EB] min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-[#2E1F16]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#8B5E3C]/30 text-xs font-semibold text-[#8B5E3C] uppercase bg-[#8B5E3C]/5">
            <Ruler className="h-3.5 w-3.5" /> AI Precision Tailor
          </span>
          <h1 className="font-poppins text-3xl sm:text-4xl font-bold">Configure Your AI Silhouette</h1>
          <p className="font-inter text-sm sm:text-base text-[#4A2C2A]/85 max-w-xl mx-auto">
            Input your dimensions or upload a scanned format to calculate the perfect size recommendation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white border border-[#C4A484]/20 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="font-poppins text-lg font-bold flex items-center gap-2">
              <Ruler className="h-5 w-5 text-[#8B5E3C]" /> Measurements
            </h2>

            {/* Quick Upload */}
            <div className="border-2 border-dashed border-[#C4A484]/30 rounded-xl p-4 text-center hover:bg-[#F5F1EB]/30 transition-colors relative">
              <input
                type="file"
                accept=".json,.txt,.obj"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="h-6 w-6 text-[#8B5E3C] mx-auto mb-2" />
              <span className="block text-xs font-semibold text-[#2E1F16]">Upload Body Data (LiDAR / JSON)</span>
              <span className="text-[10px] text-[#4A2C2A]/60">Supports Smart Fit scan file exports</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2E1F16] uppercase">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1 block w-full p-2 border border-[#C4A484]/30 rounded-xl bg-[#F5F1EB]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E1F16] uppercase">Fit Preference</label>
                <select
                  value={fitPreference}
                  onChange={(e) => setFitPreference(e.target.value)}
                  className="mt-1 block w-full p-2 border border-[#C4A484]/30 rounded-xl bg-[#F5F1EB]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                >
                  <option value="slim">Slim Fit</option>
                  <option value="regular">Regular Fit</option>
                  <option value="loose">Loose / Oversized</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2E1F16] uppercase">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="mt-1 block w-full p-2 border border-[#C4A484]/30 rounded-xl bg-[#F5F1EB]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E1F16] uppercase">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="mt-1 block w-full p-2 border border-[#C4A484]/30 rounded-xl bg-[#F5F1EB]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2E1F16] uppercase">Chest (in)</label>
                <input
                  type="number"
                  value={chest}
                  onChange={(e) => setChest(e.target.value)}
                  className="mt-1 block w-full p-2 border border-[#C4A484]/30 rounded-xl bg-[#F5F1EB]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E1F16] uppercase">Waist (in)</label>
                <input
                  type="number"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  className="mt-1 block w-full p-2 border border-[#C4A484]/30 rounded-xl bg-[#F5F1EB]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2E1F16] uppercase">Hips (in)</label>
                <input
                  type="number"
                  value={hips}
                  onChange={(e) => setHips(e.target.value)}
                  className="mt-1 block w-full p-2 border border-[#C4A484]/30 rounded-xl bg-[#F5F1EB]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E1F16] uppercase">Inseam (in)</label>
                <input
                  type="number"
                  value={inseam}
                  onChange={(e) => setInseam(e.target.value)}
                  className="mt-1 block w-full p-2 border border-[#C4A484]/30 rounded-xl bg-[#F5F1EB]/20 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>
            </div>

            <button
              onClick={calculateRecommendation}
              disabled={loading}
              className="w-full py-3 bg-[#2E1F16] hover:bg-[#8B5E3C] text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" /> Calculate Size & Fit
            </button>
          </div>

          {/* Results Side */}
          <div className="flex flex-col justify-between">
            {recommendedSize ? (
              <div className="bg-white border border-[#C4A484]/20 rounded-2xl p-8 shadow-sm flex-grow flex flex-col justify-between">
                <div className="space-y-6">
                  <h3 className="font-poppins text-lg font-bold text-[#2E1F16]">AI Size Analysis Report</h3>
                  
                  <div className="text-center py-8 bg-[#F5F1EB]/40 rounded-2xl border border-[#C4A484]/15">
                    <span className="block text-xs text-[#8B5E3C] font-bold tracking-widest uppercase">RECOMMENDED SIZE</span>
                    <span className="font-poppins text-7xl font-extrabold text-[#2E1F16]">{recommendedSize}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-[#4A2C2A]">Fit Compatibility Index</span>
                      <span className="font-bold text-[#8B5E3C]">{recommendedFitScore}%</span>
                    </div>
                    <div className="w-full bg-[#F5F1EB] rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#C4A484] to-[#8B5E3C] h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${recommendedFitScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {error && (
                    <p className="text-xs text-red-700 font-medium">{error}</p>
                  )}
                  {saveSuccess && (
                    <p className="text-xs text-green-700 font-medium flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Measurements stored to profile successfully!
                    </p>
                  )}

                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full py-3 border border-[#8B5E3C] hover:bg-[#8B5E3C]/5 text-[#8B5E3C] font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" /> Save To My Profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-[#C4A484]/40 bg-white/40 rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full">
                <Ruler className="h-12 w-12 text-[#C4A484] mb-4" />
                <h3 className="font-poppins text-lg font-bold text-[#2E1F16] mb-2">No Recommendation Calculated</h3>
                <p className="font-inter text-sm text-[#4A2C2A]/70 max-w-xs leading-relaxed">
                  Fill in your measurements and click "Calculate Size & Fit" to see your custom size analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
