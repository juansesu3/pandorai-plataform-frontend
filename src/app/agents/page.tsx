'use client'
import React from 'react'
import AgentCard from '../components/agents/AgentCard'
import Link from 'next/link'

const page = () => {
    return (
        <div className='p-8 space-y-8'>
           <Link href="/agents/create-agent" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
          + Crear Nuevo Agente
        </Link>

        <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">

            <AgentCard
                title="Agente de Recomendación"
                description="Analiza el comportamiento del usuario y sugiere productos personalizados en tiempo real."
                status="Activo"
                lastUpdate="Hace 2 horas"
                id="1"
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
            <AgentCard
                title="Agente de Reservas"
                description="Automatiza el sistema de reservas con disponibilidad, confirmaciones y notificaciones."
                status="En ejecución"
                lastUpdate="Hace 30 minutos"
                id='2'
                icon={
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-9 4h6m-5 4h4" />
                    </svg>
                }
                onManage={() => {
                    console.log("Gestionar Reservas");
                }}
            />
        </div>
        </div>
    )
}

export default page