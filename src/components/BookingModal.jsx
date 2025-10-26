import { useEffect, useState } from 'react';

const BookingModal = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.currentTarget.reset();
    setSubmitted(true);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <div className="modal-card">
        <div className="modal-header">
          <h2 id="booking-title">Schedule a Discovery Call</h2>
          <button type="button" className="text-button" onClick={onClose}>
            Close
          </button>
        </div>
        {submitted ? (
          <div className="modal-success">
            <h3>We&apos;ve received your request</h3>
            <p>
              A YUVEXEL strategist will reach out shortly with times that align with your calendar preferences.
            </p>
            <button type="button" className="cta" onClick={onClose}>
              Return to site
            </button>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Name</span>
              <input required name="name" placeholder="Alex Johnson" />
            </label>
            <label className="field">
              <span>Work Email</span>
              <input required type="email" name="email" placeholder="alex@company.com" />
            </label>
            <label className="field">
              <span>Team Size</span>
              <select name="teamSize" defaultValue="">
                <option value="" disabled>
                  Select an option
                </option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201+">201+</option>
              </select>
            </label>
            <label className="field">
              <span>Priority Focus</span>
              <textarea
                name="focus"
                rows="3"
                placeholder="Tell us what you&apos;d like to automate or which journeys need a concierge."
              />
            </label>
            <div className="modal-actions">
              <button type="submit" className="cta">
                Request time with our team
              </button>
              <button type="button" className="text-button" onClick={onClose}>
                Maybe later
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
