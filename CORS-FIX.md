# Fixing CORS Errors with n8n Webhooks

## Problem
When making requests from `http://localhost:3001` to your n8n webhook at `https://buildhouse.app.n8n.cloud/webhook/*`, you're getting CORS errors:

```
Access to fetch at 'https://buildhouse.app.n8n.cloud/webhook/update-workflows' from origin 'http://localhost:3001' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Solution: Add CORS Headers to n8n Workflows

You need to add a **Respond to Webhook** node at the end of each n8n workflow that returns CORS headers.

### Step 1: Add Respond to Webhook Node

For each workflow (`create-workflow`, `update-workflows`, `get-workflows`, `delete-workflows`, `workflows-all`):

1. Add a **Respond to Webhook** node at the end of your workflow
2. Connect it after your HTTP Request/Supabase node
3. Configure it as follows:

### Step 2: Configure Response Headers

In the **Respond to Webhook** node:

**Response Code:** `200`

**Response Headers:**
Add these headers (one per line):
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS, GET
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

**Response Body:**
- Set to "Using 'Respond to Webhook' Node"
- The body should come from the previous node (your database response)

### Step 3: Handle OPTIONS Preflight Requests

For CORS preflight requests (OPTIONS method), add a **Switch** node at the beginning:

1. Add a **Switch** node right after the Webhook trigger
2. Set condition: `{{ $json.headers['request-method'] }}` equals `OPTIONS`
3. If true → Connect to **Respond to Webhook** node with:
   - Response Code: `200`
   - Response Headers: Same as above
   - Response Body: Empty
4. If false → Continue with your normal workflow logic

### Alternative: Use Code Node

If you prefer, you can use a **Code** node to set headers:

```javascript
// Set CORS headers
$response.headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};

// Return the data from previous node
return $input.all();
```

### Step 4: Test

After updating your n8n workflows:

1. Save and activate the workflows
2. Try saving a workflow from the frontend
3. Check the browser console - CORS errors should be gone
4. The request should now succeed

## Quick Reference: Required Headers

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS, GET
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

## Security Note

For production, replace `Access-Control-Allow-Origin: *` with your specific domain:
```
Access-Control-Allow-Origin: https://yourdomain.com
```

Or use environment variables in n8n to set it dynamically.

