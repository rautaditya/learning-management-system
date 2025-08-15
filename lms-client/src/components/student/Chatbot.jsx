import { useState } from "react";
import axios from "axios";
import { X, MessageSquare } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [requestId, setRequestId] = useState(null);

  const startChat = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/chatbot/helpchatbot/start");
      setMessages([{ text: res.data.question, from: "bot" }]);
      setRequestId(res.data.requestId);
    } catch (err) {
      console.error("Error starting chat:", err);
    }
  };

  const sendMessage = async (text) => {
    if (!text) return;

    // Add user's message
    setMessages((prev) => [...prev, { text, from: "user" }]);
    setInput("");

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
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          startChat();
        }}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
      >
        <MessageSquare size={28} />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-xl border z-50 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-600 text-white p-3 rounded-t-lg">
            <h3 className="text-lg font-semibold">LMS Help Bot</h3>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="p-3 h-64 overflow-y-auto text-sm flex-1">
            {messages.map((message, idx) => (
              <div key={idx} className={`mb-2 ${message.from === "user" ? "text-right" : "text-left"}`}>
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    message.from === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {message.text}
                </div>

                {/* Problem list buttons */}
                {message.problemsList && (
                  <div className="flex flex-col gap-2 mt-2">
                    {message.problemsList.map((problem, i) => (
                      <button
                        key={i}
                        className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm text-left"
                        onClick={() => sendMessage(problem)}
                      >
                        {problem}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-2 border-t flex">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none text-sm"
            />
            <button
              onClick={() => sendMessage(input)}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
