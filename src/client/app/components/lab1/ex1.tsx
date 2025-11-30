//src/client/app/components/lab1/ex1.tsx
import React from "react";

// FIX: Định nghĩa và export các type này tại đây để result.tsx có thể sử dụng
export interface WordCount {
    word: string;
    count: number;
}

export interface Ex1Response {
    words: WordCount[];
    characters: WordCount[];
}

interface Ex1Props {
    data: Ex1Response;
    loading?: boolean;
}

export default function Ex1Display({ data, loading = false }: Ex1Props) {
    // Safe access checks to prevent crashes if API returns unexpected structure
    const safeWords: WordCount[] = Array.isArray(data?.words) ? data.words : [];
    const safeCharacters: WordCount[] = Array.isArray(data?.characters)
        ? data.characters
        : [];

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
                ))}
            </div>
        );
    }

    if (safeWords.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">
                    No data available to display.
                </p>
            </div>
        );
    }

    const top3 = safeWords.slice(0, 3);
    const rest = safeWords.slice(3, 20);

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold mb-4">Lab 1 — Word Count</h1>

            {/* Top 3 Words */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {top3.map((item, index) => {
                    let rankStyle = "bg-white border-gray-200 text-gray-700";
                    if (index === 0)
                        rankStyle =
                            "bg-yellow-50 border-yellow-400 text-yellow-800 ring-4 ring-yellow-400/20";
                    else if (index === 1)
                        rankStyle =
                            "bg-gray-50 border-gray-400 text-gray-800 ring-4 ring-gray-400/20";
                    else if (index === 2)
                        rankStyle =
                            "bg-orange-50 border-orange-400 text-orange-800 ring-4 ring-orange-400/20";

                    return (
                        <div
                            key={`${item.word}-${index}`}
                            className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border shadow-sm transition-transform duration-300 hover:-translate-y-1 ${rankStyle}`}
                        >
                            <div className="absolute top-4 right-4 text-xs font-black opacity-50 tracking-widest">
                                RANK #{index + 1}
                            </div>
                            <div className="text-3xl font-black capitalize mb-2 text-center break-words w-full">
                                {item.word}
                            </div>
                            <div className="text-xs uppercase font-semibold opacity-60 mb-1">
                                Count
                            </div>
                            <div className="text-4xl font-mono font-bold">
                                {item.count}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Rest of the words */}
            {rest.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-700">
                            Next Frequent Words
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-gray-100">
                        {rest.map((item, index) => (
                            <div
                                key={`${item.word}-${index}`}
                                className="bg-white p-4 flex flex-col items-center justify-center hover:bg-blue-50 transition-colors group cursor-default"
                            >
                                <span className="text-xs font-mono text-gray-400 mb-1 group-hover:text-blue-400">
                                    #{index + 4}
                                </span>
                                <span className="font-medium text-gray-800 capitalize mb-1 text-center truncate w-full px-2 group-hover:text-blue-700">
                                    {item.word}
                                </span>
                                <span className="text-sm font-bold text-gray-500 font-mono group-hover:text-blue-600">
                                    {item.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Characters Section */}
            {safeCharacters.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-700 mb-4">
                        Character Mention Count
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {safeCharacters.map((c, idx) => (
                            <div
                                key={`${c.word}-${idx}`}
                                className="bg-gray-50 border rounded-xl p-4 flex flex-col items-center"
                            >
                                <span className="text-sm font-bold capitalize text-gray-700">
                                    {c.word}
                                </span>
                                <span className="text-xl font-mono font-extrabold text-blue-600">
                                    {c.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
