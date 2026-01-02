import React, { useState } from 'react';
import './ContactList.css';

const ContactList = ({ contacts, onDeleteContact }) => {
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
      const response = await fetch(`/api/contacts/${id}`, {
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
      <div className="contact-list-container">
        <h2>Contact List</h2>
        <div className="empty-state">
          <p>No contacts yet. Submit the form above to add your first contact!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-list-container">
      <h2>Contact List</h2>
      <p className="contact-count">Total Contacts: {contacts.length}</p>

      <div className="table-container">
        <table className="contact-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>
                Name {getSortIcon('name')}
              </th>
              <th onClick={() => handleSort('email')}>
                Email {getSortIcon('email')}
              </th>
              <th onClick={() => handleSort('phone')}>
                Phone {getSortIcon('phone')}
              </th>
              <th>Message</th>
              <th onClick={() => handleSort('createdAt')}>
                Date {getSortIcon('createdAt')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedContacts.map((contact) => (
              <tr key={contact._id}>
                <td data-label="Name">{contact.name}</td>
                <td data-label="Email">{contact.email}</td>
                <td data-label="Phone">{contact.phone}</td>
                <td data-label="Message" className="message-cell">
                  {contact.message || <em>No message</em>}
                </td>
                <td data-label="Date">{formatDate(contact.createdAt)}</td>
                <td data-label="Actions">
                  {deleteConfirm === contact._id ? (
                    <div className="confirm-delete">
                      <button
                        className="confirm-btn"
                        onClick={() => handleDelete(contact._id)}
                      >
                        ✓
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setDeleteConfirm(null)}
                      >
                        ✗
                      </button>
                    </div>
                  ) : (
                    <button
                      className="delete-btn"
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
