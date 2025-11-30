//src/client/app/type.ts
export interface CharacterSentiment {
    character: string;
    avg_sentiment: number;
}

export interface ChapterSentiment {
    character: string;
    chapter_number: number;
    avg_sentiment: number;
}

export interface TopPost {
    id: string;
    score: number;
    title: string;
    subreddit_name: string;
    month?: number;
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
