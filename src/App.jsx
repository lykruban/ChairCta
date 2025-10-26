import { useEffect, useState } from 'react';
import BackgroundField from './components/BackgroundField.jsx';
import BookingModal from './components/BookingModal.jsx';
import Chatbot from './components/Chatbot.jsx';
import Hero from './sections/Hero.jsx';
import Services from './sections/Services.jsx';
import Process from './sections/Process.jsx';
import CaseStudies from './sections/CaseStudies.jsx';
import Contact from './sections/Contact.jsx';
import { navLinks } from './data/content.js';
import './styles/app.css';

const App = () => {
  const [showTitle, setShowTitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const titleTimer = setTimeout(() => setShowTitle(true), 400);
    const buttonTimer = setTimeout(() => setShowButtons(true), 900);
    return () => {
      clearTimeout(titleTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  return (
    <div className="app-shell">
      <BackgroundField />
      <BookingModal isOpen={isModalOpen} onClose={closeModal} />
      <header className="site-header">
        <div className="brand">YUVEXEL</div>
        <nav>
          <ul>
            {navLinks.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <button type="button" className="ghost" onClick={openModal}>
          Book a call
        </button>
      </header>
      <main>
        <Hero showTitle={showTitle} showButtons={showButtons} onBook={openModal} />
        <Services />
        <Process />
        <CaseStudies />
        <Contact onBook={openModal} />
      </main>
      <footer className="site-footer">
        <p>© {new Date().getFullYear()} YUVEXEL. Crafted for trailblazing operators.</p>
      </footer>
      <Chatbot onRequestBooking={openModal} />
    </div>
  );
};

export default App;
