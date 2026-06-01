import React from 'react';

export default function ExamsRedirect() {
  const handleClick = () => {
    window.location.href = 'https://exams-umber-eight.vercel.app/';
  };

  return (
    <div className="exams-redirect" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #0d47a1, #1976d2)',
      color: 'white',
      fontFamily: 'sans-serif',
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Exams</h1>
      <button
        onClick={handleClick}
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          background: '#ffca28',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Go to Exams
      </button>
    </div>
  );
}
