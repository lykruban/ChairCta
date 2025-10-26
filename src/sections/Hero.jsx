import { metrics } from '../data/content.js';

const Hero = ({ showTitle, showButtons, onBook }) => (
  <section className="hero" id="top">
    <div className={`hero-copy ${showTitle ? 'is-visible' : ''}`}>
      <p className="eyebrow">Purpose-built AI agency</p>
      <h1>YUVEXEL</h1>
      <h2>Transforming Enterprises With Purpose-Built AI</h2>
      <p className="lead">
        We design conversational agents, retrieval copilots, and automation fabrics that move like your brand.
      </p>
      <div className={`hero-actions ${showButtons ? 'is-visible' : ''}`}>
        <button type="button" className="cta" onClick={onBook}>
          Book a Discovery Call
        </button>
        <a className="ghost" href="#services">
          Learn more
        </a>
      </div>
    </div>
    <div className={`metrics-band ${showButtons ? 'is-visible' : ''}`}>
      {metrics.map((metric) => (
        <div key={metric.label} className="metric">
          <span>{metric.value}</span>
          <small>{metric.label}</small>
        </div>
      ))}
    </div>
  </section>
);

export default Hero;
