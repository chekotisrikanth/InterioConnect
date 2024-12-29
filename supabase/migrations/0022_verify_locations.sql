-- Verify locations table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_name = 'locations';

-- Check RLS policies
SELECT
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM
    pg_policies
WHERE
    tablename = 'locations';

-- Check location data counts by type
SELECT
    type,
    COUNT(*) as count
FROM
    locations
GROUP BY
    type
ORDER BY
    type;

-- Sample data from each type
WITH samples AS (
    SELECT
        *,
        ROW_NUMBER() OVER (PARTITION BY type ORDER BY name) as rn
    FROM
        locations
)
SELECT
    id,
    name,
    type,
    parent_id
FROM
    samples
WHERE
    rn <= 2;

-- Check parent-child relationships
WITH RECURSIVE location_tree AS (
    -- Base case: get all countries (top level)
    SELECT
        id,
        name,
        type,
        parent_id,
        1 as level,
        name as path
    FROM
        locations
    WHERE
        type = 'country'
    
    UNION ALL
    
    -- Recursive case: get children
    SELECT
        l.id,
        l.name,
        l.type,
        l.parent_id,
        lt.level + 1,
        lt.path || ' > ' || l.name
    FROM
        locations l
        INNER JOIN location_tree lt ON l.parent_id = lt.id
)
SELECT
    level,
    type,
    path
FROM
    location_tree
ORDER BY
    path;
