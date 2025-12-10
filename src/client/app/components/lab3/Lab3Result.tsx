//src/client/app/components/lab3/Lab3Result.tsx
"use client";

import { useEffect, useState } from "react";

interface Lab3Row {
    month: number;
    avgArrDelay: number;
    avgDepDelay: number;
}

export default function Lab3Result() {
    const [rows, setRows] = useState<Lab3Row[]>([]);

    useEffect(() => {
        fetch("/api/lab3")
            .then((res) => res.json())
            .then((data) => setRows(data.data || []));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Lab 3 – Flight Delay Analysis (Pig)
            </h1>

            <table className="min-w-full border border-gray-400">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border px-3 py-2">Month</th>
                        <th className="border px-3 py-2">Avg Arrival Delay</th>
                        <th className="border px-3 py-2">
                            Avg Departure Delay
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((r) => (
                        <tr key={r.month}>
                            <td className="border px-3 py-2">{r.month}</td>
                            <td className="border px-3 py-2">
                                {r.avgArrDelay.toFixed(2)}
                            </td>
                            <td className="border px-3 py-2">
                                {r.avgDepDelay.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
