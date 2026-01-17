# API Testing Guide

This directory contains test payloads and examples for the Workflow Management APIs.

## Files

1. **`api-test-payloads.json`** - Complete JSON payload examples for all API endpoints
2. **`api-test-commands.sh`** - Bash script with curl commands for quick testing
3. **`Workflow-API.postman_collection.json`** - Postman collection for GUI testing

## API Endpoints

### Base URL
```
http://localhost:3002/api/workflows
```

### 1. Create Workflow (POST)
**Endpoint:** `POST /api/workflows`

**Request Body:**
```json
{
  "title": "My First Workflow",
  "nodes": [...],
  "edges": [...],
  "viewState": {...}
}
```

**Response:**
```json
{
  "workflow": {
    "id": "uuid-here",
    "title": "My First Workflow",
    "nodes": [...],
    "edges": [...],
    "viewState": {...},
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 2. Update Workflow (PUT)
**Endpoint:** `PUT /api/workflows/{id}`

**Request Body:** Same as Create, but include `id` field

**Response:** Same as Create

### 3. Get Workflow (GET)
**Endpoint:** `GET /api/workflows/{id}`

**Response:**
```json
{
  "workflow": {
    "id": "uuid-here",
    "title": "My First Workflow",
    "nodes": [...],
    "edges": [...],
    "viewState": {...},
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 4. List Workflows (GET)
**Endpoint:** `GET /api/workflows`

**Query Parameters:**
- `limit` (optional): Number of results per page (default: 10)
- `offset` (optional): Number of results to skip (default: 0)
- `sortBy` (optional): Field to sort by (default: "created_at")
- `order` (optional): Sort order - "asc" or "desc" (default: "desc")

**Example:** `GET /api/workflows?limit=20&offset=0&sortBy=updated_at&order=desc`

**Response:**
```json
{
  "workflows": [
    {
      "id": "uuid-1",
      "title": "Workflow 1",
      "nodes": [],
      "edges": [],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1
}
```

### 5. Delete Workflow (DELETE)
**Endpoint:** `DELETE /api/workflows/{id}`

**Response:** `204 No Content`

## Testing Methods

### Method 1: Using curl (Bash Script)
```bash
# Edit api-test-commands.sh to set BASE_URL
# Then run:
./api-test-commands.sh
```

### Method 2: Using Postman
1. Import `Workflow-API.postman_collection.json` into Postman
2. Set the `baseUrl` variable to your API URL
3. Run requests from the collection

### Method 3: Using curl directly
```bash
# Create workflow
curl -X POST "http://localhost:3002/api/workflows" \
  -H "Content-Type: application/json" \
  -d @api-test-payloads.json

# List workflows
curl -X GET "http://localhost:3002/api/workflows?limit=10"

# Get workflow (replace {id} with actual ID)
curl -X GET "http://localhost:3002/api/workflows/{id}"

# Update workflow (replace {id} with actual ID)
curl -X PUT "http://localhost:3002/api/workflows/{id}" \
  -H "Content-Type: application/json" \
  -d '{"id": "{id}", "title": "Updated", "nodes": [], "edges": []}'

# Delete workflow (replace {id} with actual ID)
curl -X DELETE "http://localhost:3002/api/workflows/{id}"
```

## Node Types Reference

Common node types you can use in workflows:

### Input Nodes
- `text` - Text input
- `prompt` - Prompt input
- `image` - Image input
- `import` - Import file
- `file` - File input

### Image Models
- `nano_banana_pro` - Nano Banana Pro
- `nano_banana_pro_edit` - Nano Banana Pro Edit
- `flux_pro_1_1_ultra` - Flux Pro 1.1 Ultra
- `flux_pro_1_1` - Flux Pro 1.1
- `flux_dev` - Flux Dev
- `ideogram_v3` - Ideogram v3
- `imagen_3` - Imagen 3

### Video Models
- `veo_2` - Veo 2
- `kling_2_6_pro` - Kling 2.6 Pro
- `luma_ray_2` - Luma Ray 2

### Processing Nodes
- `prompt_enhancer` - Enhance prompts
- `prompt_concatenator` - Concatenate prompts
- `levels` - Image levels adjustment
- `compositor` - Image compositing
- `crop` - Crop image
- `blur` - Blur image
- `invert` - Invert colors

### Output Nodes
- `preview` - Preview output
- `export` - Export result

## Edge Structure

Edges connect nodes together:
```json
{
  "id": "edge-1",
  "source": "node-1-id",
  "sourcePortIndex": 0,
  "target": "node-2-id",
  "targetPortIndex": 0
}
```

## ViewState Structure

ViewState stores canvas viewport position:
```json
{
  "x": 0,
  "y": 0,
  "zoom": 1
}
```

## Notes

- The API expects `title` but the database uses `name` - your n8n workflow should map between them
- All timestamps are in ISO 8601 format
- Node IDs should be unique within a workflow
- Edge IDs should be unique within a workflow
- `viewState` is optional but recommended for better UX

