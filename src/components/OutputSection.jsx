import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Output section component for displaying remixed content
 */
const OutputSection = ({ outputText, isLoading, onLoadOutput }) => {
  const [savedOutputs, setSavedOutputs] = useState([]);
  const [outputName, setOutputName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [outputToDelete, setOutputToDelete] = useState(null);

  useEffect(() => {
    // Load saved outputs from localStorage
    const outputs = JSON.parse(localStorage.getItem('savedOutputs') || '[]');
    setSavedOutputs(outputs);
  }, []);

  const handleSaveOutput = () => {
    if (!outputName.trim() || !outputText.trim()) return;
    
    const newOutput = {
      id: Date.now(),
      name: outputName,
      content: outputText,
      timestamp: new Date().toISOString()
    };

    const updatedOutputs = [...savedOutputs, newOutput];
    setSavedOutputs(updatedOutputs);
    localStorage.setItem('savedOutputs', JSON.stringify(updatedOutputs));
    setShowSaveModal(false);
    setOutputName('');
  };

  const initiateDeleteOutput = (output, e) => {
    e.stopPropagation(); // Prevent triggering the output loading
    setOutputToDelete(output);
    setShowDeleteModal(true);
  };

  const handleDeleteOutput = () => {
    if (!outputToDelete) return;
    
    const updatedOutputs = savedOutputs.filter(o => o.id !== outputToDelete.id);
    setSavedOutputs(updatedOutputs);
    localStorage.setItem('savedOutputs', JSON.stringify(updatedOutputs));
    setShowDeleteModal(false);
    setOutputToDelete(null);
  };

  return (
    <div className="module-card h-full flex flex-col">
      <div className="module-header">
        <h2 className="module-title">Output</h2>
        {outputText && (
          <button 
            className="save-button"
            onClick={() => setShowSaveModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h-2v5.586l-1.293-1.293z" />
            </svg>
            Save Output
          </button>
        )}
      </div>

      {savedOutputs.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Saved Outputs
          </label>
          <div className="flex flex-wrap gap-2">
            {savedOutputs.map(output => (
              <button
                key={output.id}
                onClick={() => onLoadOutput(output)}
                className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 
                         transition-colors duration-200 text-sm flex items-center"
              >
                <span>{output.name}</span>
                <span 
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={(e) => initiateDeleteOutput(output, e)}
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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="w-full flex-grow min-h-[400px] p-4 border border-slate-200 rounded-xl bg-slate-50 overflow-auto">
          {outputText ? (
            <div className="whitespace-pre-wrap">
              {outputText}
            </div>
          ) : (
            <div className="text-slate-500">Remixed content will appear here</div>
          )}
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Save Output</h3>
            <input
              type="text"
              placeholder="Enter output name"
              value={outputName}
              onChange={(e) => setOutputName(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 
                       focus:ring-indigo-500 focus:border-transparent mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOutput}
                className="gradient-button"
                disabled={!outputName.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && outputToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Output</h3>
            <p className="mb-4">
              Are you sure you want to delete the output "{outputToDelete.name}"?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setOutputToDelete(null);
                }}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                No
              </button>
              <button
                onClick={handleDeleteOutput}
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

OutputSection.propTypes = {
  outputText: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onLoadOutput: PropTypes.func
};

export default OutputSection; 