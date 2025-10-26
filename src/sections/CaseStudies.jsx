import { testimonials } from '../data/content.js';

const CaseStudies = () => (
  <section className="panel" id="case-studies">
    <header className="panel-header">
      <h3>Proof in production</h3>
      <p>Leaders trust YUVEXEL to orchestrate brand-safe automation at scale.</p>
    </header>
    <div className="testimonial-grid">
      {testimonials.map((testimonial) => (
        <figure key={testimonial.name} className="glass-card testimonial">
          <blockquote>“{testimonial.quote}”</blockquote>
          <figcaption>
            <strong>{testimonial.name}</strong>
            <span>{testimonial.role}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  </section>
);

export default CaseStudies;
