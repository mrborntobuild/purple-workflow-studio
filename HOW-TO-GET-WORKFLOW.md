# How to Get Workflow Payload

This guide shows you how to retrieve workflow data from the API and database.

## Methods to Get Workflow Payload

### 1. **Via API Endpoint (Recommended)**

#### GET Single Workflow by ID
```bash
GET /api/workflows/{id}
```

**Example:**
```bash
curl -X GET "http://localhost:3002/api/workflows/123e4567-e89b-12d3-a456-426614174000" \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "workflow": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "My Workflow",
    "nodes": [...],
    "edges": [...],
    "viewState": {
      "x": 0,
      "y": 0,
      "zoom": 1
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### GET All Workflows (List)
```bash
GET /api/workflows?limit=10&offset=0&sortBy=created_at&order=desc
```

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)
- `offset` (optional): Pagination offset (default: 0)
- `sortBy` (optional): Field to sort by (default: "created_at")
- `order` (optional): "asc" or "desc" (default: "desc")

**Response:**
```json
{
  "workflows": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Workflow 1",
      "nodes": [],
      "edges": [],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
```

### 2. **Via n8n Workflow**

#### Using the Get Workflow n8n Workflow

1. **Import** `n8n-workflows/get-workflow-http.json` into n8n
2. **Activate** the workflow
3. **Call** the webhook:
```bash
GET https://your-n8n-instance.com/webhook/get-workflow/{workflow-id}
```

**Example:**
```bash
curl -X GET "https://your-n8n-instance.com/webhook/get-workflow/123e4567-e89b-12d3-a456-426614174000"
```

### 3. **Direct Supabase Query**

#### Using Supabase REST API
```bash
GET https://{project-id}.supabase.co/rest/v1/workflows?id=eq.{workflow-id}&select=*
```

**Headers:**
```
apikey: {your-anon-key}
Authorization: Bearer {your-service-role-key}
```

**Example:**
```bash
curl -X GET \
  "https://vxsjiwlvradiyluppage.supabase.co/rest/v1/workflows?id=eq.123e4567-e89b-12d3-a456-426614174000&select=*" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

**Response (Supabase format):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "My Workflow",
    "nodes": [...],
    "edges": [...],
    "view_state": {...},
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "created_by": null
  }
]
```

### 4. **Using JavaScript/TypeScript (Frontend)**

```typescript
import { apiService } from './services/apiService';

// Get single workflow
const workflow = await apiService.getWorkflow('workflow-id');
console.log(workflow.workflow);

// List all workflows
const workflows = await apiService.listWorkflows();
console.log(workflows.workflows);
```

### 5. **Using SQL (Direct Database)**

```sql
-- Get single workflow
SELECT 
  id,
  name as title,
  nodes,
  edges,
  view_state as "viewState",
  created_at as "createdAt",
  updated_at as "updatedAt"
FROM workflows
WHERE id = '123e4567-e89b-12d3-a456-426614174000';

-- List all workflows
SELECT 
  id,
  name as title,
  nodes,
  edges,
  view_state as "viewState",
  created_at as "createdAt",
  updated_at as "updatedAt"
FROM workflows
ORDER BY created_at DESC
LIMIT 10;
```

## Field Mapping

**Database → API:**
- `name` → `title`
- `view_state` → `viewState`
- `created_at` → `createdAt`
- `updated_at` → `updatedAt`

## Common Use Cases

### Get workflow for editing
```bash
GET /api/workflows/{id}
```

### Get workflow list for dashboard
```bash
GET /api/workflows?limit=20&sortBy=updated_at&order=desc
```

### Search workflows by name
```sql
SELECT * FROM workflows 
WHERE name ILIKE '%search-term%'
ORDER BY updated_at DESC;
```

### Get recent workflows
```bash
GET /api/workflows?limit=5&sortBy=updated_at&order=desc
```

## Error Handling

**404 Not Found:**
```json
{
  "error": "Workflow not found"
}
```

**400 Bad Request:**
```json
{
  "error": "Invalid workflow ID format"
}
```

## Notes

- The database stores `name` but the API returns `title` (mapped in n8n)
- `nodes` and `edges` are JSONB arrays
- `view_state` is optional and can be null
- `created_by` is nullable (for MVP)

