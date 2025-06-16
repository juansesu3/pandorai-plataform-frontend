'use client'
import ClientProfile from '@/app/components/client/ClientProfile'
import { useParams } from 'next/navigation';
import React from 'react'

const page = () => {
      const {clientId} = useParams();


  return (
    <div>
        <ClientProfile clientId={clientId }/>
    </div>
  )
}

export default page