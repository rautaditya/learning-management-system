import { useState } from "react";
import axios from "axios";
import { X, MessageSquare, Send, Bot, User, Sparkles } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [requestId, setRequestId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const startChat = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/chatbot/helpchatbot/start");
      setMessages([{ text: res.data.question, from: "bot" }]);
      setRequestId(res.data.requestId);
    } catch (err) {
      console.error("Error starting chat:", err);
      setMessages([{ text: "Sorry, I'm having trouble connecting. Please try again later.", from: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user's message
    setMessages((prev) => [...prev, { text, from: "user" }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chatbot/helpchatbot/continue", {
        requestId,
        answer: text
      });

      // If bot sends next question
      if (res.data.question) {
        setMessages((prev) => [
          ...prev,
          { text: res.data.question, from: "bot", problemsList: res.data.problemsList || null }
        ]);
      } else if (res.data.message) {
        setMessages((prev) => [...prev, { text: res.data.message, from: "bot" }]);
      }
    } catch (err) {
      console.error("Error continuing chat:", err);
      setMessages((prev) => [...prev, { text: "Sorry, something went wrong. Please try again.", from: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Enhanced Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              if (messages.length === 0) startChat();
            }}
            className="group relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
          >
            {/* Pulse Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full animate-ping opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full animate-pulse opacity-20"></div>
            
            {/* Icon with Animation */}
            <MessageSquare size={28} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
            
            {/* Sparkle Effect */}
            <Sparkles size={16} className="absolute -top-1 -right-1 text-yellow-300 animate-bounce" />
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Need Help? Chat with us!
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </button>
        )}
      </div>

      {/* Enhanced Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden transform animate-in slide-in-from-bottom-5 duration-300">
          {/* Enhanced Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 left-4 w-8 h-8 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-4 right-8 w-4 h-4 bg-yellow-300 rounded-full animate-bounce delay-100"></div>
              <div className="absolute bottom-2 left-8 w-6 h-6 bg-pink-300 rounded-full animate-ping delay-200"></div>
            </div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">LMS Help Bot</h3>
                  <p className="text-xs opacity-90 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                    Online & Ready to Help
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Enhanced Chat Area */}
          <div className="p-4 h-80 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            {messages.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <Bot size={24} className="text-blue-600" />
                </div>
                <p className="text-gray-600 text-sm">Hi! I'm your LMS assistant. How can I help you today?</p>
              </div>
            )}

            {messages.map((message, idx) => (
              <div key={idx} className={`mb-4 flex ${message.from === "user" ? "justify-end" : "justify-start"} animate-in fade-in-50 slide-in-from-bottom-2 duration-300`} style={{ animationDelay: `${idx * 100}ms` }}>
                <div className={`flex items-end space-x-2 max-w-[80%] ${message.from === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.from === "user" 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500" 
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                  }`}>
                    {message.from === "user" ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <Bot size={16} className="text-white" />
                    )}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className="flex flex-col">
                    <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                      message.from === "user" 
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-md" 
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                    }`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>

                    {/* Problem List Buttons */}
                    {message.problemsList && (
                      <div className="flex flex-col gap-2 mt-3 ml-2">
                        <p className="text-xs text-gray-500 font-medium">Choose an option:</p>
                        {message.problemsList.map((problem, i) => (
                          <button
                            key={i}
                            className="bg-white hover:bg-gray-50 border border-gray-200 hover:border-indigo-300 px-4 py-3 rounded-xl text-sm text-left transition-all duration-200 transform hover:scale-105 hover:shadow-md group"
                            onClick={() => sendMessage(problem)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 group-hover:text-indigo-600 transition-colors">
                                {problem}
                              </span>
                              <Send size={12} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Animation */}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-end space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Input Area */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  rows={1}
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  style={{ maxHeight: '120px' }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                />
                
                {/* Character count or send hint */}
                {input.length > 0 && (
                  <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                    Press Enter to send
                  </div>
                )}
              </div>
              
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-center mt-3 text-xs text-gray-400">
              <span>Powered by AI • Always here to help</span>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: animate-in 0.3s ease-out forwards;
        }
        
        .slide-in-from-bottom-5 {
          animation: slide-up 0.3s ease-out;
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}