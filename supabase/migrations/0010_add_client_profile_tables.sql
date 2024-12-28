-- Create enum types for status and notifications
CREATE TYPE requirement_status AS ENUM ('open', 'in_progress', 'closed');
CREATE TYPE chat_status AS ENUM ('active', 'archived');
CREATE TYPE notification_type AS ENUM ('message', 'response', 'update', 'system');

-- Create client_profiles table
CREATE TABLE client_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    preferred_styles designer_style[] DEFAULT '{}',
    preferred_budget_range INT4RANGE,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create requirements table
CREATE TABLE requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES client_profiles(id) NOT NULL,
    title TEXT NOT NULL,
    room_type room_type NOT NULL,
    preferred_style designer_style NOT NULL,
    budget_range INT4RANGE NOT NULL,
    description TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    location TEXT,
    timeline_start DATE,
    timeline_end DATE,
    status requirement_status DEFAULT 'open',
    visibility BOOLEAN DEFAULT true, -- true = visible to all designers
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create designer_responses table for responses to requirements
CREATE TABLE designer_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requirement_id UUID REFERENCES requirements(id) NOT NULL,
    designer_id UUID REFERENCES designer_profiles(id) NOT NULL,
    proposal TEXT NOT NULL,
    estimated_cost INTEGER,
    estimated_timeline INTEGER, -- in days
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create client_designer_chats table
CREATE TABLE client_designer_chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES client_profiles(id) NOT NULL,
    designer_id UUID REFERENCES designer_profiles(id) NOT NULL,
    requirement_id UUID REFERENCES requirements(id),
    status chat_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create chat_messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES client_designer_chats(id) NOT NULL,
    sender_id UUID NOT NULL, -- can be either client_id or designer_id
    content TEXT NOT NULL,
    attachments TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create client_notifications table
CREATE TABLE client_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES client_profiles(id) NOT NULL,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    related_entity_id UUID, -- can reference requirements, chats, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create bookmarked_designers table
CREATE TABLE bookmarked_designers (
    client_id UUID REFERENCES client_profiles(id) NOT NULL,
    designer_id UUID REFERENCES designer_profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (client_id, designer_id)
);

-- Create hired_designers table for tracking active collaborations
CREATE TABLE hired_designers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES client_profiles(id) NOT NULL,
    designer_id UUID REFERENCES designer_profiles(id) NOT NULL,
    requirement_id UUID REFERENCES requirements(id) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE designer_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_designer_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarked_designers ENABLE ROW LEVEL SECURITY;
ALTER TABLE hired_designers ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (these should be refined based on specific access requirements)
CREATE POLICY "Users can view their own profile"
    ON client_profiles FOR ALL
    USING (auth.uid() = id);

CREATE POLICY "Clients can manage their own requirements"
    ON requirements FOR ALL
    USING (auth.uid() = client_id);

CREATE POLICY "Designers can view requirements"
    ON requirements FOR SELECT
    USING (visibility = true);

CREATE POLICY "Designers can create responses to requirements"
    ON designer_responses FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM designer_profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Participants can view their chats"
    ON client_designer_chats FOR SELECT
    USING (auth.uid() = client_id OR auth.uid() = designer_id);

CREATE POLICY "Participants can view chat messages"
    ON chat_messages FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM client_designer_chats
        WHERE id = chat_messages.chat_id
        AND (client_id = auth.uid() OR designer_id = auth.uid())
    ));

CREATE POLICY "Users can view their own notifications"
    ON client_notifications FOR SELECT
    USING (client_id = auth.uid());

CREATE POLICY "Users can manage their bookmarks"
    ON bookmarked_designers FOR ALL
    USING (client_id = auth.uid());

CREATE POLICY "Users can view their hired designers"
    ON hired_designers FOR SELECT
    USING (client_id = auth.uid() OR designer_id = auth.uid());
