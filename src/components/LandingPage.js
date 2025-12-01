import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const images = [
  'https://www.bing.com/th/id/OIP.NPxeDEWJqDQTbstfinvgeQHaE7?w=244&h=211&c=8&rs=1&qlt=90&o=6&cb=ucfimgc1&dpr=1.5&pid=3.1&rm=2', // Party crowd
  'https://tse4.mm.bing.net/th/id/OIP.IMyATVvehQRZAdEt7A_PugAAAA?w=219&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3', // DJ lights
  'https://tse3.mm.bing.net/th/id/OIP.e11eoU1Z4x15oXYK_xj-vAHaEK?w=301&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.5&pid=1.7&rm=3'  // Dance floor
];

let currentIndex = 0;
const bgEl = document.querySelector('.landing-bg');

function showNextBackground(nextUrl) {
  if (!bgEl) return;
  // set next layer
  bgEl.style.setProperty('--bg-next', `url("${nextUrl}")`);
  // trigger fade
  bgEl.classList.add('is-transitioning');

  // when transition ends, move next to current and clear transitioning
  const onEnd = (e) => {
    if (e.propertyName !== 'opacity') return;
    // set current to the new image
    bgEl.style.setProperty('--bg-current', `url("${nextUrl}")`);
    // reset next (optional)
    // bgEl.style.removeProperty('--bg-next');
    bgEl.classList.remove('is-transitioning');
    bgEl.removeEventListener('transitionend', onEnd);
  };
  bgEl.addEventListener('transitionend', onEnd);
}

// usage: cycle through images without pause between fades
function cycleBackgrounds(images, interval = 4000) {
  if (!images || images.length < 2) return;
  setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    showNextBackground(images[currentIndex]);
  }, interval);
}

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(images[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => {
        const nextIndex = (images.indexOf(prevImage) + 1) % images.length;
        return images[nextIndex];
      });
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-container">
      {/* Background Carousel */}
      <div
        className="landing-bg"
        style={{ backgroundImage: `url(${currentImage})` }}
      ></div>

      {/* Overlay Content */}
      <div className="landing-content">
        <h1 className="welcome-text">Welcome to SIMBA Events</h1>
        <p className="sub-text">Your one-stop destination for organizing and booking events</p>

        <div className="options-container">
          {/* Organize Event */}
          <div className="option-card">
            <h2>Organize an Event</h2>
            <p>Create and manage your own events effortlessly.</p>
            <button onClick={() => navigate('/login')} className="landing-btn">
              Create Event
            </button>
          </div>

          {/* Explore Events */}
          <div className="option-card">
            <h2>Explore Events</h2>
            <p>Discover amazing events and book your tickets now.</p>
            <button onClick={() => navigate('/login')} className="landing-btn">
              Book Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;