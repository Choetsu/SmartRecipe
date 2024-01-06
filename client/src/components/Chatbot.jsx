import { useState } from "react";
import axios from "axios";
import imgProfile from "../assets/images/profile.png";

function Chatbot() {
    const [input, setInput] = useState("");
    const [responses, setResponses] = useState([
        {
            message:
                "Bonjour, je suis George chef étoilé au guide Michelin ayant une quinzaine d'années d'expérience dans le métier avec plusieurs concours culinaires gagnés à l'internationnal. Je suis là pour répondre à tes questions sur la cuisine.",
            sender: "bot",
        },
    ]);
    const [isChatboxOpen, setIsChatboxOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toggleChatbox = () => {
        setIsChatboxOpen(!isChatboxOpen);
    };

    const sendMessage = async () => {
        if (input.trim() !== "") {
            setIsLoading(true);
            try {
                const response = await axios.post(
                    `http://localhost:3000/chatbot`,
                    {
                        chatbotInput: input,
                    }
                );
                console.log(response.data);
                setResponses([
                    ...responses,
                    { message: input, sender: "user" },
                    { message: response.data, sender: "bot" },
                ]);
            } catch (error) {
                console.error("Erreur lors de l'envoi du message :", error);
            }
            setIsLoading(false);
            setInput("");
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="overflow-hidden bg-white py-12 sm:py-16">
            <div className="fixed bottom-0 right-0 mb-4 mr-4">
                <button
                    onClick={toggleChatbox}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded="false"
                    data-state="closed"
                >
                    <svg
                        xmlns=" http://www.w3.org/2000/svg"
                        width="30"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white block border-gray-200 align-middle"
                    >
                        <path
                            d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"
                            className="border-gray-200"
                        ></path>
                    </svg>
                </button>
            </div>
            {isChatboxOpen && (
                <div className="fixed bottom-20 right-4 w-96">
                    <div className="bg-white shadow-md rounded-lg max-w-lg w-full">
                        <div className="p-4 border-b bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
                            <img
                                className="h-12 w-auto"
                                src={imgProfile}
                                alt="George"
                            />
                            <button
                                onClick={toggleChatbox}
                                className="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400"
                            >
                                <svg
                                    xmlns=" http://www.w3.org/2000/svg"
                                    width="27"
                                    height="27"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-white block border-gray-200 align-middle"
                                >
                                    <line
                                        x1="18"
                                        y1="6"
                                        x2="6"
                                        y2="18"
                                        className="border-gray-200"
                                    ></line>
                                    <line
                                        x1="6"
                                        y1="6"
                                        x2="18"
                                        y2="18"
                                        className="border-gray-200"
                                    ></line>
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 h-80 overflow-y-auto">
                            {responses.map((response, index) => (
                                <div
                                    key={index}
                                    className={`mb-2 ${
                                        response.sender === "user"
                                            ? "text-right"
                                            : ""
                                    }`}
                                >
                                    <p
                                        className={`${
                                            response.sender === "user"
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 text-gray-700"
                                        } rounded-lg py-2 px-4 inline-block`}
                                    >
                                        {response.message}
                                    </p>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-center items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t flex">
                            <input
                                type="text"
                                placeholder="Tapez un message"
                                className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
                            >
                                Envoyer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chatbot;
