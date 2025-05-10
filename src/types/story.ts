export type LifeChapter =
    | 'early_childhood'
    | 'childhood'
    | 'teenage_years'
    | 'young_adult'
    | 'college'
    | 'early_career'
    | 'career_growth'
    | 'family_life'
    | 'mid_life'
    | 'late_career'
    | 'retirement'
    | 'legacy';

export interface ChapterMetadata {
    time_period: string;
    key_events: string[];
    locations: string[];
    people: string[];
    emotions: string[];
    lessons_learned: string[];
}

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
    life_chapter?: LifeChapter;
    chapter_metadata?: ChapterMetadata;
}

export const CHAPTER_LABELS: Record<LifeChapter, string> = {
    early_childhood: 'Early Childhood (0-5)',
    childhood: 'Childhood (6-12)',
    teenage_years: 'Teenage Years (13-19)',
    young_adult: 'Young Adult (20-25)',
    college: 'College Years',
    early_career: 'Early Career',
    career_growth: 'Career Growth',
    family_life: 'Family Life',
    mid_life: 'Mid-Life',
    late_career: 'Late Career',
    retirement: 'Retirement',
    legacy: 'Legacy'
};

export const CHAPTER_DESCRIPTIONS: Record<LifeChapter, string> = {
    early_childhood: 'First memories, family dynamics, and early development',
    childhood: 'School years, friendships, and growing independence',
    teenage_years: 'High school, adolescence, and identity formation',
    young_adult: 'Independence, self-discovery, and early relationships',
    college: 'Higher education, major life decisions, and personal growth',
    early_career: 'First jobs, career beginnings, and professional development',
    career_growth: 'Professional achievements, leadership, and work-life balance',
    family_life: 'Marriage, parenthood, and family relationships',
    mid_life: 'Life evaluation, personal growth, and changing priorities',
    late_career: 'Career mastery, mentoring, and transition planning',
    retirement: 'Life after work, hobbies, and new adventures',
    legacy: 'Reflection, wisdom sharing, and life lessons'
}; 