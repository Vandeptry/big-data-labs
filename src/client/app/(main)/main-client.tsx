"use client";

import { useState } from "react";
import Lab1Result from "../components/lab1/result";
import Lab3Result from "../components/lab3/Lab3Result";

export default function MainClient() {
    const [tab, setTab] = useState<"lab1" | "lab3">("lab1");

    return (
        <div className="p-6">
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setTab("lab1")}
                    className={`px-4 py-2 rounded ${
                        tab === "lab1"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
                    }`}
                >
                    Lab 1
                </button>

                <button
                    onClick={() => setTab("lab3")}
                    className={`px-4 py-2 rounded ${
                        tab === "lab3"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
                    }`}
                >
                    Lab 3
                </button>
            </div>

            {tab === "lab1" && <Lab1Result />}
            {tab === "lab3" && <Lab3Result />}
        </div>
    );
}
