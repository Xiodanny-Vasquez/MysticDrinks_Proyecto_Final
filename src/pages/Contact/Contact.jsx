import React, { useState, useEffect } from 'react';
import './Contact.css';
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaRegPaperPlane } from "react-icons/fa";

function Contact() {
  return (
    <div className="contact-page">
      <h1>¿Necesitas ayuda o <br />tienes alguna pregunta?</h1>
      <p className="text-page">
        Nos encantaría ayudarte a disfrutar de una experiencia única con <br /> nuestros cócteles.
        Queremos escuchar tus ideas, resolver tus dudas y <br /> mejorar junto a ti, porque tu opinión
        es fundamental para que sigamos <br /> creando momentos inolvidables.
      </p>

      <div className="contact-content">
        <ContactForm />
        <ContactInfo />
      </div>
    </div>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Estado para manejar notificaciones
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, message } = formData;

    try {
      const res = await fetch('http://localhost:5000/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, message })
      });

      const data = await res.json();

      if (res.ok) {
        setNotification({ message: '✅ Mensaje enviado con éxito', type: 'success' });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setNotification({ message: '❌ Error: ' + data.error, type: 'error' });
      }
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      setNotification({ message: '❌ Error al enviar el mensaje', type: 'error' });
    }
  };

  // Limpia la notificación automáticamente después de 4 segundos
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="contact-form">
      <h2>Estamos aquí para atenderte</h2>

      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Cuéntanos tus ideas o en qué podemos ayudarte"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit">
          Enviar mensaje <FaRegPaperPlane />
        </button>
      </form>
    </div>
  );
}

function ContactInfo() {
  return (
    <div className="contact-info">
      <h2>Información de contacto</h2>
      <p><strong>Teléfono:</strong> <br />310 5869874</p>
      <p><strong>Correo electrónico:</strong> <br /> MysticDrinksCo@gmail.com</p>
      <p><strong>Horario de atención:</strong> <br />Lunes - Domingo,<br /> 7 am - 11 pm</p>
      <p><strong>Ubicación:</strong> <br /> Carrera 20 # 19-50</p>
      <p><strong>Síguenos en redes:</strong></p>
      <p><FaInstagramSquare /> @Mystic_cocktails</p>
      <p><FaFacebook /> @Mystic_cocktails</p>
    </div>
  );
}

export default Contact;