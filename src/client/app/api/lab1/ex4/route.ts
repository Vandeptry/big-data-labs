//src/client/app/api/lab1/ex4/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface TopPost {
    id: string;
    score: number;
    title: string;
    subreddit_name: string;
    month?: number;
}

interface TopPostRaw {
    id: string;
    score?: number | string;
    title?: string;
    text?: string;
    subreddit_name?: string;
    month?: number | string;
}

export interface CommentSent {
    id: string;
    parent_id: string;
    sentiment: number;
    body: string;
    score: number;
    month?: string;
}

export interface MonthlyStats {
    month: string;
    total_posts: number;
    total_comments: number;
}

export interface MonthlySentiment {
    month: string;
    avg_sentiment: number;
}

export interface Ex4Response {
    topPosts: TopPost[];
    topCommentsHigh: CommentSent[];
    topCommentsLow: CommentSent[];
    monthlyStats: MonthlyStats[];
    monthlySentiment: MonthlySentiment[];
}

function readNdjsonFolder<T>(folderPath: string): T[] {
    if (!fs.existsSync(folderPath)) return [];

    const files = fs
        .readdirSync(folderPath)
        .filter((f) => f.startsWith("part"));
    const rows: T[] = [];

    for (const file of files) {
        const raw = fs.readFileSync(path.join(folderPath, file), "utf8");
        const lines = raw
            .trim()
            .split("\n")
            .map((line) => JSON.parse(line) as T);
        rows.push(...lines);
    }

    return rows;
}

export async function GET() {
    try {
        const baseFolder = path.join(process.cwd(), "public/lab-output/lab1");

        const topPostsRaw = readNdjsonFolder<TopPostRaw>(
            path.join(baseFolder, "ex4_top_posts")
        );

        const topPosts: TopPost[] = topPostsRaw.map((p) => ({
            id: p.id,
            score: Number(p.score) || 0,
            title: p.title ?? p.text ?? "(no title)",
            subreddit_name: p.subreddit_name ?? "antiwork",
            month: Number(p.month) || undefined,
        }));

        return NextResponse.json({
            topPosts,
            topCommentsHigh: readNdjsonFolder<CommentSent>(
                path.join(baseFolder, "ex4_top_comments_high")
            ),
            topCommentsLow: readNdjsonFolder<CommentSent>(
                path.join(baseFolder, "ex4_top_comments_low")
            ),
            monthlyStats: readNdjsonFolder<MonthlyStats>(
                path.join(baseFolder, "ex4_monthly_stats")
            ),
            monthlySentiment: readNdjsonFolder<MonthlySentiment>(
                path.join(baseFolder, "ex4_monthly_sentiment")
            ),
        });
    } catch (err) {
        console.error("EX4 Route Error:", err);
        return NextResponse.json(
            { error: "Cannot load EX4 data" },
            { status: 500 }
        );
    }
}
