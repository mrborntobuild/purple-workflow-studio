#!/bin/bash

# Test payloads for Workflow Management APIs
# Replace BASE_URL with your actual API URL
BASE_URL="http://localhost:3002/api/workflows"

echo "=== Workflow API Test Commands ==="
echo ""

# 1. Create a new workflow (POST)
echo "1. Creating a new workflow..."
curl -X POST "${BASE_URL}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Workflow",
    "nodes": [
      {
        "id": "node-1",
        "type": "text",
        "position": {"x": 100, "y": 100},
        "data": {
          "label": "Text Input",
          "content": "A beautiful sunset over the ocean",
          "status": "idle"
        }
      },
      {
        "id": "node-2",
        "type": "flux_pro_1_1_ultra",
        "position": {"x": 400, "y": 100},
        "data": {
          "label": "Flux Pro 1.1 Ultra",
          "status": "idle",
          "panelSettings": {
            "prompt": "A beautiful sunset over the ocean",
            "aspectRatio": "16:9",
            "outputFormat": "jpeg",
            "enableSafetyChecker": true,
            "safetyTolerance": "2"
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
    "viewState": {"x": 0, "y": 0, "zoom": 1}
  }' | jq '.'

echo ""
echo "---"
echo ""

# 2. Create minimal workflow
echo "2. Creating minimal workflow..."
curl -X POST "${BASE_URL}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Minimal Workflow",
    "nodes": [],
    "edges": []
  }' | jq '.'

echo ""
echo "---"
echo ""

# 3. List all workflows (GET)
echo "3. Listing all workflows..."
curl -X GET "${BASE_URL}?limit=10&offset=0&sortBy=created_at&order=desc" \
  -H "Content-Type: application/json" | jq '.'

echo ""
echo "---"
echo ""

# 4. Get a specific workflow (GET)
# Replace WORKFLOW_ID with actual ID from create response
WORKFLOW_ID="replace-with-actual-id"
echo "4. Getting workflow by ID..."
echo "Replace WORKFLOW_ID in script with actual ID"
# curl -X GET "${BASE_URL}/${WORKFLOW_ID}" \
#   -H "Content-Type: application/json" | jq '.'

echo ""
echo "---"
echo ""

# 5. Update a workflow (PUT)
# Replace WORKFLOW_ID with actual ID
echo "5. Updating workflow..."
echo "Replace WORKFLOW_ID in script with actual ID"
# curl -X PUT "${BASE_URL}/${WORKFLOW_ID}" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "id": "WORKFLOW_ID",
#     "title": "Updated Workflow Title",
#     "nodes": [
#       {
#         "id": "node-1",
#         "type": "text",
#         "position": {"x": 150, "y": 150},
#         "data": {
#           "label": "Updated Text Input",
#           "content": "Updated content",
#           "status": "idle"
#         }
#       }
#     ],
#     "edges": [],
#     "viewState": {"x": 100, "y": 100, "zoom": 1.2}
#   }' | jq '.'

echo ""
echo "---"
echo ""

# 6. Delete a workflow (DELETE)
# Replace WORKFLOW_ID with actual ID
echo "6. Deleting workflow..."
echo "Replace WORKFLOW_ID in script with actual ID"
# curl -X DELETE "${BASE_URL}/${WORKFLOW_ID}" \
#   -H "Content-Type: application/json"

echo ""
echo "=== Test Complete ==="

