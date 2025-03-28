import React, { useState, useEffect } from 'react';

const PresetSection = ({ onPresetChange }) => {
  const [contentType, setContentType] = useState('Informative');
  const [toneOfVoice, setToneOfVoice] = useState('');
  const [competitorPoints, setCompetitorPoints] = useState(null);
  const [presetName, setPresetName] = useState('');
  const [savedPresets, setSavedPresets] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [persona, setPersona] = useState('Company');
  const [includeIllustrations, setIncludeIllustrations] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Load saved presets from localStorage
    const presets = JSON.parse(localStorage.getItem('savedPresets') || '[]');
    setSavedPresets(presets);
  }, []);

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          if (type === 'competitor') {
            setCompetitorPoints(jsonData);
          }
        } catch (error) {
          console.error('Error parsing JSON file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    
    const newPreset = {
      id: Date.now(),
      name: presetName,
      persona,
      contentType,
      toneOfVoice,
      competitorPoints,
      includeIllustrations
    };

    const updatedPresets = [...savedPresets, newPreset];
    setSavedPresets(updatedPresets);
    localStorage.setItem('savedPresets', JSON.stringify(updatedPresets));
    setShowSaveModal(false);
    setPresetName('');
    setEditMode(false);
    setSelectedPreset(newPreset);
  };

  const handleLoadPreset = (preset) => {
    setPersona(preset.persona || 'Company');
    setContentType(preset.contentType);
    setToneOfVoice(preset.toneOfVoice);
    setCompetitorPoints(preset.competitorPoints);
    setIncludeIllustrations(preset.includeIllustrations || false);
    setSelectedPreset(preset);
    onPresetChange({
      ...preset, 
      persona: preset.persona || 'Company',
      includeIllustrations: preset.includeIllustrations || false
    });
  };

  const handleEditPreset = () => {
    if (selectedPreset) {
      setPresetName(selectedPreset.name + ' (copy)');
      setEditMode(true);
      setShowSaveModal(true);
    }
  };

  const initiateDeletePreset = (preset, e) => {
    e.stopPropagation(); // Prevent triggering the preset loading
    setPresetToDelete(preset);
    setShowDeleteModal(true);
  };

  const handleDeletePreset = () => {
    if (!presetToDelete) return;
    
    const updatedPresets = savedPresets.filter(p => p.id !== presetToDelete.id);
    setSavedPresets(updatedPresets);
    localStorage.setItem('savedPresets', JSON.stringify(updatedPresets));
    
    // If we're deleting the currently selected preset, clear selection
    if (selectedPreset && selectedPreset.id === presetToDelete.id) {
      setSelectedPreset(null);
    }
    
    setShowDeleteModal(false);
    setPresetToDelete(null);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleIllustrationToggle = () => {
    const newValue = !includeIllustrations;
    setIncludeIllustrations(newValue);
    onPresetChange({ 
      persona, 
      contentType, 
      toneOfVoice, 
      competitorPoints, 
      includeIllustrations: newValue
    });
  };

  return (
    <div className="module-card py-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-medium text-slate-700">Select your creative persona</h2>
        <button 
          className="text-xs py-1 px-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 
                   transition-colors duration-200 flex items-center"
          onClick={toggleExpand}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            {expanded ? (
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            )}
          </svg>
          Expand
        </button>
      </div>

      {/* Minimal View - Only Persona Selection */}
      {!expanded && (
        <div className="space-y-2">
          {savedPresets.length > 0 ? (
            <div>
              <div className="flex flex-wrap gap-2">
                {savedPresets.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handleLoadPreset(preset)}
                    className={`px-3 py-1 rounded-lg hover:bg-slate-200 
                             transition-colors duration-200 text-xs flex items-center
                             ${selectedPreset && selectedPreset.id === preset.id 
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                                : 'bg-slate-100 text-slate-700'}`}
                  >
                    <span>{preset.name}</span>
                    <span 
                      className="ml-2 text-slate-500 hover:text-slate-700"
                      onClick={(e) => initiateDeletePreset(preset, e)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="mt-1 text-xs text-slate-500">
                <p>Expand to create new personas or edit existing ones.</p>
              </div>
            </div>
          ) : (
            <div className="py-1">
              <p className="text-xs text-slate-500">
                Click 'Expand' to create your first persona.
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Expanded Settings - Full Edit Mode */}
      {expanded && (
        <div className="space-y-4">
          {/* Available Presets in expanded view */}
          {savedPresets.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Saved Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {savedPresets.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handleLoadPreset(preset)}
                    className={`px-3 py-1 rounded-lg hover:bg-slate-200 
                             transition-colors duration-200 text-sm flex items-center
                             ${selectedPreset && selectedPreset.id === preset.id 
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                                : 'bg-slate-100 text-slate-700'}`}
                  >
                    <span>{preset.name}</span>
                    <span 
                      className="ml-2 text-slate-500 hover:text-slate-700"
                      onClick={(e) => initiateDeletePreset(preset, e)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Persona
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    setPersona('Company');
                    onPresetChange({ persona: 'Company', contentType, toneOfVoice, competitorPoints, includeIllustrations });
                  }}
                  className={`relative inline-flex items-center justify-center h-10 px-3 rounded-l-lg border transition-colors
                    ${persona === 'Company' 
                      ? 'bg-indigo-100 text-indigo-700 border-indigo-200 font-medium' 
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs">Company</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPersona('Personal');
                    onPresetChange({ persona: 'Personal', contentType, toneOfVoice, competitorPoints, includeIllustrations });
                  }}
                  className={`relative inline-flex items-center justify-center h-10 px-3 rounded-r-lg border transition-colors
                    ${persona === 'Personal' 
                      ? 'bg-indigo-100 text-indigo-700 border-indigo-200 font-medium' 
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs">Personal</span>
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Content Type
              </label>
              <select
                className="preset-select"
                value={contentType}
                onChange={(e) => {
                  setContentType(e.target.value);
                  onPresetChange({ persona, contentType: e.target.value, toneOfVoice, competitorPoints, includeIllustrations });
                }}
              >
                <option value="Informative">Informative</option>
                <option value="Thought Leadership">Thought Leadership</option>
                <option value="Funny">Funny</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tone of Voice
            </label>
            <textarea
              className="textarea-input"
              rows="3"
              placeholder="Enter an example post you like"
              value={toneOfVoice}
              onChange={(e) => {
                setToneOfVoice(e.target.value);
                onPresetChange({ persona, contentType, toneOfVoice: e.target.value, competitorPoints, includeIllustrations });
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Extra Context/Examples
            </label>
            <div className="flex items-center">
              <label className="file-upload-button">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Upload Examples
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => handleFileUpload(e, 'competitor')}
                  className="sr-only"
                />
              </label>
              {competitorPoints && (
                <span className="ml-3 text-sm text-green-600">File uploaded</span>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">
                Include illustration descriptions
              </label>
              <button
                type="button"
                onClick={handleIllustrationToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  includeIllustrations ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`${
                    includeIllustrations ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              When enabled, the remixed content will include descriptions for potential illustrations.
            </p>
          </div>

          <div className="flex justify-end pt-4 mt-2 border-t border-slate-100">
            {selectedPreset && (
              <button 
                className="px-3 py-1.5 bg-slate-50 text-slate-600 text-sm rounded-lg hover:bg-slate-100 
                         transition-colors duration-200 flex items-center mr-2"
                onClick={handleEditPreset}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Copy
              </button>
            )}
            <button 
              className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-sm rounded-lg hover:bg-indigo-100 
                       transition-colors duration-200 flex items-center"
              onClick={() => setShowSaveModal(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h-2v5.586l-1.293-1.293z" />
              </svg>
              Save
            </button>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editMode ? 'Save Preset Copy' : 'Save New Preset'}
            </h3>
            <input
              type="text"
              placeholder="Enter preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 
                       focus:ring-indigo-500 focus:border-transparent mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setEditMode(false);
                  setPresetName('');
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreset}
                className="gradient-button"
                disabled={!presetName.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && presetToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Preset</h3>
            <p className="mb-4">
              Are you sure you want to delete the preset "{presetToDelete.name}"?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPresetToDelete(null);
                }}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                No
              </button>
              <button
                onClick={handleDeletePreset}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresetSection; 