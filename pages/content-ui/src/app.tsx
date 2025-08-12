import React, { useState, useCallback, useEffect } from 'react';

const App = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 1200, y: 70 });
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupAnimating, setPopupAnimating] = useState(false);
  const [emails, setEmails] = useState([]);
  const [phones, setPhones] = useState([]);

  const onMouseDown = useCallback(e => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onMouseMove = useCallback(
    e => {
      if (isDragging) {
        setPosition(prevPosition => ({
          x: prevPosition.x + e.movementX,
          y: prevPosition.y + e.movementY,
        }));
      }
    },
    [isDragging],
  );

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  useEffect(() => {
    const findEmailsAndPhones = () => {
      const text = document.body.innerText;
      const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
      const phoneRegex = /(\+?(\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/g;

      const foundEmails = Array.from(new Set(text.match(emailRegex) || []));
      const foundPhones = Array.from(new Set(text.match(phoneRegex) || []));

      setEmails(foundEmails);
      setPhones(foundPhones);

      // Open popup if emails or phones are found
      if (foundEmails.length > 0 || foundPhones.length > 0) {
        setPopupVisible(true);
        setTimeout(() => setPopupAnimating(true), 50);
      }
    };

    findEmailsAndPhones();

    const observer = new MutationObserver(findEmailsAndPhones);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const togglePopup = () => {
    if (popupVisible) {
      setPopupAnimating(false);
      setTimeout(() => setPopupVisible(false), 300);
    } else {
      setPopupVisible(true);
      setTimeout(() => setPopupAnimating(true), 50);
    }
  };

  return (
    <>
      <div
        onMouseDown={onMouseDown}
        style={{
          position: 'fixed',
          top: `${position.y}px`,
          left: `${position.x}px`,
          width: '40px',
          height: '40px',
          backgroundColor: 'green',
          cursor: 'move',
          zIndex: 99,
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'background-color 0.3s ease',
          color: 'white',
        }}
        onClick={togglePopup}>
        {popupVisible ? 'close' : 'open'}
      </div>
      {popupVisible && (
        <div
          style={{
            position: 'fixed',
            top: position.y + 20,
            left: position.x + 20,
            width: '300px',
            maxHeight: '400px',
            backgroundColor: 'green',
            border: '1px solid black',
            borderRadius: '5px',
            color: 'white',
            zIndex: 3,
            padding: '10px',
            transition: 'opacity 0.3s ease, transform 0.3s ease, max-height 0.3s ease',
            opacity: popupAnimating ? 1 : 0,
            transform: `scaleY(${popupAnimating ? 1 : 0})`,
            transformOrigin: 'top',
            maxHeight: popupAnimating ? '400px' : '0',
            overflow: 'hidden',
            minHeight: '400px',
          }}>
          <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
            <h3>Found Information</h3>
            <h4>Emails:</h4>
            <ul>
              {emails.map((email, index) => (
                <li key={`email-${index}`}>{email}</li>
              ))}
            </ul>
            <h4>Phone Numbers:</h4>
            <ul>
              {phones.map((phone, index) => (
                <li key={`phone-${index}`}>{phone}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
