import React, { useEffect, useState } from 'react';
import './CategoryList.css';
import axios from 'axios';
import { FaMusic, FaLaughBeam, FaTheaterMasks, FaGlassCheers, FaUtensils, FaFutbol, FaLaptop, FaHandSparkles } from 'react-icons/fa';

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

const CategoryList = ({ onCategoryClick, activeCategoryId }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    axios.get('https://localhost:7283/api/Categories')
      .then(res => setCategories(res.data))
      .catch(() => setErrorMsg('Failed to load categories.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="category-container">
      {loading ? (
        <div className="spinner"></div>
      ) : errorMsg ? (
        <p>{errorMsg}</p>
      ) : (
        <div className="category-grid">
          {categories.map(cat => (
            <div
              key={cat.categoryID}
              className={`category-card ${activeCategoryId === cat.categoryID ? 'active' : ''}`}
              onClick={() => onCategoryClick(cat.categoryID)}
            >
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