# Clientora — PRD Gap Completion Plan

**Current status: ~75% complete** | **Design system: Coinest (green brand)**

## Design System Reference (Coinest)
- **Colors**: Primary `#1A3D2B` · Mid `#1A6B45` · Green `#2F9B65` · Accent `#3ACF84` · Light `#A8E8C6` · Tint `#D4F0E2` · Surface `#EEF8F2` · BG `#F5FBF7`
- **Semantic**: Danger `#D83C2E` · Warning `#F59E0B` · Success `#1A9960`
- **Typography**: DM Sans (body) + Plus Jakarta Sans (headings) — 28px display, 22px h1, 18px h2, 14px body, 13px caption, 12px label
- **Radius**: 4px badges → 6px pills → 8px buttons/inputs → 12px cards → 16px modals → 99px toggles
- **Cards**: 0.5px border, 12px radius, 16-18px padding
- **Buttons**: Primary `#1A3D2B` filled · Secondary transparent outlined · Ghost border · Danger `#D83C2E`

---

## Batch A — Quick Wins (estimated: 2-3 hours)

### Task A1: "Request Info" action on freelancer requests
- **PRD**: §6.4 — freelancer can request more info from client
- **Files**: `src/app/freelancer/requests/actions.ts`, `request-modals.tsx`, `requests-client.tsx`
- **Work**: Add `requestInfo(requestId, message)` server action → sets status `info_needed`, sends notification to client. Add `InfoModal` UI in request-modals.tsx with textarea. Add "Request Info" button alongside Accept/Reject.

### Task A2: "Mark as Paid" toggle for invoices
- **PRD**: §6.6 — toggle invoice paid status
- **Files**: `src/app/workspace/[id]/actions.ts`, `workspace-client.tsx` (Documents tab)
- **Work**: Add `markInvoicePaid(documentId, paid)` server action → sets status to `paid`/`sent`. Add "Mark as Paid" / "Mark Unpaid" button on invoice documents. Show paid badge.

### Task A3: Proposal acceptance flow
- **PRD**: §10.3 — client can accept/decline proposals
- **Files**: `src/app/workspace/[id]/actions.ts`, `workspace-client.tsx` (Documents tab), `src/app/client/documents/page.tsx`
- **Work**: Add `respondToProposal(documentId, response, notes?)` action → updates status. Add "Accept Proposal" / "Decline" buttons visible to client when viewing sent proposals. Auto-advance workspace to `in_progress` on acceptance.

### Task A4: Pipeline drag-and-drop between columns
- **PRD**: §6.9 — drag cards between Kanban stages
- **Files**: `src/app/freelancer/pipeline/pipeline-board.tsx`, `actions.ts`
- **Work**: `@hello-pangea/dnd` is already installed. Wrap Kanban columns in `Droppable`, cards in `Draggable`. On `onDragEnd`, call `updateWorkspaceStage()` with new stage. Add optimistic update + rollback.

---

## Batch B — Admin Panel Completion (estimated: 3-4 hours)

### Task B1: User search, filter, and disable
- **PRD**: §6.11 — admin can search/filter users, disable accounts
- **Files**: `src/app/admin/users/page.tsx`
- **Work**: Add search input (filter by name/email). Add role filter dropdown (freelancer/client/admin). Add disable/enable toggle action (`disableUser(userId, disabled)` server action → updates `profiles.disabled` boolean). Add `disabled` column to profiles table (migration needed).

### Task B2: Admin charts and analytics
- **PRD**: §6.11 — signups chart, requests accepted vs rejected
- **Files**: `src/app/admin/dashboard/page.tsx`
- **Work**: Add a signups-over-time line chart (last 30 days) using SVG sparkline or a lightweight chart lib. Add accepted vs rejected requests pie/donut chart. Query `profiles` grouped by `created_at` date, `project_requests` grouped by status.

### Task B3: Freelancer and Client management pages
- **PRD**: IA — `/admin/freelancers` and `/admin/clients`
- **Files**: New `src/app/admin/freelancers/page.tsx`, `src/app/admin/clients/page.tsx`
- **Work**: List all freelancers/clients with stats: total workspaces, revenue, active projects. Link to user detail. Use Coinest table styling (0.5px borders, 13px text).

---

## Batch C — Email & Notifications (estimated: 2-3 hours)

### Task C1: Comprehensive email notifications
- **PRD**: §8 — email for key events beyond just invites
- **Files**: `src/lib/email.ts`, server actions
- **Work**: Add email sending for: workspace created (both parties), document sent (client), request accepted/rejected (client), task assigned (assignee). Use existing Resend setup. Create `sendEmail({ to, subject, html })` helper. Add email templates for each event type.

