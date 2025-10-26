import { processSteps } from '../data/content.js';

const Process = () => (
  <section className="panel" id="process">
    <header className="panel-header">
      <h3>How we partner</h3>
      <p>A transparent build cadence with measurable checkpoints.</p>
    </header>
    <ol className="process-list">
      {processSteps.map((step) => (
        <li key={step.title}>
          <div className="badge" aria-hidden="true" />
          <div>
            <h4>{step.title}</h4>
            <p>{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  </section>
);

export default Process;
