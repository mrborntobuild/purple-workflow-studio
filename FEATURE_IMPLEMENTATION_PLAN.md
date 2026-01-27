# Purple Feature Implementation Plan

**Created:** January 25, 2026
**Version:** 1.0
**Status:** Planning Phase

---

## Executive Summary

This document outlines the implementation plan for Purple's 10 foundational features. Features are organized by priority based on business criticality and user impact.

### Priority Legend
- **P0** - Critical (blocks revenue or core functionality)
- **P1** - High (essential for user retention)
- **P2** - Medium (improves experience significantly)
- **P3** - Low (nice to have)

### Current Status Overview

| Feature | Current State | Priority | Effort |
|---------|---------------|----------|--------|
| Payment | Not Implemented | P0 | Large |
| Login (Forgot Password) | Partial | P0 | Small |
| Feedback Tracker | Not Implemented | P1 | Medium |
| Real Time Collaboration | Not Implemented | P1 | Large |
| Workflow Template Library | UI Only | P1 | Medium |
| Output Library | Partial | P2 | Medium |
| Assets Panel | Implemented | P2 | Small |
| AI Tool Box | Implemented | P2 | Medium |
| Dashboard | Implemented | P3 | Small |
| App Mode | Implemented | P3 | Medium |

---

## P0 - Critical Priority

---

### 1. Payment System

**Current State:** Hardcoded "150 credits" placeholder only

**Goal:** Full payment processing with subscriptions, one-time purchases, and promo codes

#### Phase 1: Stripe Integration (Foundation)
- [ ] Set up Stripe account and obtain API keys
- [ ] Install Stripe SDK (`@stripe/stripe-js`, `@stripe/react-stripe-js`)
- [ ] Create Stripe webhook endpoint in `/api/webhooks/stripe`
- [ ] Set up Supabase tables:
  - `subscriptions` (user_id, stripe_subscription_id, plan_type, status, current_period_end)
  - `credits` (user_id, balance, last_updated)
  - `transactions` (id, user_id, type, amount, stripe_payment_id, created_at)
  - `payment_methods` (user_id, stripe_payment_method_id, last_four, brand, is_default)

#### Phase 2: Subscription Management
- [ ] Create pricing page component with plan tiers (Free, Pro, Enterprise)
- [ ] Implement Stripe Checkout session creation endpoint
- [ ] Handle subscription lifecycle webhooks:
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- [ ] Build subscription management UI (current plan, upgrade/downgrade, cancel)
- [ ] Implement usage limits based on plan tier

#### Phase 3: Credit System
- [ ] Create credit purchase flow (one-time payments)
- [ ] Build credit balance component (replace hardcoded "150 credits")
- [ ] Implement credit deduction on AI model usage
- [ ] Add low-balance warnings and auto-refill option
- [ ] Create usage tracking dashboard

#### Phase 4: Additional Features
- [ ] Promo code system:
  - Create `promo_codes` table (code, discount_type, discount_value, expiry, usage_limit)
  - Add promo code input to checkout flow
  - Validate and apply discounts
- [ ] Multiple payment methods:
  - Apple Pay / Google Pay via Stripe Payment Request Button
  - Add/remove payment methods UI
  - Set default payment method
- [ ] Billing history and invoices:
  - Transaction history page
  - Download invoice PDFs (Stripe hosted invoices)

#### Technical Considerations
- Use Stripe Customer Portal for self-service billing management
- Implement idempotency keys for payment operations
- Add retry logic for failed webhook deliveries
- Store Stripe customer ID in Supabase user metadata

#### Success Metrics
- Payment completion rate > 95%
- Failed payment recovery rate > 60%
- Average time to complete purchase < 30 seconds

---

### 2. Login - Forgot Password Flow

**Current State:** Email/password and Google OAuth working; no password recovery

**Goal:** Complete authentication flow with password reset capability

#### Implementation Steps
- [ ] Create "Forgot Password" page (`/forgot-password`)
  - Email input form
  - Rate limiting (max 3 requests per hour per email)
  - Success state UI (check your email message)
- [ ] Implement Supabase password reset:
  ```typescript
  supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://app.purple.com/reset-password'
  })
  ```
- [ ] Create "Reset Password" page (`/reset-password`)
  - New password input with confirmation
  - Password strength indicator
  - Handle token from URL parameters
- [ ] Add password validation rules:
  - Minimum 8 characters
  - At least one uppercase, lowercase, number
  - Visual strength meter
- [ ] Update login page with "Forgot Password?" link
- [ ] Email template customization in Supabase dashboard
- [ ] Add error handling for:
  - Invalid/expired reset tokens
  - Email not found (show generic message for security)
  - Rate limit exceeded

#### Security Considerations
- Reset tokens expire after 1 hour
- Invalidate all existing sessions on password change
- Log password reset attempts for security monitoring
- Use generic error messages to prevent email enumeration

#### Success Metrics
- Password reset completion rate > 80%
- Support tickets for login issues reduced by 50%

---

## P1 - High Priority

---

### 3. Feedback Tracker

**Current State:** Help icon exists but no functionality

**Goal:** In-app feedback submission with bug reporting and feature requests

#### Phase 1: Basic Feedback Form
- [ ] Create FeedbackModal component
  - Feedback type selector (Bug, Feature Request, General Feedback)
  - Description textarea
  - Optional screenshot attachment
  - Email field (pre-filled if logged in)
- [ ] Create Supabase table:
  ```sql
  CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users,
    type TEXT NOT NULL, -- 'bug', 'feature', 'general'
    description TEXT NOT NULL,
    screenshot_url TEXT,
    page_url TEXT,
    user_agent TEXT,
    status TEXT DEFAULT 'new', -- 'new', 'in_review', 'planned', 'completed', 'declined'
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- [ ] Wire up Help icon in sidebar to open modal
- [ ] Implement screenshot capture using `html2canvas`
- [ ] Auto-capture context (current URL, browser info, user ID)

#### Phase 2: Enhanced Reporting
- [ ] Add severity levels for bugs (Critical, High, Medium, Low)
- [ ] Implement reproduction steps field for bugs
- [ ] Add console error auto-capture option
- [ ] Create feedback submission API endpoint
- [ ] Send notification email to team on new feedback
- [ ] Add confirmation toast on successful submission

#### Phase 3: Admin Dashboard (Internal)
- [ ] Create admin view for feedback triage
- [ ] Add status update functionality
- [ ] Implement feedback response system (email user back)
- [ ] Add analytics (feedback volume, types, resolution time)

#### Integration Options
- Consider integrating with existing tools:
  - Linear/Jira for issue tracking
  - Intercom/Zendesk for support
  - Slack notifications for new feedback

#### Success Metrics
- Feedback submission rate > 2% of active users
- Average response time < 24 hours
- Bug report quality score (has reproduction steps)

---

### 4. Real-Time Collaboration

**Current State:** Share button UI only, no functionality

**Goal:** Multiple users can work on the same workflow simultaneously

#### Phase 1: Infrastructure
- [ ] Evaluate real-time backend options:
  - **Option A:** Supabase Realtime (recommended - already using Supabase)
  - **Option B:** Liveblocks (purpose-built for collaborative apps)
  - **Option C:** Socket.io with custom server
- [ ] Design data model for collaborative editing:
  ```sql
  CREATE TABLE workflow_collaborators (
    workflow_id UUID REFERENCES workflows,
    user_id UUID REFERENCES auth.users,
    role TEXT NOT NULL, -- 'owner', 'editor', 'viewer'
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (workflow_id, user_id)
  );

  CREATE TABLE workflow_presence (
    workflow_id UUID,
    user_id UUID,
    cursor_position JSONB,
    selected_nodes TEXT[],
    last_seen TIMESTAMPTZ,
    PRIMARY KEY (workflow_id, user_id)
  );
  ```

#### Phase 2: Sharing & Permissions
- [ ] Create ShareModal component:
  - Email invite input
  - Role selector (Editor, Viewer)
  - Copy shareable link
  - List current collaborators
  - Remove collaborator option
- [ ] Implement invite system:
  - Send email invitations
  - Handle invite acceptance flow
  - Permission validation on all API calls
- [ ] Add "Shared with Me" section to dashboard (already in sidebar)

#### Phase 3: Real-Time Sync
- [ ] Implement presence system:
  - Show active collaborators' avatars
  - Display collaborator cursors on canvas
  - Highlight nodes being edited by others
- [ ] Set up real-time node/edge synchronization:
  - Subscribe to workflow changes
  - Broadcast local changes
  - Handle concurrent edits (last-write-wins or CRDT)
- [ ] Add optimistic updates with conflict resolution
- [ ] Implement connection status indicator

#### Phase 4: Collaboration Features
- [ ] Add commenting system on nodes
- [ ] Implement @mentions in comments
- [ ] Create activity feed (who changed what)
- [ ] Add version history with restore capability
- [ ] Implement "follow" mode (view another user's viewport)

#### Technical Considerations
- Use Operational Transformation (OT) or CRDTs for conflict resolution
- Implement heartbeat for presence (every 5 seconds)
- Handle reconnection gracefully
- Consider using Yjs for shared state synchronization

#### Success Metrics
- Concurrent users per workflow > 3 (average for team accounts)
- Sync latency < 200ms
- Conflict resolution success rate > 99%

---

### 5. Workflow Template Library

**Current State:** UI mockups with "Coming Soon" badges

**Goal:** Functional templates users can start from and customize

#### Phase 1: Template Infrastructure
- [ ] Create Supabase tables:
  ```sql
  CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'image', 'video', 'text', 'social', 'custom'
    thumbnail_url TEXT,
    workflow_data JSONB NOT NULL, -- nodes, edges, viewport
    author_id UUID REFERENCES auth.users,
    is_official BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    usage_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE template_tags (
    template_id UUID REFERENCES templates,
    tag TEXT NOT NULL,
    PRIMARY KEY (template_id, tag)
  );
  ```
- [ ] Create template API endpoints:
  - `GET /api/templates` - list templates
  - `GET /api/templates/:id` - get template details
  - `POST /api/templates` - create template (admin/user)
  - `POST /api/templates/:id/use` - create workflow from template

#### Phase 2: Official Templates
- [ ] Design and create starter templates:
  - **Image Generation:** Text prompt → Image model → Preview
  - **Video Creation:** Image → Video model → Preview
  - **Upscaling Pipeline:** Import → Upscale → Export
  - **Social Media Post:** Prompt → Image → Text overlay → Export
  - **Batch Processing:** Import multiple → Process → Export all
- [ ] Create template thumbnails and descriptions
- [ ] Implement "Use Template" flow:
  - Clone template to user's workflows
  - Open in canvas mode
  - Show onboarding tooltip explaining the flow

#### Phase 3: Template Discovery
- [ ] Build template browser page (`/templates`)
  - Category filters
  - Search functionality
  - Sort by popularity/newest
  - Template preview cards
- [ ] Add template detail modal:
  - Full description
  - Preview of nodes
  - "Use This Template" CTA
  - Usage count

#### Phase 4: User-Generated Templates
- [ ] Add "Save as Template" option in canvas
- [ ] Create template submission flow:
  - Name, description, category
  - Thumbnail generation (auto-capture)
  - Visibility setting (private/public)
- [ ] Implement template moderation (for public templates)
- [ ] Add template ratings and reviews
- [ ] Create "My Templates" section

#### Success Metrics
- Template usage rate > 40% of new workflows
- Template-to-completion rate > 60%
- User-generated templates > 100 in first 6 months

---

## P2 - Medium Priority

---

### 6. Output Library

**Current State:** ExportNode UI exists but not functional

**Goal:** Centralized library for all workflow outputs with download and organization

#### Phase 1: Export Functionality
- [ ] Implement ExportNode processing:
  - Accept image/video inputs
  - Format conversion options (PNG, JPEG, WebP, MP4, WebM, GIF)
  - Quality/compression settings
  - Resolution options
- [ ] Create output storage in Supabase:
  ```sql
  CREATE TABLE outputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows,
    user_id UUID REFERENCES auth.users,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INT,
    file_name TEXT,
    metadata JSONB, -- dimensions, duration, format settings
    tags TEXT[],
    is_starred BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- [ ] Implement download functionality:
  - Single file download
  - Batch download as ZIP
  - Copy to clipboard (for images)

