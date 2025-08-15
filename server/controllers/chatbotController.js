// controllers/helpChatbotController.js
const HelpRequest = require('../models/ChatbotQA');

const predefinedProblems = [
  "Login Issues",
  "Payment Failed",
  "Course Not Loading",
  "Certificate Not Generated",
  "Other"
];

// Start conversation
exports.startChat = async (req, res) => {
  try {
    const newRequest = new HelpRequest();
    await newRequest.save();

    res.status(200).json({
      requestId: newRequest._id,
      question: "What's your name?"
    });
  } catch (error) {
    console.error("Error starting chat:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Continue conversation
exports.continueChat = async (req, res) => {
  try {
    const { requestId, answer } = req.body;
    const request = await HelpRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Step-based logic
    if (request.step === 1) {
      request.name = answer;
      request.step = 2;
      await request.save();
      return res.json({ question: "What is your mobile number?" });
    }

    if (request.step === 2) {
      request.mobile = answer;
      request.step = 3;
      await request.save();
      return res.json({ question: "What is your email?" });
    }

    if (request.step === 3) {
      request.email = answer;
      request.step = 4;
      await request.save();
      return res.json({ question: "What's your problem?", problemsList: predefinedProblems });
    }

    if (request.step === 4) {
      request.problem = answer;
      request.completed = true;
      await request.save();
      return res.json({ message: "Thank you, our coordinator will connect soon" });
    }
  } catch (error) {
    console.error("Error continuing chat:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// // Get all chatbot conversations
// exports.getAllChats = async (req, res) => {
//   try {
//     const chats = await HelpRequest.find().sort({ createdAt: -1 });
//     res.status(200).json(chats);
//   } catch (error) {
//     console.error("Error fetching chatbot data:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };