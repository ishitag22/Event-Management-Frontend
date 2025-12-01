import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../Login/Api';
import styles from '../Feedback/FeedbackForm.module.css';
import { toast } from 'react-toastify';
import Select from 'react-select';

export const indianCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Ahmedabad",
  "Chennai",
  "Kolkata",
  "Surat",
  "Pune",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Faridabad",
  "Meerut",
  "Rajkot",
  "Varanasi",
  "Srinagar",
  "Amritsar",
  "Bhubaneswar",
  "Chandigarh",
  "Coimbatore",
  "Guwahati",
  "Jodhpur",
  "Kochi",
  "Mysore"
];

const cityOptions = indianCities.map(city => ({
  value: city,
  label: city
}));
const roleOptions = [
  { value: 'User', label: 'User' },
  { value: 'Organiser', label: 'Organiser' }
];

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        role: '', 
        phoneNumber: '',
        location: '' 
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRoleChange = (selectedOption) => {
        setFormData({
            ...formData,
            role: selectedOption ? selectedOption.value : ''
        });
    };
    const handleLocationChange = (selectedOption) => {
        setFormData({
            ...formData,
            location: selectedOption ? selectedOption.value : ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const dataToSend = {
                ...formData,
                phoneNumber: parseInt(formData.phoneNumber, 10)
            };

            await api.post('/Users/register', dataToSend);
            
            toast.success('Registration successful! Please login.');
            navigate('/login');

        } catch (err) {
            if (err.response && err.response.data) {
                if (err.response.data.error) {
                    setError(err.response.data.error);
                } 
                else if (err.response.data.errors) {
                    const firstError = Object.values(err.response.data.errors)[0];
                    setError(firstError);
                } else {
                    setError('Registration failed. Please try again.');
                }
            } else {
                setError('An error occurred. Please check your connection.');
            }
        }
    };

    return (
        <div className="authBackground">
        <div className={`${styles.container} auth-card`} style={{ maxWidth: '400px', marginTop: '50px' }}>
            <h2>Sign Up</h2>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} className={styles.form}>
                
                <input
                    name="userName"
                    placeholder="Full Name"
                    value={formData.userName}
                    onChange={handleChange}
                    className={styles.inputField}
                    required
                />
                 <input
                    name="email"
                    type="email"
                    placeholder="Email (@gmail.com)"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.inputField}
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={styles.inputField}
                    required
                />
                <Select
                  options={roleOptions}
                  onChange={handleRoleChange}
                  value={roleOptions.find(option => option.value === formData.role)}
                  placeholder="-- Select Role --"
                  className={styles.selectContainer} 
                  classNamePrefix="react-select"     
                  required
                />

                <input
                    name="phoneNumber"
                    type="number"
                    placeholder="Phone Number (10 digits)"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={styles.inputField}
                    required
                />
                
                <Select
                  options={cityOptions}
                  onChange={handleLocationChange}
                  value={cityOptions.find(option => option.value === formData.location)}
                  placeholder="Location (City)"
                  isClearable
                  isSearchable
                  className={styles.selectContainer}
                  classNamePrefix="react-select"
                  required
                />

                <button type="submit" className={styles.primaryButton}>
                    Create Account
                </button>

                <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--simba-orange-dark)' }}>Login here</Link>
                </p>
            </form>
        </div>
        </div>
    );
};

export default Signup;

