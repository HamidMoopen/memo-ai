-- Stories table with enhanced metadata
CREATE TABLE IF NOT EXISTS story_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    call_id TEXT REFERENCES calls(call_id),
    title TEXT,
    content TEXT,
    time_period TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    story_type TEXT, -- e.g., 'childhood', 'career', 'family', 'milestone'
    life_stage TEXT  -- e.g., 'childhood', 'teenage', 'adult', 'recent'
);

-- People mentioned in stories
CREATE TABLE IF NOT EXISTS story_people (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    story_id UUID REFERENCES story_entries(id),
    name TEXT,
    relationship TEXT,
    role_in_story TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emotional markers within stories
CREATE TABLE IF NOT EXISTS story_emotions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    story_id UUID REFERENCES story_entries(id),
    emotion TEXT,
    intensity INTEGER CHECK (intensity BETWEEN 1 AND 10),
    context TEXT,
    timestamp_in_call TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Story themes and tags
CREATE TABLE IF NOT EXISTS story_themes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    story_id UUID REFERENCES story_entries(id),
    theme TEXT,
    confidence FLOAT CHECK (confidence BETWEEN 0 AND 1),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Story segments (for breaking down longer stories)
CREATE TABLE IF NOT EXISTS story_segments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    story_id UUID REFERENCES story_entries(id),
    segment_order INTEGER,
    content TEXT,
    speaker TEXT,
    timestamp_start TEXT,
    timestamp_end TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Story artifacts (links to photos, documents, etc.)
CREATE TABLE IF NOT EXISTS story_artifacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    story_id UUID REFERENCES story_entries(id),
    artifact_type TEXT, -- e.g., 'photo', 'document', 'audio'
    url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_story_entries_call_id ON story_entries(call_id);
CREATE INDEX idx_story_entries_time_period ON story_entries(time_period);
CREATE INDEX idx_story_entries_story_type ON story_entries(story_type);
CREATE INDEX idx_story_entries_life_stage ON story_entries(life_stage);
CREATE INDEX idx_story_people_story_id ON story_people(story_id);
CREATE INDEX idx_story_emotions_story_id ON story_emotions(story_id);
CREATE INDEX idx_story_themes_story_id ON story_themes(story_id);
CREATE INDEX idx_story_segments_story_id ON story_segments(story_id);

-- Add functions for easier story management
CREATE OR REPLACE FUNCTION update_story_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically update updated_at
CREATE TRIGGER trigger_update_story_timestamp
    BEFORE UPDATE ON story_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_story_updated_at(); 