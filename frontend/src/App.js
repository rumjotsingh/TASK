import React, { useState, useEffect } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts');
      const data = await response.json();

      if (data.success) {
        setContacts(data.data);
      } else {
        setError('Failed to fetch contacts');
      }
    } catch (error) {
      setError('Network error. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Handle new contact added
  const handleContactAdded = (newContact) => {
    setContacts(prev => [newContact, ...prev]);
  };

  // Handle contact deleted
  const handleContactDeleted = (deletedId) => {
    setContacts(prev => prev.filter(contact => contact._id !== deletedId));
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📧 Contact Form Application</h1>
        <p>MERN Stack Demo - React + Node.js + Express + MongoDB</p>
      </header>

      <main className="app-main">
        <ContactForm onContactAdded={handleContactAdded} />

        {loading ? (
          <div className="loading">Loading contacts...</div>
        ) : error ? (
          <div className="error-container">
            <p className="error">{error}</p>
            <button onClick={fetchContacts} className="retry-btn">
              Retry
            </button>
          </div>
        ) : (
          <ContactList 
            contacts={contacts} 
            onDeleteContact={handleContactDeleted}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Built with ❤️ using the MERN Stack</p>
      </footer>
    </div>
  );
}

export default App;
