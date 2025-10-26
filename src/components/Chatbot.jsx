import { useEffect, useRef, useState } from 'react';

const initialPrompts = [
  'Need help designing an AI concierge? I can walk you through live demos.',
  'Curious how our RAG copilots train on your private data? Ask me anything.',
  'Ready to automate operations? I can also book you with a strategist.'
];

const randomPrompt = () => initialPrompts[Math.floor(Math.random() * initialPrompts.length)];

const Chatbot = ({ onRequestBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [hasAutoPrompted, setHasAutoPrompted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasAutoPrompted(true);
      setMessages((prev) =>
        prev.length
          ? prev
          : [
              {
                sender: 'Byron',
                text: randomPrompt()
              }
            ]
      );
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'You', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const aiMessage = {
        sender: 'Byron',
        text:
          'I can have one of our strategists share a tailored playbook. Want me to line up a discovery call?'
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 800);
  };

  const handleBook = () => {
    setIsOpen(false);
    onRequestBooking();
  };

  return (
    <div className={`chatbot ${isOpen ? 'chatbot--open' : ''}`}>
      <div className="chatbot-buttons">
        <button
          type="button"
          className="chatbot-button chatbot-button--primary"
          onClick={() => {
            setIsOpen(false);
            onRequestBooking();
          }}
        >
          Book a call
        </button>
        <button
          type="button"
          className="chatbot-button chatbot-toggle"
          onClick={() => {
            setIsOpen((prev) => !prev);
            if (!hasAutoPrompted) {
              setMessages((prev) =>
                prev.length
                  ? prev
                  : [
                      {
                        sender: 'Byron',
                        text: randomPrompt()
                      }
                    ]
              );
              setHasAutoPrompted(true);
            }
          }}
        >
          {isOpen ? 'Hide Byron' : 'Chat with Byron'}
        </button>
      </div>
      <div className="chatbot-panel" role="region" aria-live="polite">
        <header>
          <h3>Byron • AI Concierge</h3>
          <p>Ask anything about YUVEXEL&apos;s automation studio.</p>
        </header>
        <div className="chatbot-messages" ref={containerRef}>
          {messages.map((message, index) => (
            <div key={`${message.sender}-${index}`} className={`chat-message chat-message--${message.sender === 'You' ? 'user' : 'ai'}`}>
              <span className="chat-sender">{message.sender}</span>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <div className="chatbot-actions">
          <button type="button" className="cta" onClick={handleBook}>
            Book a call
          </button>
          <form onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask Byron anything..."
              aria-label="Message Byron"
            />
            <button type="submit" className="text-button">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
