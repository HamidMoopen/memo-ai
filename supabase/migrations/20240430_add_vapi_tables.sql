-- Create calls table
CREATE TABLE IF NOT EXISTS calls (
    call_id TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'in_progress',
    summary JSONB,
    final_transcript TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Create transcripts table for real-time updates
CREATE TABLE IF NOT EXISTS transcripts (
    id BIGSERIAL PRIMARY KEY,
    call_id TEXT REFERENCES calls(call_id),
    transcript TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create memory_contexts table
CREATE TABLE IF NOT EXISTS memory_contexts (
    id BIGSERIAL PRIMARY KEY,
    call_id TEXT REFERENCES calls(call_id),
    time_period TEXT NOT NULL,
    location TEXT NOT NULL,
    people_involved TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create emotional_moments table
CREATE TABLE IF NOT EXISTS emotional_moments (
    id BIGSERIAL PRIMARY KEY,
    call_id TEXT REFERENCES calls(call_id),
    emotion TEXT NOT NULL,
    intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
    context TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);
CREATE INDEX IF NOT EXISTS idx_transcripts_call_id ON transcripts(call_id);
CREATE INDEX IF NOT EXISTS idx_memory_contexts_call_id ON memory_contexts(call_id);
CREATE INDEX IF NOT EXISTS idx_emotional_moments_call_id ON emotional_moments(call_id); 