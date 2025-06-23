-- AgriShield Database Schema
-- This file contains the complete database schema for the AgriShield application
-- Run this in your Supabase SQL editor to set up the database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE detection_type AS ENUM ('pest', 'disease');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE severity_level AS ENUM ('Low', 'Medium', 'High');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE treatment_type AS ENUM ('organic', 'chemical', 'biological');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_type AS ENUM ('video', 'pdf', 'article');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE achievement_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    farm_name TEXT,
    farm_size DECIMAL,
    farm_size_unit TEXT DEFAULT 'hectares',
    location TEXT,
    primary_crops TEXT[] DEFAULT '{}',
    experience_level TEXT DEFAULT 'beginner',
    preferred_language TEXT DEFAULT 'en',
    preferred_units TEXT DEFAULT 'metric',
    notifications_enabled BOOLEAN DEFAULT true,
    theme_preference TEXT DEFAULT 'auto',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Detections table
CREATE TABLE IF NOT EXISTS detections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_path TEXT,
    detection_type detection_type NOT NULL,
    crop_type TEXT NOT NULL,
    result_data JSONB NOT NULL,
    confidence_score DECIMAL NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
    severity_level severity_level NOT NULL,
    location_data JSONB,
    weather_data JSONB,
    treatment_applied BOOLEAN DEFAULT false,
    treatment_data JSONB,
    notes TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Treatments table
CREATE TABLE IF NOT EXISTS treatments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    type treatment_type NOT NULL,
    description TEXT NOT NULL,
    active_ingredients TEXT[],
    concentration_range JSONB,
    cost_per_liter DECIMAL,
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    safety_rating INTEGER CHECK (safety_rating >= 1 AND safety_rating <= 5),
    organic_certified BOOLEAN DEFAULT false,
    preharvest_interval TEXT,
    application_method TEXT[],
    target_pests TEXT[],
    target_diseases TEXT[],
    mixing_instructions TEXT,
    safety_notes TEXT,
    storage_requirements TEXT,
    shelf_life TEXT,
    supplier_info JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    rarity achievement_rarity NOT NULL,
    icon TEXT,
    requirements JSONB NOT NULL,
    reward_points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    progress DECIMAL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Educational content table
CREATE TABLE IF NOT EXISTS educational_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content_type content_type NOT NULL,
    category TEXT NOT NULL,
    difficulty_level TEXT NOT NULL,
    duration_minutes INTEGER,
    thumbnail_url TEXT,
    content_url TEXT NOT NULL,
    downloadable BOOLEAN DEFAULT false,
    languages TEXT[] NOT NULL DEFAULT '{"en"}',
    tags TEXT[],
    author TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User content progress table
CREATE TABLE IF NOT EXISTS user_content_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES educational_content(id) ON DELETE CASCADE,
    progress_percentage DECIMAL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completed BOOLEAN DEFAULT false,
    last_accessed TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, content_id)
);

-- Farm analytics table
CREATE TABLE IF NOT EXISTS farm_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_scans INTEGER DEFAULT 0,
    pest_detections INTEGER DEFAULT 0,
    disease_detections INTEGER DEFAULT 0,
    high_severity_count INTEGER DEFAULT 0,
    medium_severity_count INTEGER DEFAULT 0,
    low_severity_count INTEGER DEFAULT 0,
    treatments_applied INTEGER DEFAULT 0,
    cost_spent DECIMAL,
    weather_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_detections_user_id ON detections(user_id);
CREATE INDEX IF NOT EXISTS idx_detections_created_at ON detections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_detections_type ON detections(detection_type);
CREATE INDEX IF NOT EXISTS idx_detections_severity ON detections(severity_level);
CREATE INDEX IF NOT EXISTS idx_detections_public ON detections(is_public) WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_completed ON user_achievements(completed) WHERE completed = true;

CREATE INDEX IF NOT EXISTS idx_user_content_progress_user_id ON user_content_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_educational_content_category ON educational_content(category);
CREATE INDEX IF NOT EXISTS idx_educational_content_type ON educational_content(content_type);

CREATE INDEX IF NOT EXISTS idx_farm_analytics_user_date ON farm_analytics(user_id, date);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_content_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view own detections" ON detections;
DROP POLICY IF EXISTS "Users can view public detections" ON detections;
DROP POLICY IF EXISTS "Users can insert own detections" ON detections;
DROP POLICY IF EXISTS "Users can update own detections" ON detections;
DROP POLICY IF EXISTS "Users can delete own detections" ON detections;

DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can update own achievements" ON user_achievements;

DROP POLICY IF EXISTS "Users can view own content progress" ON user_content_progress;
DROP POLICY IF EXISTS "Users can insert own content progress" ON user_content_progress;
DROP POLICY IF EXISTS "Users can update own content progress" ON user_content_progress;

DROP POLICY IF EXISTS "Users can view own analytics" ON farm_analytics;
DROP POLICY IF EXISTS "Users can insert own analytics" ON farm_analytics;
DROP POLICY IF EXISTS "Users can update own analytics" ON farm_analytics;

DROP POLICY IF EXISTS "Anyone can view treatments" ON treatments;
DROP POLICY IF EXISTS "Anyone can view achievements" ON achievements;
DROP POLICY IF EXISTS "Anyone can view educational content" ON educational_content;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for detections
CREATE POLICY "Users can view own detections" ON detections
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public detections" ON detections
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert own detections" ON detections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own detections" ON detections
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own detections" ON detections
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements" ON user_achievements
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_content_progress
CREATE POLICY "Users can view own content progress" ON user_content_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content progress" ON user_content_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own content progress" ON user_content_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for farm_analytics
CREATE POLICY "Users can view own analytics" ON farm_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON farm_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics" ON farm_analytics
    FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for reference tables
