-- LoveLink '89 Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Profiles Table
CREATE TABLE profiles (
  profile_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  birthday DATE,
  favorite_food VARCHAR(255),
  favorite_movie VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hobbies Table
CREATE TABLE hobbies (
  hobby_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(profile_id) ON DELETE CASCADE,
  hobby_name VARCHAR(255) NOT NULL
);

-- Relationships Table
CREATE TABLE relationships (
  relationship_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  partner_id UUID REFERENCES profiles(profile_id) ON DELETE CASCADE,
  anniversary DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DatePlans Table
CREATE TABLE date_plans (
  date_plan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'planned',
  location VARCHAR(255),
  budget VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities Table
CREATE TABLE activities (
  activity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  image_url TEXT,
  type VARCHAR(100),
  description TEXT,
  price_range VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ActivityTags Table
CREATE TABLE activity_tags (
  tag_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID REFERENCES activities(activity_id) ON DELETE CASCADE,
  tag_name VARCHAR(100) NOT NULL
);

-- Restaurants Table
CREATE TABLE restaurants (
  restaurant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  image_url TEXT,
  cuisine VARCHAR(100),
  rating DECIMAL(3, 1),
  price_range VARCHAR(50),
  location VARCHAR(255),
  distance VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RestaurantTags Table
CREATE TABLE restaurant_tags (
  tag_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
  tag_name VARCHAR(100) NOT NULL
);

-- DatePlanDetails Table
CREATE TABLE date_plan_details (
  detail_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date_plan_id UUID REFERENCES date_plans(date_plan_id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(restaurant_id) ON DELETE SET NULL,
  activity_id UUID REFERENCES activities(activity_id) ON DELETE SET NULL,
  detail_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- UserPreferences Table
CREATE TABLE user_preferences (
  preference_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  dietary_needs JSONB DEFAULT '[]'::JSONB,
  transit_preferences JSONB DEFAULT '[]'::JSONB,
  budget_preference VARCHAR(50) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DateHistory Table
CREATE TABLE date_history (
  history_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date_plan_id UUID REFERENCES date_plans(date_plan_id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  rating INTEGER,
  notes TEXT,
  photos JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LocalEvents Table
CREATE TABLE local_events (
  event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  event_date DATE,
  event_time TIME,
  price VARCHAR(100),
  image_url TEXT,
  external_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE notifications (
  notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_plan_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (examples)
CREATE POLICY "Users can view their own data" ON users FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own profiles" ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Note: Additional policies should be created for each table as needed
