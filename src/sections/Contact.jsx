const Contact = ({ onBook }) => (
  <section className="panel contact" id="contact">
    <div className="panel-header">
      <h3>Let&apos;s architect your AI operating layer</h3>
      <p>
        Share your mission and we&apos;ll assemble an automation team that ships faster than typical consulting cycles.
      </p>
    </div>
    <div className="contact-actions">
      <button type="button" className="cta" onClick={onBook}>
        Book a discovery call
      </button>
      <a href="mailto:hello@yuvexel.ai" className="ghost">
        Email us
      </a>
    </div>
  </section>
);

export default Contact;
