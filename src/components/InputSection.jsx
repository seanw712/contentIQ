import React from 'react';
import PropTypes from 'prop-types';

/**
 * Input section component for content to be remixed
 */
const InputSection = ({ inputText, setInputText }) => {
  return (
    <div className="module-card flex-grow flex flex-col">
      <div className="module-header">
        <h2 className="module-title">Input</h2>
      </div>
      <textarea
        className="textarea-input flex-grow min-h-[280px]"
        placeholder="Paste your content here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
    </div>
  );
};

InputSection.propTypes = {
  inputText: PropTypes.string.isRequired,
  setInputText: PropTypes.func.isRequired,
};

export default InputSection; 