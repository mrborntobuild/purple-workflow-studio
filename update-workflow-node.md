# Update Workflow Node Configuration

## n8n Node Configuration

### HTTP Request Node - Update Workflow

**Method:** `PATCH`  
**URL:** `https://{{ $env.SUPABASE_PROJECT_ID }}.supabase.co/rest/v1/workflows?id=eq.{{ $json.params.id }}`

**Headers:**
```
apikey: {{ $env.SUPABASE_ANON_KEY }}
Authorization: Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}
Content-Type: application/json
Prefer: return=representation
```

**Body (JSON):**
```json
={{
  "name": $json.body.title,
  "nodes": $json.body.nodes,
  "edges": $json.body.edges,
  "view_state": $json.body.viewState
}}
```

**Note:** The database uses `name` but the API accepts `title`, so we map `title` → `name` in the body.

## Complete Update Workflow Structure

### 1. Webhook Node
- **Type:** Webhook
- **Method:** PUT
- **Path:** `workflows/:id`
- **Response Mode:** responseNode

### 2. HTTP Request Node
- **Type:** HTTP Request
- **Method:** PATCH
- **URL:** `https://{{ $env.SUPABASE_PROJECT_ID }}.supabase.co/rest/v1/workflows?id=eq.{{ $json.params.id }}`
- **Body:** Maps API `title` to database `name`

### 3. Transform Response Node
- **Type:** Code (JavaScript)
- **Code:** Transforms Supabase response (with `name`) back to API format (with `title`)

### 4. IF Node
- **Type:** IF
- **Condition:** Check if error exists

### 5. Respond Nodes
- **Success:** Returns 200 with workflow data
- **Error:** Returns 404 with error message

## Payload Examples

### Request Payload (to n8n webhook)

**PUT** `/api/workflows/{id}`

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Updated Workflow Title",
  "nodes": [
    {
      "id": "node-1",
      "type": "text",
      "position": {
        "x": 150,
        "y": 150
      },
      "data": {
        "label": "Updated Text Input",
        "content": "Updated content here",
        "status": "idle"
      }
    },
    {
      "id": "node-2",
      "type": "flux_dev",
      "position": {
        "x": 450,
        "y": 150
      },
      "data": {
        "label": "Flux Dev",
        "status": "idle",
        "panelSettings": {
          "prompt": "Updated prompt",
          "aspectRatio": "1:1",
          "numInferenceSteps": "30",
          "guidanceScale": "3.5"
        }
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "sourcePortIndex": 0,
      "target": "node-2",
      "targetPortIndex": 0
    }
  ],
  "viewState": {
    "x": 100,
    "y": 100,
    "zoom": 1.2
  }
}
```

### Response Payload (from n8n webhook)

**Success (200):**
```json
{
  "workflow": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Updated Workflow Title",
    "nodes": [...],
    "edges": [...],
    "viewState": {
      "x": 100,
      "y": 100,
      "zoom": 1.2
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-16T10:30:00Z"
  }
}
```

**Error (404):**
```json
{
  "error": "Workflow not found"
}
```

## cURL Examples

### Update via API endpoint
```bash
curl -X PUT "http://localhost:3002/api/workflows/123e4567-e89b-12d3-a456-426614174000" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Updated Title",
    "nodes": [],
    "edges": [],
    "viewState": {"x": 0, "y": 0, "zoom": 1}
  }'
```

### Direct Supabase update
```bash
curl -X PATCH \
  "https://vxsjiwlvradiyluppage.supabase.co/rest/v1/workflows?id=eq.123e4567-e89b-12d3-a456-426614174000" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "name": "Updated Title",
    "nodes": [],
    "edges": [],
    "view_state": {"x": 0, "y": 0, "zoom": 1}
  }'
```

## JavaScript/TypeScript Example

```typescript
import { apiService } from './services/apiService';

const updatedWorkflow = await apiService.saveWorkflow({
  id: 'workflow-id',
  title: 'Updated Title',
  nodes: [...],
  edges: [...],
  viewState: { x: 0, y: 0, zoom: 1 }
});

console.log(updatedWorkflow.workflow);
```

## Field Mapping

**API → Database:**
- `title` → `name`
- `viewState` → `view_state`
- `createdAt` → `created_at`
- `updatedAt` → `updated_at`

**Database → API:**
- `name` → `title`
- `view_state` → `viewState`
- `created_at` → `createdAt`
- `updated_at` → `updatedAt`

## Notes

- The `id` field in the request body is optional but recommended
- Only fields included in the body will be updated (partial update)
- The `updated_at` timestamp is automatically updated by the database trigger
- All fields (`nodes`, `edges`, `viewState`) are optional - you can update just the `title` if needed

