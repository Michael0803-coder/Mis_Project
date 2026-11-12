
import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  RotateCcw,
} from "lucide-react";

const INITIAL_MESSAGE = {
  id: 1,
  sender: "bot",
  text: "Hello! Welcome to our Student Information System. 👋 I'm your virtual assistant. How can I help you today?",
};

const FAQS = [
  {
    keywords: ["enroll", "enrollment", "register", "registration"],
    answer:
      "To enroll, please complete the student application form on our website. After submitting your application, the administration will review your information. You can wait for approval before proceeding with the next enrollment steps.",
  },
  {
    keywords: ["admission", "requirements", "documents", "applicant"],
    answer:
      "Admission requirements may include your previous academic records, valid identification, birth certificate, and other supporting documents required by the school. Please contact the Admissions Office for the official checklist.",
  },
  {
    keywords: ["grade", "grades", "academic record", "transcript", "gpa"],
    answer:
      "Students can access their academic records through their student accounts, if the academic records feature is enabled. For corrections or official transcripts, please coordinate with the Registrar's Office.",
  },
  {
    keywords: ["student services", "services", "assistance"],
    answer:
      "Our Student Services section provides information and assistance related to student concerns, academic support, and other available school services. Please visit the Student Services page for more information.",
  },
  {
    keywords: ["application status", "pending", "approval", "approved"],
    answer:
      "Your application must first be reviewed by the administration. Once approved, you will receive further instructions regarding your student account. For specific application status information, please contact the Admissions Office.",
  },
  {
    keywords: ["password", "login", "account", "forgot"],
    answer:
      "If you already have a student account, use your registered email and password to log in. If you have forgotten your password, use the password recovery option if available or contact the system administrator.",
  },
  {
    keywords: ["office hours", "schedule", "open", "working hours"],
    answer:
      "For accurate office hours and schedules, please check the school's official announcements or contact the administration.",
  },
  {
    keywords: ["contact", "email", "phone", "admin"],
    answer:
      "For additional assistance, please contact the school's administration or visit the appropriate office during official working hours.",
  },
  {
    keywords: ["program", "course", "degree", "bsit", "bsis"],
    answer:
      "You can explore the available academic programs on the Academic Programs section of our website. For program qualifications and curriculum information, please contact the Academic Office.",
  },
];

const QUICK_QUESTIONS = [
  "How can I enroll?",
  "What are the admission requirements?",
  "How can I check my application status?",
  "How can I access my grades?",
];

function getBotResponse(message) {
  const text = message.toLowerCase().trim();

  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(text)) {
    return "Hello! 😊 Welcome to our Student Information System. What would you like to know about enrollment, admission, academic records, or student services?";
  }

  if (/\b(thank you|thanks|thank)\b/.test(text)) {
    return "You're welcome! 😊 I'm happy to help. Feel free to ask me another question.";
  }

  if (/\b(bye|goodbye)\b/.test(text)) {
    return "Thank you for visiting our Student Information System. Have a great day! 👋";
  }

  const matchedFAQ = FAQS.find((faq) =>
    faq.keywords.some((keyword) => text.includes(keyword))
  );

  if (matchedFAQ) {
    return matchedFAQ.answer;
  }

  return "I'm sorry, I couldn't find a specific answer to your question. You can ask me about enrollment, admission requirements, application status, grades, student services, or account assistance. For concerns requiring personal student information, please contact the school administration.";
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isOpen]);

  const sendMessage = (value = input) => {
    const message = value.trim();

    if (!message) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: message,
    };

    const botMessage = {
      id: Date.now() + 1,
      sender: "bot",
      text: getBotResponse(message),
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
      botMessage,
    ]);

    setInput("");
  };

  const resetChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition hover:scale-105 hover:bg-blue-700"
          aria-label="Open virtual assistant"
        >
          <MessageCircle size={27} />
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[540px] max-h-[calc(100vh-48px)] w-[380px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between bg-blue-700 px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Bot size={24} />
              </div>

              <div>
                <h3 className="font-semibold">
                  MIS Virtual Assistant
                </h3>
                <p className="text-xs text-blue-100">
                  Online • Student Support
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetChat}
                title="Reset conversation"
                className="rounded-lg p-2 transition hover:bg-white/20"
              >
                <RotateCcw size={18} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close chatbot"
                className="rounded-lg p-2 transition hover:bg-white/20"
              >
                <X size={21} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  message.sender === "user"
                    ? "flex-row-reverse"
                    : "flex-row"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User size={17} />
                  ) : (
                    <Bot size={18} />
                  )}
                </div>

                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-3 text-sm leading-relaxed ${
                    message.sender === "user"
                      ? "rounded-tr-none bg-blue-600 text-white"
                      : "rounded-tl-none border border-gray-200 bg-white text-gray-700"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="space-y-2 pt-3">
                <p className="text-xs font-semibold text-gray-500">
                  FREQUENTLY ASKED QUESTIONS
                </p>

                {QUICK_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    onClick={() => sendMessage(question)}
                    className="block w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-left text-sm text-blue-700 transition hover:bg-blue-50"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-gray-200 bg-white p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="min-w-0 flex-1 rounded-full border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>

          {/* Footer */}
          <div className="bg-white pb-2 text-center text-[10px] text-gray-400">
            Student Information System • Virtual Assistance
          </div>
        </div>
      )}
    </>
  );
}
