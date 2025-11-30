//src/client/app/components/lab1/ex4.tsx
"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";

import { Ex4Response, TopPost } from "@/app/api/lab1/ex4/route";

interface Ex4DisplayProps {
    data: Ex4Response;
}

export default function Ex4Display({ data }: Ex4DisplayProps) {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-6">
                <h2 className="text-orange-900 font-bold text-xl mb-2">
                    Lab 2 - Reddit Antiwork Analysis
                </h2>
                <p className="text-orange-800/80 text-sm">
                    Phân tích dữ liệu subreddit r/antiwork: bài viết nổi bật,
                    cảm xúc bình luận và xu hướng theo thời gian.
                </p>
            </div>

            {/* TOP POSTS */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-800">
                        Top Posts (Highest Score)
                    </h3>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-200 rounded text-gray-600">
                        Top 20
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                <th className="p-4 w-16 text-center">#</th>
                                <th className="p-4">Title</th>
                                <th className="p-4 w-32">Subreddit</th>
                                <th className="p-4 w-24 text-right">Score</th>
                                <th className="p-4 w-32 text-right">Month</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {data.topPosts.slice(0, 20).map((p: TopPost, i) => (
                                <tr
                                    key={i}
                                    className="hover:bg-orange-50/30 transition-colors group"
                                >
                                    <td className="p-4 text-center font-mono text-gray-400 text-sm group-hover:text-orange-500 font-medium">
                                        {i + 1}
                                    </td>

                                    {/* Title */}
                                    <td className="p-4">
                                        <div
                                            className="font-medium text-gray-900 line-clamp-2 hover:line-clamp-none transition-all cursor-default"
                                            title={p.title}
                                        >
                                            {p.title}
                                        </div>
                                    </td>

                                    {/* Subreddit */}
                                    <td className="p-4 text-sm text-gray-600">
                                        {p.subreddit_name ?? "antiwork"}
                                    </td>

                                    {/* Score */}
                                    <td className="p-4 text-right">
                                        <span className="font-mono font-bold text-orange-600">
                                            {p.score?.toLocaleString()}
                                        </span>
                                    </td>

                                    {/* Month */}
                                    <td className="p-4 text-right text-sm text-gray-500 font-mono">
                                        {p.month}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* POSITIVE & NEGATIVE COMMENTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Positive */}
                <section className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden flex flex-col h-full">
                    <div className="p-4 bg-green-50 border-b border-green-100">
                        <h3 className="text-lg font-bold text-green-800">
                            Top Positive Comments
                        </h3>
                    </div>

                    <div className="p-4 space-y-4 flex-1 bg-green-50/10">
                        {data.topCommentsHigh.slice(0, 10).map((c, i) => (
                            <div
                                key={i}
                                className="bg-white p-4 rounded-lg border border-green-200 shadow-sm"
                            >
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold uppercase text-green-600">
                                        Sentiment
                                    </span>
                                    <span className="bg-green-100 text-green-800 text-xs font-mono px-2 py-1 rounded">
                                        +{c.sentiment.toFixed(3)}
                                    </span>
                                </div>

                                <p className="text-gray-700 text-sm italic line-clamp-4 hover:line-clamp-none">
                                    &quot;{c.body}&quot;
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Negative */}
                <section className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden flex flex-col h-full">
                    <div className="p-4 bg-red-50 border-b border-red-100">
                        <h3 className="text-lg font-bold text-red-800">
                            Most Negative Comments
                        </h3>
                    </div>

                    <div className="p-4 space-y-4 flex-1 bg-red-50/10">
                        {data.topCommentsLow.slice(0, 10).map((c, i) => (
                            <div
                                key={i}
                                className="bg-white p-4 rounded-lg border border-red-200 shadow-sm"
                            >
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold uppercase text-red-600">
                                        Sentiment
                                    </span>
                                    <span className="bg-red-100 text-red-800 text-xs font-mono px-2 py-1 rounded">
                                        {c.sentiment.toFixed(3)}
                                    </span>
                                </div>

                                <p className="text-gray-700 text-sm italic line-clamp-4 hover:line-clamp-none">
                                    &quot;{c.body}&quot;
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Volume chart */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                        Activity Volume
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Total posts and comments per month
                    </p>

                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.monthlyStats}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#eee"
                                />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="total_posts"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total_comments"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Sentiment chart */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                        Sentiment Trends
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Average sentiment score fluctuation over time
                    </p>

                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.monthlySentiment}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#eee"
                                />
                                <XAxis dataKey="month" />
                                <YAxis domain={[-1, 1]} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="avg_sentiment"
                                    stroke="#9333ea"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </div>
        </div>
    );
}
