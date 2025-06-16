'use client';
import React, { useEffect, useState } from 'react';

const daysOfWeek = [
    'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo',
];

export default function WorkingHoursConfig({
    onChange,
    readOnly = false,
    defaultValue,
}: {
    onChange: (days: any) => void;
    readOnly?: boolean;
    defaultValue?: any[];
}) {
    const initialState = defaultValue && Array.isArray(defaultValue) && defaultValue.length === 7
        ? defaultValue
        : daysOfWeek.map((day) => ({
            day,
            enabled: false,
            shifts: [{ start: '', end: '' }],
        }));

    const [workDays, setWorkDays] = useState(initialState);

    useEffect(() => {
        onChange(workDays);
    }, [workDays]);

    useEffect(() => {
        // Cuando cambie defaultValue (por ejemplo, al obtenerlo del fetch)
        if (defaultValue && defaultValue.length === 7) {
            setWorkDays(defaultValue);
        }
    }, [defaultValue]);

    const handleDayToggle = (index: number) => {
        const updated = [...workDays];
        updated[index].enabled = !updated[index].enabled;
        setWorkDays(updated);
    };

    const handleShiftChange = (
        dayIndex: number,
        shiftIndex: number,
        field: 'start' | 'end',
        value: string
    ) => {
        const updated = [...workDays];
        updated[dayIndex].shifts[shiftIndex][field] = value;
        setWorkDays(updated);
    };

    const addShift = (dayIndex: number) => {
        const updated = [...workDays];
        updated[dayIndex].shifts.push({ start: '', end: '' });
        setWorkDays(updated);
    };

    const removeShift = (dayIndex: number, shiftIndex: number) => {
        const updated = [...workDays];
        updated[dayIndex].shifts.splice(shiftIndex, 1);
        setWorkDays(updated);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-medium">Días y Horarios de Trabajo</h2>

            {workDays.map((day, i) => (
                <div key={day.day} className="border rounded-md p-4 space-y-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{day.day}</h3>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={day.enabled}
                                disabled={readOnly}
                                onChange={() => handleDayToggle(i)}
                            />
                            <span className="text-sm">Habilitar</span>
                        </label>
                    </div>

                    {day.enabled && (
                        <div className="space-y-3">
                            {day.shifts.map((shift, j) => (
                                <div key={j} className="flex gap-2 items-center">
                                    <input
                                        type="time"
                                        value={shift.start}
                                        disabled={readOnly}
                                        onChange={(e) =>
                                            handleShiftChange(i, j, 'start', e.target.value)
                                        }
                                        className="input w-32"
                                    />
                                    <span>—</span>
                                    <input
                                        type="time"
                                        value={shift.end}
                                        disabled={readOnly}
                                        onChange={(e) =>
                                            handleShiftChange(i, j, 'end', e.target.value)
                                        }
                                        className="input w-32"
                                    />
                                    {day.shifts.length > 1 && !readOnly && (
                                        <button
                                            onClick={() => removeShift(i, j)}
                                            className="text-red-500 hover:underline text-sm"
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </div>
                            ))}
                            {!readOnly && (
                                <button
                                    onClick={() => addShift(i)}
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    + Agregar otro turno
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
