-- Add designer responses to requirements
INSERT INTO designer_responses (requirement_id, designer_id, proposal, estimated_cost, estimated_timeline)
SELECT 
  r.id as requirement_id,
  d.id as designer_id,
  CASE 
    WHEN d.email = 'designer1@example.com' THEN 'I would love to help create your modern space. My approach would focus on clean lines and smart functionality while maintaining a luxurious feel.'
    WHEN d.email = 'designer2@example.com' THEN 'Your industrial style vision aligns perfectly with my expertise. I can help source authentic materials and create a unique urban atmosphere.'
    WHEN d.email = 'designer3@example.com' THEN 'I can bring a fresh perspective to your traditional kitchen design while maintaining classic elements you love.'
    WHEN d.email = 'designer4@example.com' THEN 'My minimalist approach would work well for your modern bedroom. I can create a zen-like atmosphere with carefully curated pieces.'
    ELSE 'I would be excited to work on this project and bring your vision to life with my unique design perspective.'
  END as proposal,
  CASE 
    WHEN r.room_type = 'Kitchen' THEN 50000
    WHEN r.room_type = 'Living Room' THEN 30000
    WHEN r.room_type = 'Bedroom' THEN 35000
    WHEN r.room_type = 'Office' THEN 20000
    ELSE 15000
  END as estimated_cost,
  CASE 
    WHEN r.room_type = 'Kitchen' THEN 90
    WHEN r.room_type = 'Living Room' THEN 60
    WHEN r.room_type = 'Bedroom' THEN 45
    WHEN r.room_type = 'Office' THEN 30
    ELSE 30
  END as estimated_timeline
FROM requirements r
CROSS JOIN (
  SELECT p.id, p.email 
  FROM profiles p 
  JOIN designer_profiles dp ON p.id = dp.id
  WHERE p.email IN (
    'designer1@example.com',
    'designer2@example.com',
    'designer3@example.com',
    'designer4@example.com'
  )
) d
WHERE r.id IN (
  SELECT id FROM requirements 
  WHERE client_id IN (
    SELECT id FROM client_profiles 
    WHERE email IN (
      'emma.wilson@example.com',
      'david.garcia@example.com',
      'sarah.johnson@example.com'
    )
  )
);

-- Create chats between clients and designers who responded
INSERT INTO client_designer_chats (client_id, designer_id, requirement_id)
SELECT DISTINCT
  r.client_id,
  dr.designer_id,
  r.id as requirement_id
FROM designer_responses dr
JOIN requirements r ON dr.requirement_id = r.id;

-- Add some chat messages
INSERT INTO chat_messages (chat_id, sender_id, content)
SELECT 
  c.id as chat_id,
  CASE WHEN random() > 0.5 THEN c.client_id ELSE c.designer_id END as sender_id,
  CASE 
    WHEN random() > 0.5 THEN 'Thanks for your response! I''d love to discuss the project further.'
    ELSE 'I appreciate your interest in the project. Let me know if you have any questions about my proposal.'
  END as content
FROM client_designer_chats c;

-- Add some follow-up messages
INSERT INTO chat_messages (chat_id, sender_id, content)
SELECT 
  c.id as chat_id,
  CASE WHEN random() > 0.5 THEN c.client_id ELSE c.designer_id END as sender_id,
  CASE 
    WHEN random() > 0.5 THEN 'Could we schedule a call to discuss the details?'
    ELSE 'I''d be happy to walk you through my design process and timeline.'
  END as content
FROM client_designer_chats c;

-- Hire some designers (create active collaborations)
INSERT INTO hired_designers (client_id, designer_id, requirement_id, status, start_date, end_date)
SELECT 
  r.client_id,
  dr.designer_id,
  r.id as requirement_id,
  CASE WHEN random() > 0.7 THEN 'completed' ELSE 'active' END as status,
  r.timeline_start as start_date,
  CASE WHEN random() > 0.7 THEN r.timeline_end ELSE NULL END as end_date
FROM requirements r
JOIN designer_responses dr ON r.id = dr.requirement_id
WHERE random() > 0.5;

-- Update requirement status based on hired designers
UPDATE requirements r
SET status = 'in_progress'
WHERE id IN (
  SELECT requirement_id 
  FROM hired_designers 
  WHERE status = 'active'
);

UPDATE requirements r
SET status = 'closed'
WHERE id IN (
  SELECT requirement_id 
  FROM hired_designers 
  WHERE status = 'completed'
);

-- Add notifications
INSERT INTO client_notifications (client_id, type, title, message, related_entity_id)
SELECT 
  dr.client_id,
  'response'::notification_type as type,
  'New Response to Your Requirement',
  'A designer has responded to your requirement: ' || r.title,
  r.id as related_entity_id
FROM (
  SELECT r.id, r.title, r.client_id, dr.id as response_id
  FROM requirements r
  JOIN designer_responses dr ON r.id = dr.requirement_id
) dr
JOIN requirements r ON dr.id = r.id;

-- Add message notifications
INSERT INTO client_notifications (client_id, type, title, message, related_entity_id)
SELECT DISTINCT
  CASE 
    WHEN cm.sender_id = c.designer_id THEN c.client_id
    ELSE c.designer_id
  END as client_id,
  'message'::notification_type as type,
  'New Message',
  'You have a new message in your chat',
  c.id as related_entity_id
FROM chat_messages cm
JOIN client_designer_chats c ON cm.chat_id = c.id;

-- Add some system notifications
INSERT INTO client_notifications (client_id, type, title, message)
SELECT 
  id as client_id,
  'system'::notification_type as type,
  'Welcome to Interior Design Platform',
  'Welcome! Start by browsing designers or posting your first requirement.'
FROM client_profiles;
