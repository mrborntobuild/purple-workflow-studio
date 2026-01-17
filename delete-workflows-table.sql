-- SQL to delete the workflows table from the wrong database
-- Run this in your Supabase SQL Editor

-- Drop the trigger first
DROP TRIGGER IF EXISTS update_workflows_updated_at ON workflows;

-- Drop the function
DROP FUNCTION IF EXISTS update_workflows_updated_at();

-- Drop the table (this will also drop indexes automatically)
DROP TABLE IF EXISTS workflows;

