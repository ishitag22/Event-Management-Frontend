import React, { useState } from 'react';
import './CreateCategory.css';
import { FaPlusCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
 
const CreateCategory = ({ onCategoryCreated }) => {
  const [categoryName, setCategoryName] = useState('');
  const [message, setMessage] = useState('');
 
  const validateCategoryName = (name) => {
    if (!name.trim()) return 'Please enter something.';
    if (!/[a-zA-Z]/.test(name)) return 'Must contain letters.';
    return '';
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const errorMsg = validateCategoryName(categoryName);
    if (errorMsg) {
      setMessage(errorMsg);
      return;
    }
 
    const payload = {
      CategoryID: 0,
      CategoryName: categoryName.trim()
    };
 
    try {
      const response = await axios.post('https://localhost:7283/api/Categories', payload);
 
      if (response.status === 201 || response.status === 200) {
        toast.success('Category created successfully!');
        setCategoryName('');
        if (onCategoryCreated) onCategoryCreated();
      } else {
        toast.error('Something went wrong.');
      }
    } catch (error) {
      console.error('Error creating category:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat()[0]
        : error.response?.data?.title || error.response?.data || 'Failed to create category.';
      toast.error(errorMsg);
    }
  };
 
  return (
<div className="create-category-container">
      {/* <h2><FaPlusCircle /> Create New Category</h2> */}
<form className="create-category-form" onSubmit={handleSubmit}>
<input
          type="text"
          placeholder="Enter category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
<button type="submit">Create Category</button>    
</form>
      {message && <div className="message">{message}</div>}
</div>
  );
};
 
export default CreateCategory;