# n8n Workflow API Configurations

This directory contains n8n workflow JSON configurations for the Workflow Management APIs.

## Setup Instructions

### 1. Import Workflows into n8n

1. Open your n8n instance
2. Click "Workflows" → "Import from File"
3. Import each JSON file:
   - `create-workflow.json`
   - `update-workflow.json`
   - `get-workflow.json`
   - `list-workflows.json`
   - `delete-workflow.json`

### 2. Configure Supabase Credentials

For each workflow, you need to set up Supabase credentials:

1. In each workflow, click on the Supabase node
2. Click "Create New Credential" or select existing
3. Enter your Supabase credentials:
   - **Host**: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
   - **Service Role Secret**: Your Supabase service role key (from Supabase Dashboard → Settings → API)

### 3. Activate Webhooks

1. For each workflow, click the "Active" toggle in the top right
2. Copy the webhook URLs that n8n generates
3. Update your frontend `apiService.ts` base URL to point to your n8n instance

## API Endpoints

### POST /workflows
**File**: `create-workflow.json`
- Creates a new workflow
- Returns the created workflow with ID and timestamps

### PUT /workflows/:id
**File**: `update-workflow.json`
- Updates an existing workflow
- Returns the updated workflow

### GET /workflows/:id
**File**: `get-workflow.json`
- Retrieves a single workflow by ID
- Returns 404 if not found

### GET /workflows
**File**: `list-workflows.json`
- Lists all workflows
- Supports query parameters: `limit`, `offset`, `sortBy`, `order`
- Returns array of workflows with total count

### DELETE /workflows/:id
**File**: `delete-workflow.json`
- Deletes a workflow by ID
- Returns 204 on success, 404 if not found

## Webhook URLs

After activating workflows, n8n will provide webhook URLs like:
- `https://your-n8n-instance.com/webhook/create-workflow`
- `https://your-n8n-instance.com/webhook/update-workflow`
- `https://your-n8n-instance.com/webhook/get-workflow`
- `https://your-n8n-instance.com/webhook/list-workflows`
- `https://your-n8n-instance.com/webhook/delete-workflow`

## Alternative: Using HTTP Request Nodes

If you don't have the Supabase node installed, you can replace Supabase nodes with HTTP Request nodes:

### Example HTTP Request Configuration for Create:

```json
{
  "parameters": {
    "method": "POST",
    "url": "https://YOUR_PROJECT.supabase.co/rest/v1/workflows",
    "authentication": "genericCredentialType",
    "genericAuthType": "httpHeaderAuth",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "apikey",
          "value": "YOUR_SUPABASE_ANON_KEY"
        },
        {
          "name": "Authorization",
          "value": "Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY"
        },
        {
          "name": "Content-Type",
          "value": "application/json"
        },
        {
          "name": "Prefer",
          "value": "return=representation"
        }
      ]
    },
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        {
          "name": "title",
          "value": "={{ $json.body.title }}"
        },
        {
          "name": "nodes",
          "value": "={{ $json.body.nodes }}"
        },
        {
          "name": "edges",
          "value": "={{ $json.body.edges }}"
        },
        {
          "name": "view_state",
          "value": "={{ $json.body.viewState }}"
        }
      ]
    },
    "options": {}
  }
}
```

## Testing

You can test each endpoint using curl:

```bash
# Create workflow
curl -X POST https://your-n8n-instance.com/webhook/create-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Workflow",
    "nodes": [],
    "edges": []
  }'

# List workflows
curl https://your-n8n-instance.com/webhook/list-workflows

# Get workflow
curl https://your-n8n-instance.com/webhook/get-workflow/YOUR_WORKFLOW_ID

# Update workflow
curl -X PUT https://your-n8n-instance.com/webhook/update-workflow/YOUR_WORKFLOW_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "nodes": [],
    "edges": []
  }'

# Delete workflow
curl -X DELETE https://your-n8n-instance.com/webhook/delete-workflow/YOUR_WORKFLOW_ID
```

## Notes

- All workflows use Row Level Security (RLS) - ensure your Supabase credentials have proper permissions
- The `updated_at` timestamp is automatically updated by the database trigger
- JSONB fields (`nodes`, `edges`, `view_state`) are stored as-is from the request body
- Error handling is included for missing IDs and validation

