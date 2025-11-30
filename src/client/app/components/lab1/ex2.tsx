//src/client/app/components/lab1/ex2.tsx
"use client";

import { SentenceData, CharacterPair } from "./result";

interface Ex2Props {
    pairs: CharacterPair[];
    sentences: SentenceData[];
}

export default function Ex2Display({ pairs, sentences }: Ex2Props) {
    const topN = 20;
    const sortedPairs = [...pairs]
        .sort((a, b) => b.count - a.count)
        .slice(0, topN);

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h1 className="text-2xl font-bold mb-4">
                    Lab 2: Character Interaction
                </h1>
                <p className="text-blue-700 text-sm">
                    Danh sách top {topN} cặp nhân vật xuất hiện cùng nhau thường
                    xuyên nhất trong các câu.
                </p>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16 text-center">
                                    #
                                </th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Character 1
                                </th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Character 2
                                </th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                                    Co-occurrences
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sortedPairs.map((row, i) => (
                                <tr
                                    key={`${row.character1}-${row.character2}-${i}`}
                                    className="group hover:bg-blue-50/50 transition-colors duration-200"
                                >
                                    <td className="py-4 px-6 text-sm text-gray-400 font-mono text-center group-hover:text-blue-500">
                                        {i + 1}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm">
                                                {row.character1
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-900">
                                                {row.character1}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm">
                                                {row.character2
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-900">
                                                {row.character2}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 group-hover:bg-blue-100 group-hover:text-blue-800 transition-colors">
                                            {row.count}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {sortedPairs.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="py-12 text-center text-gray-500"
                                    >
                                        No interaction data found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
