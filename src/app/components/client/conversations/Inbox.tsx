'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

const conv = [
    {
        "_id": "666001a3c12f40000123abcd",
        "clientId": "684a904f006036e3fdde4b6a",
        "agentId": "68482f4377825a619d93ca77",
        "channel": "whatsapp",
        "contactId": "whatsapp:+5491134567890",
        "messages": [
            {
                "sender": "user",
                "content": "Hola, ¿me podés dar un turno para el viernes?",
                "timestamp": "2025-06-15T09:22:00Z"
            },
            {
                "sender": "agent",
                "content": "Claro, ¿qué hora preferís el viernes?",
                "timestamp": "2025-06-15T09:22:05Z"
            }
        ],
        "createdAt": "2025-06-15T09:22:00Z",
        "updatedAt": "2025-06-15T09:22:05Z"
    },
    {
        "_id": "666001a3c12f40000123abce",
        "clientId": "684a904f006036e3fdde4b6a",
        "agentId": "68482f4377825a619d93ca77",
        "channel": "whatsapp",
        "contactId": "whatsapp:+5491123456789",
        "messages": [
            {
                "sender": "user",
                "content": "Necesito cambiar mi cita del lunes",
                "timestamp": "2025-06-16T10:03:00Z"
            },
            {
                "sender": "agent",
                "content": "Entiendo, ¿para qué día querés reprogramarla?",
                "timestamp": "2025-06-16T10:03:06Z"
            }
        ],
        "createdAt": "2025-06-16T10:03:00Z",
        "updatedAt": "2025-06-16T10:03:06Z"
    },
    {
        "_id": "666001a3c12f40000123abcf",
        "clientId": "684a904f006036e3fdde4b6a",
        "agentId": "68482f4377825a619d93ca77",
        "channel": "web",
        "contactId": "user123",
        "messages": [
            {
                "sender": "user",
                "content": "¿Tienen disponibilidad para corte de cabello hoy?",
                "timestamp": "2025-06-16T12:00:00Z"
            },
            {
                "sender": "agent",
                "content": "Sí, tenemos turnos disponibles a las 15:00 y 16:30",
                "timestamp": "2025-06-16T12:00:10Z"
            },
            {
                "sender": "user",
                "content": "Perfecto, agendame a las 15:00",
                "timestamp": "2025-06-16T12:00:20Z"
            },
            {
                "sender": "agent",
                "content": "Listo, tu cita está confirmada a las 15:00.",
                "timestamp": "2025-06-16T12:00:25Z"
            }
        ],
        "createdAt": "2025-06-16T12:00:00Z",
        "updatedAt": "2025-06-16T12:00:25Z"
    }
];

export default function Inbox() {
    const { agentId, clientId } = useParams();
    interface Conversation {
        _id: string;
        clientId: string;
        agentId: string;
        channel: string;
        contactId: string;
        messages: {
            sender: string;
            content: string;
            timestamp: string;
        }[];
        createdAt: string;
        updatedAt: string;
    }

    const [conversations, setConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        // const res = await fetch(`http://localhost:8000/agents/${agentId}/conversations`);
        // const data = await res.json();
        setConversations(conv);
    }, [agentId]);

    return (
        <div className="max-w-4xl mx-auto ">
            <header className="flex items-center justify-between px-6 py-4  bg-white border-b border-gray-300">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                        A
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">Agente de Reservas</h1>
                        <p className="text-sm text-gray-500">Interacciones recientes</p>
                    </div>
                </div>
                <Link
                    href={`/client/${agentId}/agents/${clientId}/interactions/admin-to-agent`}
                    className="inline-flex items-center gap-1 px-4 py-2 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition"
                >
                    💬 Hablar con el agente
                </Link>
            </header>
            <div className="bg-white   divide-y divide-gray-200">
                {conversations.map((conv: any) => {
                    const lastMsg = conv.messages[conv.messages.length - 1];
                    const displayName = conv.contactId.replace('whatsapp:', '');
                    const initials = displayName[0]?.toUpperCase() || '?';
                    const lastTime = lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                    return (
                        <Link
                            key={conv._id}
                            href={`/interactions/${agentId}/${conv._id}`}
                            className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                        >
                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-lg">
                                    {initials}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-800">{displayName}</span>
                                    <span className="text-sm text-gray-500 line-clamp-1">{lastMsg?.content || 'Sin mensajes'}</span>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400">{lastTime}</div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
