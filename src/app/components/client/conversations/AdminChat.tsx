'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import Link from 'next/link';
import clsx from 'clsx';

interface Message {
  sender: 'admin' | 'agent';
  content: string;
  timestamp: string;
}

export default function AdminChat() {
  const { agentId, clientId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // WebSocket setup
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/agents/${agentId}/chat?client_id=${clientId}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('✅ WebSocket conectado');
      setWsConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, {
        sender: 'agent',
        content: data.response,
        timestamp: data.timestamp || new Date().toISOString(),
      }]);
    };

    socket.onclose = () => {
      console.log('🔌 WebSocket cerrado');
      setWsConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [agentId, clientId]);

  // Send message (fallback to fetch response if WS fails)
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg: Message = {
      sender: 'admin',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');

    try {
      const res = await fetch(`http://127.0.0.1:8000/messages/clients/${clientId}/agents/${agentId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg)
      });

      const data = await res.json();

      // Solo usamos la respuesta si WebSocket no está disponible
      if (!wsConnected && data.agentMessage) {
        setMessages(prev => [...prev, {
          sender: 'agent',
          content: data.agentMessage.content,
          timestamp: data.agentMessage.timestamp,
        }]);
      }
    } catch (err) {
      console.error('❌ Error al enviar mensaje:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white shadow-sm border-b border-gray-200">
        <Link href={`/client/${agentId}/agents/${clientId}/interactions/`} className="text-gray-600 hover:text-gray-800">
          <FiArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">A</div>
          <div>
            <h2 className="text-md font-semibold text-gray-800">Agente Reservas</h2>
            <p className="text-xs text-gray-500">Conectado</p>
          </div>
        </div>
        <div className="text-sm text-blue-500 font-medium">Admin</div>
      </header>

      {/* Chat history */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-100"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={clsx(
              'max-w-sm px-4 py-2 rounded-lg shadow-sm text-sm',
              msg.sender === 'admin'
                ? 'bg-blue-500 text-white ml-auto text-right'
                : 'bg-white text-gray-800'
            )}
          >
            <div dangerouslySetInnerHTML={{ __html: msg.content }} className="agent-message" />
            <span className="block text-xs mt-1 text-gray-300">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-200 flex items-center gap-2">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="p-2 text-blue-600 hover:text-blue-800 transition"
        >
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
}
