'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Client {
  id: string;
  contactName: string;
  email: string;
  companyName: string;
  businessType: string;
  status?: 'active' | 'inactive';
  country?: string;
}

export default function ClientPortfolio() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/clients')
      .then(res => res.json())
      .then(setClients);
  }, []);

  const filteredClients = clients.filter(client =>
    client.contactName.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase()) ||
    client.companyName.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Clientes ({clients.length})</h1>
          <p className="text-sm text-gray-500">Portafolio de clientes integrados en la plataforma</p>
        </div>
        <Link
          href="/client/create-client"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Nuevo Cliente
        </Link>
      </div>

      {/* Search bar */}
      <div className="relative w-full md:w-1/3">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre, empresa, email..."
          className="w-full border border-gray-300 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Grid de clientes */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClients.length === 0 ? (
          <p className="text-gray-500 col-span-full">No se encontraron clientes.</p>
        ) : (
          filteredClients.map(client => (
            <Link
              key={client.id}
              href={`/client/${client.id}`}
              className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              {/* Avatar + Info */}
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  {getInitials(client.companyName)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{client.companyName}</h3>
                  <p className="text-sm text-gray-500">{client.contactName}</p>
                </div>
              </div>

              {/* Datos clave */}
              <div className="text-sm text-gray-700 space-y-1">
                <p>✉️ <span className="text-gray-600">{client.email}</span></p>
                <p>🏢 {client.businessType || 'Sin sector definido'}</p>
                <p>
                  Estado:{' '}
                  <span
                    className={`font-medium ${
                      client.status === 'inactive' ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {client.status === 'inactive' ? 'Inactivo' : 'Activo'}
                  </span>
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