#### Phase 2: Output Library UI
- [ ] Create OutputLibrary page (`/outputs`)
  - Grid view of all outputs
  - List view option
  - Filter by type (image, video)
  - Filter by workflow
  - Sort by date/name/size
- [ ] Add output detail modal:
  - Full preview
  - Metadata display
  - Download options
  - Delete option
  - Add/edit tags
- [ ] Implement search across outputs

#### Phase 3: Organization Features
- [ ] Add tagging system:
  - Create/manage tags
  - Bulk tagging
  - Filter by tags
- [ ] Implement folders/collections
- [ ] Add "Star" functionality for quick access
- [ ] Create "Recently Exported" section in dashboard

#### Phase 4: Advanced Features
- [ ] Auto-export on workflow completion option
- [ ] Export presets (save format settings)
- [ ] Batch processing for exports
- [ ] Cloud storage integration (Dropbox, Google Drive, Box)
- [ ] Direct social media sharing

#### Success Metrics
- Export completion rate > 90%
- Average outputs per user per week > 5
- Output library return visits > 3 per week

---

### 7. Assets Panel Enhancement

**Current State:** Drag-drop upload working in nodes, no central library

**Goal:** Centralized asset management with organization and reuse

#### Implementation Steps
- [ ] Create AssetsPanel component (sidebar panel or dedicated page)
- [ ] Create Supabase table:
  ```sql
  CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INT,
    thumbnail_url TEXT,
    tags TEXT[],
    folder_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE asset_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users,
    name TEXT NOT NULL,
    parent_id UUID REFERENCES asset_folders,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- [ ] Build asset browser UI:
  - Grid/list view toggle
  - Folder navigation
  - Search and filter
  - Drag assets onto canvas
- [ ] Implement bulk operations:
  - Multi-select
  - Bulk delete
  - Bulk move to folder
  - Bulk tag
- [ ] Add storage quota tracking and display
- [ ] Support additional file types:
  - Video files
  - Audio files
  - 3D models (future)
- [ ] Implement asset deduplication

#### Success Metrics
- Asset reuse rate > 30%
- Assets organized in folders > 50%
- Storage efficiency (deduplication savings)

---

### 8. AI Tool Box Enhancement

**Current State:** 30+ models implemented, some UI-only placeholders

**Goal:** Complete model coverage and improved organization

#### Phase 1: Complete Pending Models
- [ ] **Lip Sync Models:**
  - Research available APIs (Wav2Lip, SadTalker, etc.)
  - Implement LipSyncNode with audio + video inputs
  - Add model selection and parameters
- [ ] **Upscaling & Enhancement:**
  - Integrate Real-ESRGAN or similar
  - Add scale factor options (2x, 4x)
  - Implement face enhancement option
- [ ] **Audio/TTS Models:**
  - Integrate ElevenLabs or similar TTS API
  - Create TTSNode with voice selection
  - Add speech-to-text (Whisper) node
- [ ] **Background Removal:**
  - Integrate remove.bg API or rembg
  - Create BackgroundRemovalNode

#### Phase 2: Tool Organization
- [ ] Implement tool categories with collapsible sections
- [ ] Add "Favorites" functionality for tools
- [ ] Create "Recently Used" section
- [ ] Implement tool search in panel
- [ ] Add tool tooltips with descriptions
- [ ] Hide/show tools based on user preference

#### Phase 3: Tool Quality of Life
- [ ] Add model comparison feature (run same input through multiple models)
- [ ] Implement A/B testing node
- [ ] Create tool presets (save parameter configurations)
- [ ] Add cost estimation per tool/model
- [ ] Implement queue management for long-running operations

#### Success Metrics
- Tool discovery (users trying new tools) > 5 per user per month
- Tool completion rate > 85%
- Average tools per workflow > 4

---

## P3 - Lower Priority

---

### 9. Dashboard Enhancement

**Current State:** Functional with search and basic organization

**Goal:** Enhanced organization and workflow management

#### Implementation Steps
- [ ] Add workflow filtering:
  - By date range
  - By tags
  - By collaborator
  - By status (draft, published)
- [ ] Implement workflow tagging system
- [ ] Add "Starred/Favorite" workflows
- [ ] Create workflow folders/projects
- [ ] Implement duplicate workflow feature
- [ ] Add workflow version history:
  - Auto-save versions
  - Named checkpoints
  - Restore previous version
- [ ] Implement bulk actions:
  - Multi-select
  - Bulk delete
  - Bulk move
  - Bulk tag
- [ ] Add sorting options:
  - Last edited
  - Created date
  - Name
  - Node count
- [ ] Create dashboard widgets:
  - Recent activity
  - Usage statistics
  - Credits remaining

#### Success Metrics
- Time to find workflow < 10 seconds
- Workflow organization adoption > 40%

---

### 10. App Mode Enhancement

**Current State:** Dashboard and Canvas modes working

**Goal:** Multiple viewing modes for different use cases

#### Implementation Steps
- [ ] **Theme System:**
  - Create theme context
  - Implement light/dark toggle
  - Add system preference detection
  - Persist preference in localStorage/Supabase
- [ ] **Presentation Mode:**
  - Full-screen canvas without UI
  - Keyboard navigation
  - Step-through workflow execution
- [ ] **Mobile Responsive Mode:**
  - Responsive breakpoints
  - Touch-friendly controls
  - Simplified mobile canvas
  - Mobile-specific navigation
- [ ] **Minimap Toggle:**
  - Expose ReactFlow minimap
  - Position and size options
  - Toggle in view settings
- [ ] **Custom Layout Presets:**
  - Save panel arrangements
  - Quick switch between layouts
  - Reset to default

#### Success Metrics
- Theme toggle usage > 20% use non-default
- Mobile engagement (if applicable)

---

## Implementation Timeline (Suggested)

### Sprint 1-2: Authentication & Payment Foundation
- Forgot Password flow (P0)
- Stripe integration setup (P0)
- Basic subscription flow (P0)

### Sprint 3-4: Payment Completion & Feedback
- Credit system (P0)
- Promo codes (P0)
- Feedback tracker (P1)

### Sprint 5-8: Collaboration & Templates
- Real-time infrastructure (P1)
- Sharing & permissions (P1)
- Template infrastructure (P1)
- Official templates creation (P1)

### Sprint 9-10: Output & Assets
- Export functionality (P2)
- Output library UI (P2)
- Assets panel enhancement (P2)

### Sprint 11-12: Polish & Enhancement
- AI toolbox completion (P2)
- Dashboard improvements (P3)
- App mode enhancements (P3)

---

## Technical Debt & Prerequisites

Before starting feature work, address:

1. **Environment Configuration**
   - Set up staging environment
   - Configure environment variables for Stripe
   - Set up error monitoring (Sentry)

2. **Testing Infrastructure**
   - Set up unit testing (Vitest)
   - Add E2E testing (Playwright)
   - Create test database seeding

3. **CI/CD Pipeline**
   - Automated testing on PR
   - Preview deployments
   - Production deployment workflow

4. **Documentation**
   - API documentation
   - Component storybook
   - Architecture decision records

---

## Appendix: API Endpoints Needed

### Authentication
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Payment
- `POST /api/payments/create-checkout-session`
- `POST /api/payments/create-portal-session`
- `POST /api/webhooks/stripe`
- `GET /api/payments/credits`
- `POST /api/payments/purchase-credits`
- `POST /api/payments/apply-promo`

### Collaboration
- `POST /api/workflows/:id/share`
- `DELETE /api/workflows/:id/collaborators/:userId`
- `GET /api/workflows/:id/collaborators`
- `POST /api/workflows/:id/presence`

### Templates
- `GET /api/templates`
- `GET /api/templates/:id`
- `POST /api/templates`
- `POST /api/templates/:id/use`

### Feedback
- `POST /api/feedback`
- `GET /api/feedback` (admin)
- `PATCH /api/feedback/:id` (admin)

### Assets & Outputs
- `GET /api/assets`
- `POST /api/assets`
- `DELETE /api/assets/:id`
- `GET /api/outputs`
- `POST /api/outputs`
- `DELETE /api/outputs/:id`

---

*This document should be reviewed and updated as implementation progresses.*
