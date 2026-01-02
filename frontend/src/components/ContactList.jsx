import React, { useState } from 'react';

const ContactList = ({ contacts, onDeleteContact, apiUrl }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Sort contacts
  const sortedContacts = [...contacts].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === 'createdAt') {
      return sortConfig.direction === 'asc' 
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    }

    if (typeof aValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/contacts/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        if (onDeleteContact) {
          onDeleteContact(id);
        }
        setDeleteConfirm(null);
      } else {
        alert('Failed to delete contact: ' + data.message);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (contacts.length === 0) {
    return (
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-8 mt-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact List</h2>
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No contacts yet. Submit the form above to add your first contact!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-8 mt-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Contact List</h2>
      <p className="text-gray-600 mb-6">Total Contacts: {contacts.length}</p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-purple-600 text-white">
              <th 
                onClick={() => handleSort('name')}
                className="px-4 py-3 text-left cursor-pointer hover:bg-purple-700 transition"
              >
                Name {getSortIcon('name')}
              </th>
              <th 
                onClick={() => handleSort('email')}
                className="px-4 py-3 text-left cursor-pointer hover:bg-purple-700 transition"
              >
                Email {getSortIcon('email')}
              </th>
              <th 
                onClick={() => handleSort('phone')}
                className="px-4 py-3 text-left cursor-pointer hover:bg-purple-700 transition"
              >
                Phone {getSortIcon('phone')}
              </th>
              <th className="px-4 py-3 text-left">Message</th>
              <th 
                onClick={() => handleSort('createdAt')}
                className="px-4 py-3 text-left cursor-pointer hover:bg-purple-700 transition"
              >
                Date {getSortIcon('createdAt')}
              </th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedContacts.map((contact, index) => (
              <tr key={contact._id} className={`border-b hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="px-4 py-3">{contact.name}</td>
                <td className="px-4 py-3 text-blue-600">{contact.email}</td>
                <td className="px-4 py-3">{contact.phone}</td>
                <td className="px-4 py-3 max-w-xs truncate">
                  {contact.message || <em className="text-gray-400">No message</em>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(contact.createdAt)}</td>
                <td className="px-4 py-3">
                  {deleteConfirm === contact._id ? (
                    <div className="flex gap-2">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
                        onClick={() => handleDelete(contact._id)}
                      >
                        ✓
                      </button>
                      <button
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded transition"
                        onClick={() => setDeleteConfirm(null)}
                      >
                        ✗
                      </button>
                    </div>
                  ) : (
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition"
                      onClick={() => setDeleteConfirm(contact._id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactList;
