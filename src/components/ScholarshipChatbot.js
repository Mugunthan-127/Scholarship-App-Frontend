import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, Send, X, MessageCircle, Mic, MicOff, RefreshCw,
  BookOpen, Calendar, Search, Target, Minimize2
} from "lucide-react";

const ScholarshipChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1,
      sender: "bot", 
      text: "Hi there! 🎓 I'm your AI Scholarship Assistant. I can help you find scholarships, understand requirements, and guide you through the application process. What would you like to know?", 
      timestamp: new Date(),
      suggestions: ["Find scholarships for me", "Application tips", "Upcoming deadlines", "Requirements help"]
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const simulateTyping = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      const botMessage = {
        id: Date.now(),
        sender: "bot",
        text: text,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { 
      id: Date.now(),
      sender: "user", 
      text: input, 
      timestamp: new Date() 
    };
    setMessages((prev) => [...prev, userMessage]);

    // Smart responses based on input
    const userInput = input.toLowerCase();
    let response = "";

    if (userInput.includes("scholarship") || userInput.includes("find")) {
      response = "🎯 I found several scholarships that match your profile! Based on our scholarship database, here are some great opportunities:\n\n• Merit Excellence Award - $5,000 (Deadline: March 15)\n• STEM Innovation Grant - $3,000 (Rolling admissions)\n• Community Leadership Scholarship - $2,500\n\nWould you like details on any of these?";
    } else if (userInput.includes("deadline") || userInput.includes("when")) {
      response = "📅 Here are upcoming scholarship deadlines:\n\n• Merit Excellence Award - March 15 (5 days remaining)\n• Community Service Grant - March 20\n• Academic Achievement Award - April 1\n\nI recommend applying as early as possible to increase your chances!";
    } else if (userInput.includes("requirement") || userInput.includes("eligibility")) {
      response = "📋 Common scholarship requirements include:\n\n• Minimum GPA (usually 3.0+)\n• Personal essay or statement\n• Letters of recommendation\n• Proof of enrollment\n• Financial need documentation (for need-based)\n\nWhich specific scholarship requirements would you like me to explain?";
    } else if (userInput.includes("essay") || userInput.includes("tips")) {
      response = "✍️ Here are my top scholarship essay tips:\n\n• Start with a compelling personal story\n• Show your passion and goals clearly\n• Demonstrate impact and leadership\n• Be authentic and specific\n• Proofread multiple times\n\nWould you like help with a specific essay prompt?";
    } else {
      const responses = [
        "That's a great question! As your AI assistant, I'm here to help with any scholarship-related queries. Could you be more specific about what you'd like to know?",
        "I'd be happy to help you with that! Can you tell me more about your specific scholarship needs or questions?",
        "Excellent! Let me help you navigate the scholarship process. What particular aspect would you like assistance with?"
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
    }

    simulateTyping(response);
    setInput("");
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInput("What scholarships are available for computer science students?");
      }, 2000);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = [
    { icon: Search, text: "Find My Scholarships", color: "blue" },
    { icon: Calendar, text: "Upcoming Deadlines", color: "green" },
    { icon: BookOpen, text: "Essay Help", color: "purple" },
    { icon: Target, text: "Requirements Check", color: "orange" }
  ];

  return (
    <>
      <style>{`
        .chatbot-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .floating-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
        }

        .button-wrapper {
          position: relative;
          display: inline-block;
        }

        .chat-toggle-btn {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 4px solid white;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .chat-toggle-btn.open {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        .chat-toggle-btn.closed {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        }

        .chat-toggle-btn:hover {
          transform: scale(1.1);
        }

        .chat-toggle-btn:active {
          transform: scale(0.95);
        }

        .pulse-effect {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background-color: rgba(59, 130, 246, 0.3);
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .status-indicator {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 12px;
          height: 12px;
          background-color: #4ade80;
          border-radius: 50%;
          border: 2px solid white;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }

        .tooltip {
          position: absolute;
          bottom: 100%;
          right: 0;
          margin-bottom: 8px;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }

        .button-wrapper:hover .tooltip {
          opacity: 1;
        }

        .tooltip-content {
          background-color: #111827;
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 14px;
          white-space: nowrap;
        }

        .tooltip-arrow {
          position: absolute;
          top: 100%;
          right: 12px;
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid #111827;
        }

        .chat-window {
          position: fixed;
          bottom: 96px;
          right: 24px;
          width: 384px;
          max-width: calc(100vw - 48px);
          z-index: 999;
          background: white;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          transition: all 0.5s ease-in-out;
        }

        .chat-window.open {
          transform: scale(1);
          opacity: 1;
          pointer-events: auto;
        }

        .chat-window.closed {
          transform: scale(0.95) translateY(16px);
          opacity: 0;
          pointer-events: none;
        }

        .chat-window.minimized {
          height: 64px;
        }

        .chat-window.normal {
          height: 32rem;
          max-height: calc(100vh - 192px);
        }

        .chat-header {
          background: linear-gradient(90deg, #2563eb, #8b5cf6);
          color: white;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .bot-avatar {
          width: 40px;
          height: 40px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-info h3 {
          font-weight: bold;
          margin: 0;
          font-size: 16px;
        }

        .header-info p {
          font-size: 12px;
          color: #bfdbfe;
          margin: 0;
        }

        .header-controls {
          display: flex;
          gap: 4px;
        }

        .header-btn {
          width: 32px;
          height: 32px;
          background: none;
          border: none;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .header-btn:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .messages-container {
          height: 320px;
          padding: 16px;
          overflow-y: auto;
          background-color: rgba(249, 250, 251, 0.5);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message-wrapper {
          display: flex;
        }

        .message-wrapper.user {
          justify-content: flex-end;
        }

        .message-wrapper.bot {
          justify-content: flex-start;
        }

        .message {
          max-width: 75%;
          padding: 12px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
        }

        .message.user {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message.bot {
          background: white;
          color: #1f2937;
          border: 1px solid #e5e7eb;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .bot-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .bot-mini-avatar {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bot-label {
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
        }

        .message-text {
          white-space: pre-line;
        }

        .suggestions {
          margin-top: 12px;
        }

        .suggestions-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .suggestion-btn {
          display: block;
          width: 100%;
          text-align: left;
          padding: 8px;
          font-size: 12px;
          background-color: #eff6ff;
          color: #1d4ed8;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-bottom: 4px;
        }

        .suggestion-btn:hover {
          background-color: #dbeafe;
        }

        .message-time {
          font-size: 12px;
          margin-top: 8px;
          opacity: 0.7;
        }

        .message-time.user {
          color: #bfdbfe;
        }

        .message-time.bot {
          color: #6b7280;
        }

        .quick-actions {
          margin-top: 12px;
        }

        .actions-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          padding: 0 4px;
          margin-bottom: 12px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .action-btn {
          padding: 12px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          color: white;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.2s;
        }

        .action-btn:hover {
          transform: scale(1.05);
        }

        .action-btn.blue {
          background: linear-gradient(90deg, #3b82f6, #2563eb);
        }

        .action-btn.green {
          background: linear-gradient(90deg, #10b981, #059669);
        }

        .action-btn.purple {
          background: linear-gradient(90deg, #8b5cf6, #7c3aed);
        }

        .action-btn.orange {
          background: linear-gradient(90deg, #f59e0b, #d97706);
        }

        .typing-indicator {
          display: flex;
          justify-content: flex-start;
        }

        .typing-bubble {
          background: white;
          border: 1px solid #e5e7eb;
          padding: 12px;
          border-radius: 16px;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          max-width: 75%;
        }

        .typing-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          background-color: #3b82f6;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          } 40% {
            transform: scale(1);
          }
        }

        .input-area {
          padding: 16px;
          background: white;
          border-top: 1px solid #e5e7eb;
        }

        .input-wrapper {
          display: flex;
          gap: 8px;
        }

        .input-container {
          position: relative;
          flex: 1;
        }

        .message-input {
          width: 100%;
          padding: 12px 40px 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .message-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .voice-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 8px;
          transition: color 0.2s;
        }

        .voice-btn.listening {
          color: #ef4444;
          animation: pulse 1s infinite;
        }

        .voice-btn.idle {
          color: #9ca3af;
        }

        .voice-btn.idle:hover {
          color: #6b7280;
        }

        .send-btn {
          min-width: 48px;
          padding: 12px 16px;
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .send-btn:hover:not(:disabled) {
          background: linear-gradient(90deg, #2563eb, #1d4ed8);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .powered-by {
          font-size: 12px;
          color: #6b7280;
          text-align: center;
          margin-top: 8px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 640px) {
          .chat-window {
            width: calc(100vw - 32px);
            right: 16px;
          }
          
          .floating-button {
            right: 16px;
          }
        }
      `}</style>

      <div className="chatbot-container">
        {/* Floating Chat Button */}
        <div className="floating-button">
          <div className="button-wrapper">
            <button
              onClick={toggleChat}
              className={`chat-toggle-btn ${isOpen ? 'open' : 'closed'}`}
            >
              <div className="pulse-effect" />
              {isOpen ? (
                <X size={24} color="white" />
              ) : (
                <div style={{ position: 'relative' }}>
                  <MessageCircle size={28} color="white" />
                  <div className="status-indicator" />
                </div>
              )}
            </button>

            {/* Tooltip */}
            {!isOpen && (
              <div className="tooltip">
                <div className="tooltip-content">
                  💬 Scholarship Assistant
                </div>
                <div className="tooltip-arrow" />
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`chat-window ${isOpen ? 'open' : 'closed'} ${isMinimized ? 'minimized' : 'normal'}`}>
          {/* Header */}
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="bot-avatar">
                <Bot size={24} />
              </div>
              <div className="header-info">
                <h3>Scholarship Assistant</h3>
                <p>AI-Powered • Always Online</p>
              </div>
            </div>
            <div className="header-controls">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="header-btn"
              >
                <Minimize2 size={16} />
              </button>
              <button
                onClick={toggleChat}
                className="header-btn"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages - Only show when not minimized */}
          {!isMinimized && (
            <>
              <div className="messages-container">
                {messages.map((msg) => (
                  <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                    <div className={`message ${msg.sender}`}>
                      {msg.sender === "bot" && (
                        <div className="bot-header">
                          <div className="bot-mini-avatar">
                            <Bot size={16} color="white" />
                          </div>
                          <span className="bot-label">AI Assistant</span>
                        </div>
                      )}
                      
                      <div className="message-text">
                        {msg.text}
                      </div>
                      
                      {msg.suggestions && (
                        <div className="suggestions">
                          <p className="suggestions-label">Quick suggestions:</p>
                          {msg.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => setInput(suggestion)}
                              className="suggestion-btn"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      <div className={`message-time ${msg.sender}`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Quick Actions for first message */}
                {messages.length === 1 && (
                  <div className="quick-actions">
                    <p className="actions-label">🚀 Popular Actions</p>
                    <div className="actions-grid">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => setInput(action.text)}
                          className={`action-btn ${action.color}`}
                        >
                          <action.icon size={16} />
                          <span>{action.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="typing-indicator">
                    <div className="typing-bubble">
                      <div className="typing-content">
                        <div className="bot-mini-avatar">
                          <Bot size={16} color="white" />
                        </div>
                        <div className="typing-dots">
                          <div className="typing-dot" />
                          <div className="typing-dot" />
                          <div className="typing-dot" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="input-area">
                <div className="input-wrapper">
                  <div className="input-container">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                      placeholder="Ask about scholarships, deadlines, requirements..."
                      className="message-input"
                      disabled={isTyping}
                    />
                    <button
                      onClick={handleVoiceInput}
                      className={`voice-btn ${isListening ? 'listening' : 'idle'}`}
                    >
                      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="send-btn"
                  >
                    {isTyping ? (
                      <RefreshCw size={16} className="spin" />
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </div>
                <p className="powered-by">
                  Powered by AI • Trained on scholarship data
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ScholarshipChatbot;