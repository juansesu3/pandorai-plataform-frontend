'use client';

import { useState } from 'react';

const agentTypes = [
    {
        id: 'ecommerce',
        label: 'Recomendación de productos',
        icon: '🛒',
    },
    {
        id: 'calendar',
        label: 'Gestión de calendarios',
        icon: '📅',
    },
];

const modelOptions = [
    { id: 'gpt-4', label: 'GPT-4' },
    { id: 'gpt-3.5', label: 'GPT-3.5 Turbo' },
    { id: 'claude-3', label: 'Claude 3' },
    { id: 'mistral', label: 'Mistral' },
];

export default function FormCreateAgent() {
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        prompt: '',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1000,
        language: 'es',
        config: {},
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'temperature' || name === 'maxTokens' ? parseFloat(value) : value
        }));
    };

    async function createAgent(payload: any) {
        try {
            const response = await fetch('http://localhost:8000/agents/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Error al crear el agente');
            }
    
            const data = await response.json();
            console.log('🎉 Agente creado:', data);
            return data;
    
        } catch (error: any) {
            console.error('❌ Error al crear el agente:', error.message);
            alert(error.message);
        }
    }
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!selectedType) {
            alert('Selecciona un tipo de agente');
            return;
        }
    
        const payload = {
            speciality: selectedType,
            name: formData.name,
            description: formData.description,
            prompt: formData.prompt,
            model: formData.model,
            temperature: formData.temperature,
            max_token: formData.maxTokens, // backend usa "max_token"
            language: formData.language,
        };
    
        const result = await createAgent(payload);
        if (result) {
            alert('✅ Agente creado exitosamente');
            // Resetear formulario si deseas
            setFormData({
                name: '',
                description: '',
                prompt: '',
                model: 'gpt-4',
                temperature: 0.7,
                maxTokens: 1000,
                language: 'es',
                config: {},
            });
            setSelectedType(null);
        }
    };
    

    return (
        <div className=" p-6 bg-white rounded-md shadow-md w-full">
            <h2 className="text-2xl font-bold mb-4">Crear agente de inteligencia artificial</h2>

            {/* Selección de tipo */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6 max-w-2xl mx-auto">
                {agentTypes.map((type) => (
                    <div
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`cursor-pointer border rounded-md p-4 transition-all hover:shadow ${selectedType === type.id ? 'border-purple-600 bg-purple-50' : 'border-gray-300'
                            }`}
                    >
                        <div className="text-3xl mb-2">{type.icon}</div>
                        <h3 className="font-semibold">{type.label}</h3>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">

                {/* Nombre */}
                <div>
                    <label className="block font-medium text-sm">Nombre del agente</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        required
                        onChange={handleChange}
                        className="w-full p-2 mt-1 border rounded"
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label className="block font-medium text-sm">Descripción</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-2 mt-1 border rounded"
                    />
                </div>

                {/* Prompt */}
                <div>
                    <label className="block font-medium text-sm">Prompt del sistema</label>
                    <textarea
                        name="prompt"
                        value={formData.prompt}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Ej. Eres un asistente experto en..."
                        className="w-full p-2 mt-1 border rounded"
                    />
                </div>

                {/* Modelo de lenguaje */}
                <div>
                    <label className="block font-medium text-sm">Modelo de lenguaje</label>
                    <select
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        className="w-full p-2 mt-1 border rounded"
                    >
                        {modelOptions.map(m => (
                            <option key={m.id} value={m.id}>{m.label}</option>
                        ))}
                    </select>
                </div>

                {/* Parámetros técnicos */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium text-sm">Temperatura</label>
                        <input
                            type="number"
                            name="temperature"
                            value={formData.temperature}
                            step={0.1}
                            min={0}
                            max={1}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-sm">Máximo de tokens</label>
                        <input
                            type="number"
                            name="maxTokens"
                            value={formData.maxTokens}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border rounded"
                        />
                    </div>
                </div>

                {/* Idioma base */}
                <div>
                    <label className="block font-medium text-sm">Idioma principal</label>
                    <input
                        type="text"
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="w-full p-2 mt-1 border rounded"
                        placeholder="Ej: es, en, fr"
                    />
                </div>

                {/* Config específica por tipo */}
                {selectedType === 'ecommerce' && (
                    <div>
                        <label className="block font-medium text-sm">Categorías de productos (coma separadas)</label>
                        <input
                            type="text"
                            name="categories"
                            placeholder="Ej: Tecnología, Moda, Hogar"
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                config: { ...prev.config, categories: e.target.value.split(',').map(s => s.trim()) }
                            }))}
                            className="w-full p-2 mt-1 border rounded"
                        />
                    </div>
                )}
                {/* Submit */}
                <button
                    type="submit"
                    className="bg-purple-600 text-white w-full py-2 rounded hover:bg-purple-700 transition"
                >
                    Crear agente
                </button>
            </form>
        </div>
    );
}
