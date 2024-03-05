import {useState} from 'react'
import PropTypes from 'prop-types';

const CryptoPayButton = ({ onClick, style, label }) => {
   

   

  return (
    <button
      onClick={onClick}
      style={{ ...defaultStyle, ...style }} // Merge default style with user-provided style
    >
      {label}
    </button>
  );
};

CryptoPayButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  style: PropTypes.object, // Style object to allow users to pass custom styles
};

const defaultStyle = {
  // Define default styles here
  padding: '10px 20px',
  backgroundColor: '#0c0a09',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',

};

export default CryptoPayButton;