import React from 'react';

interface PopupProps {
  onClose: () => void;
  phones: string[];
  emails: string[];
}

const Popup: React.FC<PopupProps> = ({ onClose, emails, phones }) => {
  // Inline styles converted from Tailwind CSS classes
  const popupContainerStyles = {
    // backgroundColor: '#FFFFFF',
    // border: '1px solid #D1D5DB',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    width: '300px',
    height: '400px',
  };

  const titleStyles = {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  };

  const paragraphStyles = {
    fontSize: '1rem',
    marginBottom: '1rem',
  };

  const closeButtonStyles = {
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    border: 'none',
  };

  const handleStyles = {
    position: 'absolute',
    top: '0',
    right: '0',
    width: '40px',
    height: '40px',
    backgroundColor: '#3B82F6',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transform: 'translate(50%, -50%)',
  };

  return (
    <div style={popupContainerStyles}>
      <h3>Emails:</h3>
      <ul>
        {emails.map((email, index) => (
          <li key={index}>{email}</li>
        ))}
      </ul>
      <h3>Phone Numbers:</h3>
      <ul>
        {phones.map((phone, index) => (
          <li key={index}>{phone}</li>
        ))}
      </ul>
      <button style={closeButtonStyles} onClick={onClose}>
        Close
      </button>
      <div style={handleStyles}>
        <span style={{ color: '#FFFFFF' }} onClick={onClose}>
          close
        </span>
      </div>
    </div>
  );
};

export default Popup;
