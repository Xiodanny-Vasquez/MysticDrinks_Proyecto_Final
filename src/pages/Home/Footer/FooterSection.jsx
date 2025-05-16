import React from 'react';
import './Footer.css';
import facebookIcon from '../../../assets/icons-facebook.png';
import instagramIcon from '../../../assets/icons-instagram.png';
import logoMystic from "../../../assets/logo-mystic.png";

function FooterSection() {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        <h2 className="footer-title"> <img src={logoMystic} alt="" style={{ height: "80px" }} /></h2>
        <div className="footer-contact">
          <p>Teléfono: 300-2588741</p>
          <p>Correo Electrónico: Mystic@cocteles.com</p>
        </div>
        <div className="footer-icons">
          <img src={facebookIcon} alt="Facebook" className="social-icon" />
          <img src={instagramIcon} alt="Instagram" className="social-icon" />
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
