-- Enable RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to locations
CREATE POLICY "Allow public read access to locations"
ON locations
FOR SELECT
TO public
USING (true);
