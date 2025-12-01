import React from 'react';
import styles from './Footer.module.css';
import SimbaLogo from '../images/simba-dark.png'; 
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
<footer className={styles.footer}>
<div className={styles.footerContent}>
        {/* --- Top Section --- */}
<div className={styles.footerTop}>
          {/* Logo */}
<div className={styles.footerLogo}>
<img src={SimbaLogo} alt="SIMBA Events" />
<span>SIMBA Events</span>
</div>
          {/* Links */}
          <div className={styles.footerLinks}>
            <Link to="/">Terms & Conditions</Link>
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Contact Us</Link>
          </div>
        
        </div>
        
        {/* --- Bottom Section --- */}
<div className={styles.footerBottom}>
<p className={styles.legalText}>
            © 2025 SIMBA Events. All rights reserved.
</p>
          {/* Updated Social Icons */}
          <div className={styles.socialIcons}>
            <Link to="/" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></Link>
            <Link to="/" aria-label="Facebook"><i className="fab fa-facebook-f"></i></Link>
            <Link to="/" aria-label="Instagram"><i className="fab fa-instagram"></i></Link>
            <Link to="/" aria-label="X (Twitter)"><i className="fab fa-x-twitter"></i></Link>
            <Link to="/" aria-label="YouTube"><i className="fab fa-youtube"></i></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
 
export default Footer;