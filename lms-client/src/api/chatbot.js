import axios from "axios";
import axiosInstance from "./axiosConfig";

const API_BASE = "http://localhost:5000/api/chatbot"; // Change to your backend URL

// Start the chat (get first question)
export const startChat = async () => {
  const res = await axiosInstance.post(`${API_BASE}/helpchatbot/start`);
  return res.data;
};

// Continue the chat (send answer, get next question)
export const continueChat = async (requestId, answer) => {
  const res = await axiosInstance.post(`${API_BASE}/helpchatbot/continue`, {
    requestId,
    answer
  });
  return res.data;
};
