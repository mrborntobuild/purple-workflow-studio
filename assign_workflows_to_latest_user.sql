-- 1. Get the ID of the most recently created user
WITH latest_user AS (
  SELECT id 
  FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 1
)

-- 2. Update all workflows to belong to that user
-- Note: Using 'created_by' based on actual schema inspection
UPDATE public.workflows
SET created_by = (SELECT id FROM latest_user)
WHERE created_by IS NULL OR created_by != (SELECT id FROM latest_user);
