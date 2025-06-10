'use client'
import React, { useEffect, useState } from 'react'
import AgentCard from '../components/agents/AgentCard'
import Link from 'next/link'


const page = () => {

    const [agents, setAgents] = useState<any[]>([]);

    const getAgents = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/agents/');
            const data = await response.json();
            setAgents(data);
            console.log('🚀 Obteniendo agentes:', data);
            return data;
        } catch (error: any) {
            console.error('❌ Error al obtener agentes:', error.message);
            alert(error.message);
        }
    };

    useEffect(() => {
        getAgents().then(data => {
            console.log('🚀 Obteniendo agentes:', data);
        });
    }, []);
    return (
        <div className='p-8 flex flex-col gap-4 '>
            <Link href="/agents/create-agent" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm w-43">
                + Crear Nuevo Agente
            </Link>

            <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
                {
                    agents?.map((agents) => (
                        <AgentCard
                        key={agents.id}
                            id={agents.id}
                            title={agents.name}
                            description={agents.description}
                            status={agents.status}
                            lastUpdate={agents.lastUpdate}
                            icon={
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4m0 0l-5 5m5-5l-5-5" />
                                </svg>
                            }
                            onManage={() => {
                                // Aquí puedes redirigir o abrir modal
                                console.log("Gestionar Recomendación");
                            }}
                        />

                    ))
                }


            </div>
        </div>
    )
}

export default page