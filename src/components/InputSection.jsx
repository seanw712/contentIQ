import React from 'react';
import PropTypes from 'prop-types';

/**
 * Input section component for content to be remixed
 */
const InputSection = ({ inputText, setInputText }) => {
  return (
    <div className="module-card">
      <div className="module-header">
        <h2 className="module-title">Your thoughts</h2>
      </div>
      <textarea
        className="textarea-input h-[140px]"
        placeholder="What idea or message do you want to convey?"
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