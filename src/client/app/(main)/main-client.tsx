"use client";

import { useState } from "react";
import Lab1Result from "../components/lab1/result";
import Lab3Result from "../components/lab3/Lab3Result";
import Lab4Result from "../components/lab4/Lab4Result";

export default function MainClient() {
    const [tab, setTab] = useState<"lab1" | "lab3" | "lab4">("lab1");

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard Big Data Labs</h1>

            <div className="flex gap-4 mb-6 border-b pb-4">
                <button
                    onClick={() => setTab("lab1")}
                    className={`px-4 py-2 rounded transition-colors ${
                        tab === "lab1"
                            ? "bg-blue-600 text-white shadow"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                >
                    Lab 1 (Word Count)
                </button>

                <button
                    onClick={() => setTab("lab3")}
                    className={`px-4 py-2 rounded transition-colors ${
                        tab === "lab3"
                            ? "bg-blue-600 text-white shadow"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                >
                    Lab 3 (Sales Analysis)
                </button>

                <button
                    onClick={() => setTab("lab4")}
                    className={`px-4 py-2 rounded transition-colors ${
                        tab === "lab4"
                            ? "bg-blue-600 text-white shadow"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                >
                    Lab 4 (Mail Classifier)
                </button>
            </div>

            <div className="mt-4">
                {tab === "lab1" && <Lab1Result />}
                {tab === "lab3" && <Lab3Result />}
                {tab === "lab4" && <Lab4Result />}
            </div>
        </div>
    );
}
