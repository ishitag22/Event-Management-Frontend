import React, { useState, useEffect, useCallback } from 'react';
import './ImageCarousel.css';


// --- Corrected ImageCarousel Component ---
const ImageCarousel = ({ images }) => {
  // 1. CALL ALL HOOKS UNCONDITIONALLY AT THE TOP
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = React.useRef(null);
  
  // Use useCallback unconditionally
  const nextSlide = useCallback(() => {
    // We safely use 'images.length' here because the dependency array
    // ensures the function is recreated if the length changes.
    setCurrentIndex(prevIndex => (prevIndex + 1) % (images?.length || 1));
  }, [images?.length]); // Depend on optional chain result

  // Use useEffect unconditionally
  useEffect(() => {
    // Check condition *inside* the hook effect function
    if (images && images.length > 1) {
      const interval = setInterval(nextSlide, 3000); 
      return () => clearInterval(interval);
    }
  }, [nextSlide, images?.length, images]); // Depend on optional chain result

  // Use useEffect unconditionally
  useEffect(() => {
    if (carouselRef.current) {
      const offset = -currentIndex * 100;
      carouselRef.current.style.transform = `translateX(${offset}%)`;
    }
  }, [currentIndex]);


  // 2. USE THE EARLY RETURN (Conditional Logic) HERE
  if (!images || images.length === 0) {
      return (
          <div className="carousel-wrapper" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--simba-light-grey)'}}>
              <p style={{color: 'var(--simba-text-medium)'}}>No images available for this event.</p>
          </div>
      );
  }
  
  // 3. RENDER THE FINAL JSX
  return (
    <div className="carousel-wrapper">
      <div 
        className="carousel-inner"
        ref={carouselRef}
        style={{ width: `${images.length * 100}%` }}
      >
        {images.map((img, index) => (
          <div 
            key={index} 
            className="carousel-slide"
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;