CREATE POLICY "Anyone can view treatments" ON treatments
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view achievements" ON achievements
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view educational content" ON educational_content
    FOR SELECT USING (true);

-- Create storage buckets (only if they don't exist)
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('detection-images', 'detection-images', true),
    ('avatars', 'avatars', true),
    ('educational-content', 'educational-content', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload detection images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view detection images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own detection images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatars" ON storage.objects;

-- Storage policies
CREATE POLICY "Users can upload detection images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'detection-images' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view detection images" ON storage.objects
    FOR SELECT USING (bucket_id = 'detection-images');

CREATE POLICY "Users can delete own detection images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'detection-images' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can upload avatars" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Anyone can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatars" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers to avoid conflicts
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_detections_updated_at ON detections;
DROP TRIGGER IF EXISTS update_treatments_updated_at ON treatments;
DROP TRIGGER IF EXISTS update_user_achievements_updated_at ON user_achievements;
DROP TRIGGER IF EXISTS update_educational_content_updated_at ON educational_content;
DROP TRIGGER IF EXISTS update_user_content_progress_updated_at ON user_content_progress;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_detections_updated_at BEFORE UPDATE ON detections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatments_updated_at BEFORE UPDATE ON treatments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_achievements_updated_at BEFORE UPDATE ON user_achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_educational_content_updated_at BEFORE UPDATE ON educational_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_content_progress_updated_at BEFORE UPDATE ON user_content_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample achievements
INSERT INTO achievements (id, name, description, category, rarity, requirements, reward_points) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'First Steps', 'Complete your first crop scan', 'scanning', 'common', '{"scans": 1}', 10),
    ('550e8400-e29b-41d4-a716-446655440002', 'Scan Master', 'Complete 10 successful scans', 'scanning', 'rare', '{"scans": 10}', 50),
    ('550e8400-e29b-41d4-a716-446655440003', 'Detection Expert', 'Complete 50 crop analyses', 'scanning', 'epic', '{"scans": 50}', 200),
    ('550e8400-e29b-41d4-a716-446655440004', 'Pest Hunter', 'Detect 20 different pest types', 'scanning', 'rare', '{"pest_types": 20}', 100),
    ('550e8400-e29b-41d4-a716-446655440005', 'Disease Detective', 'Identify 15 plant diseases', 'scanning', 'rare', '{"disease_types": 15}', 100),
    ('550e8400-e29b-41d4-a716-446655440006', 'Learning Enthusiast', 'Complete 5 educational modules', 'learning', 'common', '{"modules": 5}', 25),
    ('550e8400-e29b-41d4-a716-446655440007', 'Knowledge Seeker', 'Complete 10 educational modules', 'learning', 'epic', '{"modules": 10}', 150),
    ('550e8400-e29b-41d4-a716-446655440008', 'Streak Warrior', 'Use the app for 7 consecutive days', 'streak', 'rare', '{"consecutive_days": 7}', 75),
    ('550e8400-e29b-41d4-a716-446655440009', 'Consistency Champion', 'Maintain a 30-day usage streak', 'streak', 'epic', '{"consecutive_days": 30}', 300),
    ('550e8400-e29b-41d4-a716-446655440010', 'Farming Legend', 'Complete 100 scans and maintain 30-day streak', 'milestone', 'legendary', '{"scans": 100, "consecutive_days": 30}', 500)
ON CONFLICT (id) DO NOTHING;

-- Insert sample treatments
INSERT INTO treatments (name, type, description, organic_certified, cost_per_liter, effectiveness_rating, safety_rating) VALUES
    ('Neem Oil', 'organic', 'Natural pesticide and fungicide derived from neem tree', true, 15.50, 4, 5),
    ('Copper Fungicide', 'organic', 'Broad-spectrum fungicide for bacterial and fungal diseases', true, 22.00, 4, 4),
    ('Insecticidal Soap', 'organic', 'Gentle, non-toxic insecticide safe for beneficial insects', true, 12.75, 3, 5),
    ('Spinosad', 'biological', 'Biological insecticide derived from soil bacteria', true, 45.00, 4, 4),
    ('Bacillus thuringiensis', 'biological', 'Biological insecticide targeting caterpillars and larvae', true, 28.50, 4, 5)
ON CONFLICT (name) DO NOTHING;

-- Insert sample educational content
INSERT INTO educational_content (title, description, content_type, category, difficulty_level, duration_minutes, content_url, downloadable, languages) VALUES
    ('Organic Pest Management Fundamentals', 'Learn the basics of organic pest control methods that are safe for your crops and the environment.', 'video', 'Pest Management', 'beginner', 20, 'https://example.com/video1', true, '{"en", "hi"}'),
    ('Disease Prevention in Vegetable Crops', 'Comprehensive guide on preventing common diseases in tomatoes, peppers, and other vegetables.', 'pdf', 'Disease Prevention', 'intermediate', null, 'https://example.com/guide1.pdf', true, '{"en", "hi", "mr"}'),
    ('Seasonal Crop Care Calendar', 'Month-by-month guide for crop care activities throughout the farming season.', 'pdf', 'Seasonal Care', 'beginner', null, 'https://example.com/calendar.pdf', true, '{"en", "hi"}'),
    ('Integrated Pest Management Strategies', 'Advanced IPM techniques for sustainable pest control.', 'video', 'Pest Management', 'advanced', 15, 'https://example.com/video2', true, '{"en"}'),
    ('Soil Health and Nutrition Management', 'Understanding soil health indicators and maintaining optimal nutrition.', 'video', 'Organic Farming', 'intermediate', 25, 'https://example.com/video3', true, '{"en", "hi"}')
ON CONFLICT (title) DO NOTHING;

-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;