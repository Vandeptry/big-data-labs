//src/client/app/components/lab1/ex3.tsx
"use client";

import { useState, useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import type { CharacterSentiment, ChapterSentiment } from "@/app/type";

interface Props {
    characters: CharacterSentiment[];
    chapters: ChapterSentiment[];
}

export default function Ex3Display({ characters, chapters }: Props) {
    const characterNames = useMemo(() => {
        const names = Array.from(
            new Set(characters.map((c) => c.character).filter((n) => n))
        );
        return names.length > 0 ? names : ["Harry"];
    }, [characters]);

    const [selectedCharacter, setSelectedCharacter] = useState<string>(
        characterNames[0] || "Harry"
    );

    const chapterSeries = useMemo(() => {
        return chapters
            .filter((c) => {
                const charName = String(c.character ?? "").toLowerCase();
                const selected = String(selectedCharacter ?? "").toLowerCase();
                return charName === selected;
            })
            .sort((a, b) => a.chapter_number - b.chapter_number)
            .map((c) => ({
                chapter: c.chapter_number,
                avg_sentiment: Number(c.avg_sentiment ?? 0),
            }));
    }, [chapters, selectedCharacter]);

    return (
        <div className="space-y-10">
            <h1 className="text-2xl font-bold">Lab 1 — Sentiment Analysis</h1>

            {/* CHARACTER SENTIMENT LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {characters.map((c, idx) => (
                    <div
                        key={`${c.character}-${idx}`}
                        className="p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold capitalize text-gray-800">
                                {c.character}
                            </h3>
                            <span
                                className={`font-mono text-sm px-2 py-1 rounded ${
                                    (c.avg_sentiment ?? 0) > 0
                                        ? "bg-green-50 text-green-700"
                                        : "bg-red-50 text-red-700"
                                }`}
                            >
                                {(c.avg_sentiment ?? 0) > 0 ? "+" : ""}
                                {Number(c.avg_sentiment ?? 0).toFixed(4)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* SELECTOR */}
            <div className="flex flex-wrap gap-2">
                {characterNames.map((name) => (
                    <button
                        key={name}
                        onClick={() => setSelectedCharacter(name)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                            selectedCharacter === name
                                ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600 ring-offset-1"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        {name}
                    </button>
                ))}
            </div>

            {/* CHAPTER SENTIMENT CHART */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <span>Sentiment Progression:</span>
                    <span className="capitalize text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {selectedCharacter}
                    </span>
                </h2>

                {chapterSeries.length === 0 ? (
                    <div className="h-[350px] flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
                        No sentiment data available.
                    </div>
                ) : (
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chapterSeries}
                                margin={{ left: 10, right: 10 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#f0f0f0"
                                />
                                <XAxis
                                    dataKey="chapter"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#888", fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    domain={["auto", "auto"]}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#888", fontSize: 12 }}
                                    width={50}
                                    tickFormatter={(val: number) =>
                                        Number(val).toFixed(3)
                                    }
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "none",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    }}
                                    formatter={(val: number) => [
                                        val.toFixed(5),
                                        "Sentiment",
                                    ]}
                                    labelFormatter={(label) =>
                                        `Chapter ${label}`
                                    }
                                />
                                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                                <Line
                                    type="monotone"
                                    dataKey="avg_sentiment"
                                    name="Sentiment Score"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    dot={{
                                        r: 3,
                                        fill: "#2563eb",
                                        strokeWidth: 0,
                                    }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
}
