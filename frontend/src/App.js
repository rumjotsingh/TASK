import React, { useState, useEffect } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';

const API_URL = 'https://task-z5b3.onrender.com';

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
      const response = await fetch(`${API_URL}/api/contacts`);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 py-8">
      <header className="text-center mb-8 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">📧 Contact Form Application</h1>
        <p className="text-purple-100 text-lg">MERN Stack Demo - React + Node.js + Express + MongoDB</p>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <ContactForm onContactAdded={handleContactAdded} apiUrl={API_URL} />

        {loading ? (
          <div className="text-center text-white text-xl mt-8">Loading contacts...</div>
        ) : error ? (
          <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
            <p className="text-red-600 text-center mb-4">{error}</p>
            <div className="text-center">
              <button 
                onClick={fetchContacts} 
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <ContactList 
            contacts={contacts} 
            onDeleteContact={handleContactDeleted}
            apiUrl={API_URL}
          />
        )}
      </main>

      <footer className="text-center mt-12 pb-8">
        <p className="text-white text-lg">Built with ❤️ using the MERN Stack</p>
      </footer>
    </div>
  );
}

export default App;
