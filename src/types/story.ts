export interface StoryData {
    story_narrative: string;
    key_themes: string[];
    notable_quotes: string[];
    historical_context: {
        time_periods: string[];
        events: string[];
        cultural_context: string[];
    };
    follow_up_topics: string[];
} 