//src/client/app/components/lab4/Lab4Result.tsx
"use client";

import { useEffect, useState } from "react";

interface MailResult {
    text: string;
    label: string;
    prediction: string;
}

interface Stats {
    total: number;
    correct: number;
    accuracy: string;
    spamCount: number;
    hamCount: number;
}

interface ApiResponse {
    stats: Stats;
    rows: MailResult[];
    error?: string;
}

export default function Lab4Result() {
    const [data, setData] = useState<MailResult[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        fetch("/api/lab4")
            .then(async (res) => {
                const json: ApiResponse = await res.json();
                if (!res.ok) throw new Error(json.error || "Failed to fetch");
                return json;
            })
            .then((json) => {
                setData(json.rows);
                setStats(json.stats);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Unknown error");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-6">Loading data...</div>;

    if (error)
        return (
            <div className="p-6 text-red-600 border border-red-300 bg-red-50 rounded">
                Error: {error}
            </div>
        );

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">
                Lab 4 – Spam Mail Classifier (Spark)
            </h1>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 border rounded shadow-sm">
                        <div className="text-gray-500 text-sm">Accuracy</div>
                        <div className="text-2xl font-bold text-green-600">
                            {stats.accuracy}%
                        </div>
                    </div>
                    <div className="bg-white p-4 border rounded shadow-sm">
                        <div className="text-gray-500 text-sm">
                            Total Messages
                        </div>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </div>
                    <div className="bg-white p-4 border rounded shadow-sm">
                        <div className="text-gray-500 text-sm">
                            Predicted Spam
                        </div>
                        <div className="text-2xl font-bold text-red-500">
                            {stats.spamCount}
                        </div>
                    </div>
                    <div className="bg-white p-4 border rounded shadow-sm">
                        <div className="text-gray-500 text-sm">
                            Predicted Ham
                        </div>
                        <div className="text-2xl font-bold text-blue-500">
                            {stats.hamCount}
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto border rounded shadow-sm">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left border-b w-1/2">
                                Message
                            </th>
                            <th className="px-4 py-2 text-left border-b">
                                Label
                            </th>
                            <th className="px-4 py-2 text-left border-b">
                                Prediction
                            </th>
                            <th className="px-4 py-2 text-left border-b">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => {
                            const predLabel =
                                parseFloat(row.prediction) === 1.0
                                    ? "spam"
                                    : "ham";
                            const isCorrect =
                                predLabel === row.label.toLowerCase();

                            return (
                                <tr
                                    key={i}
                                    className={
                                        !isCorrect
                                            ? "bg-red-50"
                                            : "hover:bg-gray-50"
                                    }
                                >
                                    <td className="px-4 py-2 border-b">
                                        <div
                                            className="line-clamp-2"
                                            title={row.text}
                                        >
                                            {row.text}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-bold ${
                                                row.label.toLowerCase() ===
                                                "spam"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-blue-100 text-blue-800"
                                            }`}
                                        >
                                            {row.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 border-b">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-bold ${
                                                predLabel === "spam"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-blue-100 text-blue-800"
                                            }`}
                                        >
                                            {predLabel}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 border-b font-bold">
                                        {isCorrect ? (
                                            <span className="text-green-600">
                                                PASS
                                            </span>
                                        ) : (
                                            <span className="text-red-600">
                                                FAIL
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
