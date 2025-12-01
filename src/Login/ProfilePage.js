import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfilePage.css';
import { useAuth } from '../AuthContext';
import { Edit2 } from 'react-feather';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { userId } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: '', phoneNumber: '', location: '' });

  useEffect(() => {
    if (userId) {
      axios.get(`https://localhost:7283/api/Users/${userId}`)
        .then(res => {
          setUserDetails(res.data);
          setForm({
            username: res.data.username || '',
            phoneNumber: res.data.phoneNumber || '',
            location: res.data.location || ''
          });
        })
        .then(res => {
          setUserDetails(res.data);
          setForm({
            username: res.data.username || '',
            phoneNumber: res.data.phoneNumber || '',
            location: res.data.location || ''
          });
        })
        .catch(err => console.error('Error fetching user details:', err));
    }
  }, [userId]);

  const handleEdit = () => setEditMode(true);

  const handleCancel = () => {
    if (userDetails) {
      setForm({
        username: userDetails.username || '',
        phoneNumber: userDetails.phoneNumber || '',
        location: userDetails.location || ''
      });
    }
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`https://localhost:7283/api/Users/update/${userId}`, form)
      .then(res => {
        setUserDetails(res.data);
        setEditMode(false);
        toast.success('Profile updated successfully!');
      })
      .catch(err => {
        console.error('Error updating profile:', err);
        toast.error('Failed to update profile.');
      });
  };

  if (!userDetails) {
    return <div className="profile-container">Loading profile...</div>;
  }
 
  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>

      <div className="profile-card">
        {/* top-right icon-only edit button (styled by .edit-btn-card / .edit-btn in CSS) */}
        <div className="edit-btn-card">
          <button
            className="edit-btn"
            aria-label="Edit profile"
            onClick={handleEdit}
            title="Edit profile"
          >
            <Edit2 />
          </button>
        </div>

        {editMode ? (
          <form className="edit-card" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Location
              <input
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
              />
            </label>

            <label>
              Phone
              <input
                name="phoneNumber"
                type="tel"
                value={form.phoneNumber}
                onChange={handleChange}
              />
            </label>

            <div className="edit-actions">
              <button type="submit" className="btn save">Save</button>
              <button type="button" className="btn cancel" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <h2>{userDetails.username}</h2>
            <p><strong>Location:</strong> {userDetails.location || '—'}</p>
            <p><strong>Phone:</strong> {userDetails.phoneNumber || '—'}</p>
            <p><strong>Role:</strong> {userDetails.role || 'User'}</p>
          </>
        )}
      </div>
    </div>
  );
};
 
export default ProfilePage;