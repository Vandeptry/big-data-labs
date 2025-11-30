//src/client/app/components/lab1/result.tsx
"use client";

import { useEffect, useState } from "react";
import Ex1Display, { WordCount } from "./ex1";
import Ex2Display from "./ex2";
import Ex3Display from "./ex3";
import { Ex4Response } from "@/app/api/lab1/ex4/route";
import Ex4Display from "./ex4";
import type { CharacterSentiment, ChapterSentiment } from "../../type";

export interface Ex1Response {
    words: WordCount[];
    characters: WordCount[];
}

export interface SentenceData {
    chapter_number: number;
    sentence_number: number;
    sentence_text: string;
}

export interface CharacterPair {
    character1: string;
    character2: string;
    count: number;
}

export interface Ex2Response {
    sentences: SentenceData[];
    pairs: CharacterPair[];
}

export interface Ex3Response {
    characters: CharacterSentiment[];
    chapters: ChapterSentiment[];
}

const TABS = [
    { id: "ex1", label: "Word Count" },
    { id: "ex2", label: "Character Interaction" },
    { id: "ex3", label: "Sentiment Analysis" },
    { id: "ex4", label: "Reddit Antiwork" },
];

export default function Lab1Result() {
    const [activeTab, setActiveTab] = useState<string>("ex1");
    const [ex1Data, setEx1Data] = useState<Ex1Response | null>(null);

    const [ex2Data, setEx2Data] = useState<Ex2Response | null>(null);
    const [ex3Data, setEx3Data] = useState<Ex3Response | null>(null);
    const [ex4Data, setEx4Data] = useState<Ex4Response | null>(null);

    const [loadingEx1, setLoadingEx1] = useState(true);
    const [loadingEx2, setLoadingEx2] = useState(true);
    const [loadingEx3, setLoadingEx3] = useState(true);
    const [loadingEx4, setLoadingEx4] = useState(true);

    useEffect(() => {
        // === EX1 ===
        fetch("/api/lab1/ex1")
            .then((res) => res.json())
            .then((data: Ex1Response) => {
                // Ép kiểu dữ liệu nhận về
                setEx1Data(data);
                setLoadingEx1(false);
            })
            .catch((err) => {
                console.error(err);
                setLoadingEx1(false);
            });

        // === EX2 ===
        fetch("/api/lab1/ex2")
            .then((res) => res.json())
            .then((data: Ex2Response) => {
                setEx2Data(data);
                setLoadingEx2(false);
            });

        // === EX3 ===
        fetch("/api/lab1/ex3")
            .then((res) => res.json())
            .then((data: Ex3Response) => {
                setEx3Data(data);
                setLoadingEx3(false);
            });

        // === EX4 ===
        fetch("/api/lab1/ex4")
            .then((res) => res.json())
            .then((data: Ex4Response) => {
                setEx4Data(data);
                setLoadingEx4(false);
            });
    }, []);

    return (
        <div className="w-full">
            {/* === TAB NAVIGATION === */}
            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
              py-3 px-6 font-medium text-sm focus:outline-none whitespace-nowrap transition-colors duration-200
              ${
                  activeTab === tab.id
                      ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }
            `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* === CONTENT AREA === */}
            <div className="min-h-[400px]">
                {/* === BÀI 1 === */}
                {activeTab === "ex1" && (
                    <section className="animate-in fade-in duration-300">
                        {loadingEx1 ? (
                            <div className="text-gray-500 text-center py-8">
                                Đang tải dữ liệu EX1...
                            </div>
                        ) : ex1Data ? (
                            <Ex1Display data={ex1Data} loading={loadingEx1} />
                        ) : (
                            <div className="text-red-500 text-center py-8">
                                Không có dữ liệu EX1
                            </div>
                        )}
                    </section>
                )}

                {/* === BÀI 2 === */}
                {activeTab === "ex2" && (
                    <section className="animate-in fade-in duration-300">
                        {loadingEx2 ? (
                            <div className="text-gray-500">
                                Đang tải dữ liệu ...
                            </div>
                        ) : ex2Data ? (
                            <Ex2Display
                                pairs={ex2Data.pairs}
                                sentences={ex2Data.sentences}
                            />
                        ) : (
                            <div className="text-red-500">Không có dữ liệu</div>
                        )}
                    </section>
                )}

                {/* === BÀI 3 === */}
                {activeTab === "ex3" && (
                    <section className="animate-in fade-in duration-300">
                        {loadingEx3 ? (
                            <div className="text-gray-500">
                                Đang tải dữ liệu ...
                            </div>
                        ) : ex3Data ? (
                            <Ex3Display
                                characters={ex3Data.characters}
                                chapters={ex3Data.chapters}
                            />
                        ) : (
                            <div className="text-red-500">Không có dữ liệu</div>
                        )}
                    </section>
                )}

                {/* === BÀI 4 === */}
                {activeTab === "ex4" && (
                    <section className="animate-in fade-in duration-300">
                        {loadingEx4 ? (
                            <div className="text-gray-500">
                                Đang tải dữ liệu ...
                            </div>
                        ) : ex4Data ? (
                            <Ex4Display data={ex4Data} />
                        ) : (
                            <div className="text-red-500">Không có dữ liệu</div>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}
