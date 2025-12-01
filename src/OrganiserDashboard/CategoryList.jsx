import React, { useEffect, useState } from 'react';
import './CategoryList.css';
import axios from 'axios';
import { FaMusic, FaLaughBeam, FaTheaterMasks, FaGlassCheers, FaUtensils, FaFutbol, FaLaptop } from 'react-icons/fa';

const iconMap = {
  Music: <FaMusic />,
  Comedy: <FaLaughBeam />,
  Performances: <FaTheaterMasks />,
  NightLife: <FaGlassCheers />,
  'Food & Drinks': <FaUtensils />,
  Sports: <FaFutbol />,
  Tech: <FaLaptop />,
  Art: <FaTheaterMasks />
};

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://localhost:7283/api/Categories');
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setErrorMsg('No Categories Found');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setErrorMsg('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="category-container">
      {loading ? (
        <div className="spinner"></div>
      ) : errorMsg ? (
        <p>{errorMsg}</p>
      ) : (
        <div className="category-grid">
          {categories.map((cat) => (
            <div key={cat.categoryID} className="category-card">
              <div className="category-icon">{iconMap[cat.categoryName] || <FaHandSparkles />}</div>
              <h2>{cat.categoryName}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;