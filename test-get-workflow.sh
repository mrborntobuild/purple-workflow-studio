#!/bin/bash

# Quick test script to get workflow payload
# Replace WORKFLOW_ID with an actual workflow ID from your database

BASE_URL="http://localhost:3002/api/workflows"
WORKFLOW_ID="replace-with-actual-workflow-id"

echo "=== Testing Get Workflow Payload ==="
echo ""

# Method 1: Via API endpoint
echo "1. Getting workflow via API endpoint..."
curl -X GET "${BASE_URL}/${WORKFLOW_ID}" \
  -H "Content-Type: application/json" | jq '.'

echo ""
echo "---"
echo ""

# Method 2: List all workflows first to get IDs
echo "2. Listing all workflows to get IDs..."
curl -X GET "${BASE_URL}?limit=5" \
  -H "Content-Type: application/json" | jq '.'

echo ""
echo "---"
echo ""

# Method 3: Direct Supabase query (replace with your credentials)
echo "3. Direct Supabase query (update credentials)..."
echo "Run this manually with your Supabase credentials:"
echo ""
echo "curl -X GET \\"
echo "  'https://vxsjiwlvradiyluppage.supabase.co/rest/v1/workflows?id=eq.${WORKFLOW_ID}&select=*' \\"
echo "  -H 'apikey: YOUR_ANON_KEY' \\"
echo "  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' | jq '.'"

