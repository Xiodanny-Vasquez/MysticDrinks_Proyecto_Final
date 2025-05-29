import React from 'react';
import './Footer.css';
import facebookIcon from '../../../assets/icons-facebook.png';
import instagramIcon from '../../../assets/icons-instagram.png';
import logoMystic from "../../../assets/logo-mystic.png";

function FooterSection() {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logoMystic} alt="Logo Mystic Drinks" style={{ height: "80px" }} />
        </div>
        <div className="footer-contact">
          <p>Teléfono: 319 238 2148</p>
          <p>Correo Electrónico: MysticDrinksCo@gmail.com</p>
        </div>
        <div className="footer-icons">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <img src={facebookIcon} alt="Facebook" className="social-icon" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src={instagramIcon} alt="Instagram" className="social-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
