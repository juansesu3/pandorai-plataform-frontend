'use client'
import AgentDetail from '@/app/components/agents/AgentDetail'
import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {
  const params = useParams();
  const id = params?.id as string;
  return (
    <div>
        <AgentDetail agentId={id} />
    </div>
  )
}

export default page