### Task C2: Task deadline reminders
- **PRD**: §10.9 — 24h and 1h before task due date
- **Files**: New cron job or scheduled action, `src/lib/notifications.ts`
- **Work**: Add `checkTaskDeadlines()` function → queries tasks where `due_date` is within 24h/1h and `status != completed`. Creates notifications. Trigger via Vercel Cron or manual refresh. Show countdown on overdue tasks.

---

## Batch D — New Features (estimated: 6-8 hours)

### Task D1: Time tracking widget
- **PRD**: §10.4 — track time per task/workspace
- **DB**: New `time_logs` table (id, task_id, workspace_id, user_id, started_at, ended_at, duration_seconds, note)
- **Files**: New `src/components/TimeTracker.tsx`, actions in `workspace/[id]/actions.ts`
- **Work**: Start/stop timer button in workspace. Running timer indicator. Time log entries per task. Total hours summary. Optional: link hours to invoice line items.

### Task D2: Client satisfaction rating
- **PRD**: §10.5 — post-completion 5-star rating
- **DB**: New `workspace_reviews` table (id, workspace_id, client_id, rating, feedback, created_at)
- **Files**: New `src/components/SatisfactionPrompt.tsx`, actions
- **Work**: Show rating prompt when workspace status = `completed`. 5-star selector + optional text feedback. Display average rating on freelancer dashboard. Store in `workspace_reviews`.

### Task D3: Quick notes (freelancer)
- **PRD**: §10.7 — sticky notes for freelancers
- **DB**: New `freelancer_notes` table (id, user_id, title, content, color, created_at, updated_at)
- **Files**: New `src/app/freelancer/notes/page.tsx`
- **Work**: CRUD for notes. Color picker (use Coinest brand palette). Pinned notes on freelancer dashboard. Grid/card layout.

### Task D4: Client tags & segmentation
- **PRD**: §10.8 — organize clients with tags
- **DB**: New `client_tags` table (id, freelancer_id, name, color) + `workspace_tag_assignments` (tag_id, workspace_id)
- **Files**: Update pipeline page, workspace list
- **Work**: Create/manage tags. Assign tags to workspaces. Filter pipeline by tag. Color-coded tag pills.

---

## Batch E — Polish & Enhancement (estimated: 4-5 hours)

### Task E1: Template library
- **PRD**: §10.6 — save and reuse document templates
- **DB**: New `document_templates` table (id, user_id, type, name, content_jsonb, created_at)
- **Files**: New `src/components/documents/TemplateLibrary.tsx`
- **Work**: "Save as Template" button in document editor. Template picker when creating new documents. Pre-filled content from saved template. User's saved templates list.

### Task E2: Global search
- **PRD**: Batch 8 §7 — search across clients, workspaces, documents
- **Files**: New `src/components/GlobalSearch.tsx`, mount in sidebar
- **Work**: Search input in sidebar header. Queries: profiles (clients), workspaces, workspace_documents. Debounced API or client-side filter. Results grouped by type with icons. Navigate on click.

### Task E3: Referral analytics dashboard
- **PRD**: §10.10 — campaign codes, performance charts
- **Files**: `src/app/freelancer/referrals/page.tsx`, `actions.ts`
- **Work**: Add campaign label field when creating codes. Add time-series chart of referrals over last 90 days. Add conversion funnel (codes created → linked → active workspaces).

### Task E4: Design system audit & alignment
- **PRD**: Batch 8 §11 — consistent UI throughout
- **Files**: `src/app/globals.css`, all page/component files
- **Work**: Audit all pages against Coinest design tokens. Ensure consistent use of: 0.5px borders (not 1px), 12px card radius, 8px button radius, proper text sizes (14px body, 13px caption, 12px label), surface colors (`#EEF8F2` not custom grays), progress gradient bars. Fix inconsistencies.

---

## Priority Order

| Priority | Batch | Features | Est. Hours |
|----------|-------|----------|------------|
| 🔴 P0 | A | Quick wins (Request Info, Mark Paid, Proposal Accept, Pipeline DnD) | 2-3h |
| 🟠 P1 | B | Admin panel completion | 3-4h |
| 🟡 P2 | C | Email + notifications | 2-3h |
| 🟢 P3 | D | New features (Time tracking, Satisfaction, Notes, Tags) | 6-8h |
| 🔵 P4 | E | Polish (Templates, Search, Referral analytics, Design audit) | 4-5h |

**Total estimated: 17-23 hours** to reach ~100% PRD completion.
