import { useEffect, useRef } from 'react';

const bubbleCount = 28;
const gearCount = 10;

const createElement = (className) => {
  const el = document.createElement('div');
  el.className = className;
  return el;
};

const generateConfig = (count, depthRange, scaleRange) =>
  Array.from({ length: count }, () => ({
    depth: Math.random() * (depthRange[1] - depthRange[0]) + depthRange[0],
    x: Math.random(),
    y: Math.random(),
    drift: Math.random() * 0.4 + 0.1,
    scale: Math.random() * (scaleRange[1] - scaleRange[0]) + scaleRange[0],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 0.15
  }));

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const BackgroundField = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion()) {
      return undefined;
    }

    const container = containerRef.current;
    const elements = [];

    const bubbleConfigs = generateConfig(bubbleCount, [200, 800], [0.8, 2.4]);
    bubbleConfigs.forEach((config) => {
      const el = createElement('bg-element bubble');
      container.appendChild(el);
      elements.push({ el, config, type: 'bubble' });
    });

    const gearConfigs = generateConfig(gearCount, [350, 950], [0.7, 1.8]);
    gearConfigs.forEach((config) => {
      const el = createElement('bg-element gear');
      const spoke = document.createElement('div');
      spoke.className = 'gear-core';
      el.appendChild(spoke);
      container.appendChild(el);
      elements.push({ el, config, type: 'gear' });
    });

    let animationFrame;
    const animate = () => {
      const time = Date.now() * 0.0006;
      elements.forEach(({ el, config, type }, index) => {
        const waveX = Math.sin(time * config.drift + index) * 6;
        const waveY = Math.cos(time * config.drift + index) * 6;
        const depthFactor = 1000 / config.depth;

        const translateX = (config.x * 100 - 50) + waveX * depthFactor;
        const translateY = (config.y * 100 - 50) + waveY * depthFactor;
        const translateZ = -config.depth;
        const rotate = config.rotation + time * 50 * config.rotationSpeed;

        el.style.transform = `translate3d(${translateX}%, ${translateY}%, ${translateZ}px) scale(${config.scale}) rotate(${rotate}deg)`;

        if (type === 'gear') {
          const core = el.firstChild;
          core.style.transform = `rotate(${rotate * 1.4}deg)`;
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      elements.forEach(({ el }) => {
        if (el.parentNode === container) {
          container.removeChild(el);
        }
      });
    };
  }, []);

  return <div className="background-field" ref={containerRef} aria-hidden="true" />;
};

export default BackgroundField;
