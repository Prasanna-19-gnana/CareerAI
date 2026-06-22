import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi! I'm your CareerAI assistant. How can I help you today?", sender: 'bot' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat/', { message: userMessage });
      setMessages(prev => [...prev, { text: res.data.reply, sender: 'bot' }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-indigo-500/50 hover:scale-110 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare size={28} />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-96 h-[500px] max-h-[80vh] bg-white rounded-3xl shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-3xl flex justify-between items-center shadow-md z-10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold">CareerAI Guide</h3>
              <p className="text-xs text-indigo-100">Always here to help</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-indigo-100 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end space-x-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-purple-100 text-purple-600'}`}>
                  {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-3 rounded-2xl shadow-sm text-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white text-slate-700 border border-slate-100 rounded-bl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2 max-w-[80%]">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Bot size={14} />
                </div>
                <div className="p-4 bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-bl-sm shadow-sm flex space-x-1.5">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: "0.15s"}}></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: "0.3s"}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-100 rounded-b-3xl">
          <form onSubmit={handleSend} className="flex space-x-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about careers, skills..."
              className="flex-1 bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
