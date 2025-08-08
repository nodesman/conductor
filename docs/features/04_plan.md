# Feature: `conductor --plan`

## 1. The Problem

The real bottleneck in software development is often not coding, but the human processes around it, like planning, alignment, and review. A wall of code dropped on a reviewer with no context is slow and difficult to approve.

The article highlights this: *"You can't compress the back and forth of 3 months of code review into 1.5 weeks... Much of your prime coding time is actually reading and thinking."*

## 2. The Solution

The `--plan` command shifts the AI's role from a pure coder to a project planner. It takes a feature specification and asks the AI to produce a detailed, step-by-step implementation plan.

This plan, created before any code is written, can be reviewed and approved by a human much more quickly. It ensures alignment and breaks the work into logical, verifiable chunks, streamlining the entire development process.

## 3. Example Usage

```bash
# The user wants a detailed implementation plan before starting to code.
conductor --plan docs/new_feature_spec.md | gemini
```

## 4. Generated Prompt Example

```text
Hello. Your task is to act as a senior software engineer and create a detailed implementation plan for the feature described below. Do not write the full implementation code. Instead, create a clear, step-by-step plan that another engineer can follow.

--- FEATURE SPECIFICATION ---
// ... content of docs/new_feature_spec.md ...

**Your Planning Task:**

Please create a detailed development plan. The plan should be broken down into logical steps. For each step, provide:
1.  **A clear description** of the work to be done.
2.  **The specific files** that will need to be created or modified.
3.  **A list of key functions/classes/components** that will be added.
4.  **A testing strategy** for that step (e.g., "Add a unit test for the `calculateTotal` function").

**Example Plan Structure:**

*   **Step 1: Update the Database Schema**
    *   **Description:** Add a `last_login` timestamp column to the `users` table.
    *   **Files:** `db/migrations/20250806_add_last_login.sql`
    *   **Testing:** N/A (or "Run migration and verify schema in a test database").
*   **Step 2: Create the API Endpoint**
    *   **Description:** Create a new `POST /api/login` endpoint.
    *   **Files:** `src/routes/auth.ts`, `src/controllers/authController.ts`
    *   **Functions:** `login(req, res)`, `AuthService.verifyPassword(...)`
    *   **Testing:** "Add an integration test that calls the `/api/login` endpoint with valid and invalid credentials."
*   **Step 3: ...**

Provide the complete, ordered plan.
```
