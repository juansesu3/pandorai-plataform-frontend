'use client'
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FaRobot, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";


interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: number;
}

export default function ChatTest() {
    const { isChatWindowOpen, userUUID } = useSelector((state: any) => state.chatbot);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(true);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8000/ws/chat");

        ws.current.onopen = () => {
            console.log("WebSocket conectado");
        };

        ws.current.onmessage = (event) => {
            setIsBotTyping(false);
            const rawData = event.data;
            let messageText = "";
            try {
                const data = JSON.parse(rawData);
                messageText = data.text || rawData;
            } catch {
                messageText = rawData;
            }

            const botMessage: Message = {
                id: Date.now().toString(),
                text: messageText,
                sender: "bot",
                timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, botMessage]);
        };

        ws.current.onclose = () => {
            console.log("WebSocket desconectado");
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            ws.current?.close();
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input.trim(),
            sender: "user",
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsBotTyping(true);

        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(
                JSON.stringify({
                    message: input.trim(),
                    userUUID: userUUID || "default-session",
                })
            );
        } else {
            console.error("WebSocket no está abierto.");
        }

        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };
    const pathname = usePathname(); // 👈 Obtener la ruta actual

    // 👇 Si estamos en login o register, no mostrar el sidebar
    if (pathname.includes("/login") || pathname.includes("/register")) {
        return null;
    }
    return (

        <div className="fixed bottom-4 right-4 z-50">
            {/* Burbuja flotante si está cerrado */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-[#7d00fe] text-white flex items-center justify-center rounded-full shadow-lg hover:bg-purple-700 transition"
                    aria-label="Abrir chat"
                >
                    <FaRobot size={24} />
                </button>
            )}

            {/* Chat expandido */}
            {isOpen && (
                <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300">
                    {/* Header */}
                    <div
                        className="flex items-center justify-between bg-[#7d00fe] text-white p-3 cursor-pointer"
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="flex items-center gap-2">
                            <FaRobot className="text-lg" />
                            <span>Agente IA</span>
                        </div>
                        <FaChevronDown />
                    </div>

                    {/* Chat messages */}
                    <div className="h-[400px] overflow-y-auto p-4 bg-white">
                        {messages.length === 0 && (
                            <p className="text-gray-400 text-center mt-20">No hay mensajes aún. ¡Escribe algo!</p>
                        )}
                        {messages.map(({ id, text, sender }) => (
                            <div
                                key={id}
                                className={`mb-2 flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`px-4 py-2 rounded-lg max-w-[70%] ${sender === 'user'
                                        ? 'bg-[#410082] text-white'
                                        : 'bg-gray-200 text-gray-800'
                                        }`}
                                >
                                    {text}
                                </div>
                            </div>
                        ))}
                        {isBotTyping && (
                            <p className="text-sm text-gray-500 italic text-left">Agente escribiendo...</p>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat input */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                        className="flex border-t border-gray-300 p-2 bg-gray-50"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe un mensaje..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            className="ml-2 bg-[#7d00fe] hover:bg-purple-700 text-white px-4 rounded-md transition"
                        >
                            Enviar
                        </button>
                    </form>
                </div>
            )}
        </div>
    );


}
