import { services } from '../data/content.js';

const Services = () => (
  <section className="panel" id="services">
    <header className="panel-header">
      <h3>What we build</h3>
      <p>Agentic experiences that listen, learn, and execute inside your systems.</p>
    </header>
    <div className="panel-grid">
      {services.map((service) => (
        <article key={service.title} className="glass-card">
          <div className="card-heading">
            <h4>{service.title}</h4>
            <p>{service.blurb}</p>
          </div>
          <ul>
            {service.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <button type="button" className="text-link">
            Explore capabilities
          </button>
        </article>
      ))}
    </div>
  </section>
);

export default Services;
