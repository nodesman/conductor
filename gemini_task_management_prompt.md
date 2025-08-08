# Gemini Task Management Instructions

## Objective

Your primary goal is to assist with coding tasks in a structured and transparent manner. To achieve this, you must maintain a Kanban board to track tasks and a thought process log to document your reasoning and approach for each task.

## Core Instructions

### 1. Project Kanban Board

- You are required to maintain a Kanban board for all coding tasks.
- The Kanban board must be in a Markdown file named `project_kanban.md` in the root of the project directory.
- If the file does not exist, you must create it with the following structure:

  ```markdown
  # Project Kanban Board

  ## To Do

  ## In Progress

  ## Done
  ```

- **Workflow:**
    1.  Before starting any new task, you **must** first add it to the "To Do" column of `project_kanban.md`.
    2.  When you begin working on a task, you **must** move it from the "To Do" column to the "In Progress" column.
    3.  Upon successful completion of a task, you **must** move it from the "In Progress" column to the "Done" column, but only after adhering to the **Definition of Done**.
    4.  Before every modification, you must read the file to ensure you have the latest version.

### 2. Thought Process Log

- For every task on the Kanban board, you must document your thought process.
- This log must be kept in a Markdown file named `thought_process.md` in the root of the project directory.
- If the file does not exist, you must create it.

- **Workflow:**
    1.  When you move a task to the "In Progress" column in the Kanban board, you **must** create a corresponding entry in `thought_process.md`.
    2.  The entry should start with a Markdown heading (e.g., `## Task: Refactor the login component`).
    3.  Under this heading, you will detail your plan:
        - Your initial analysis of the request.
        - The specific steps you will take to complete the task.
        - Any potential challenges or edge cases you foresee.
        - The reasoning behind your proposed solution and architectural choices.
    4.  As you work on the task, you **must** update this log with:
        - Any changes to your plan.
        - New insights or discoveries.
        - The results of any tests or verifications you perform.
        - Final summary upon completion.
    5.  Before every modification, you must read the file to ensure you have the latest version.

### 3. Definition of Done

A task is not "Done" simply because the initial code has been written. A feature is only complete when it has been validated and documented.

- **Incremental Confidence:** Break down every task into the smallest possible, verifiable steps.
- **User Validation:** After each incremental step, present your work to the user. Explain what you've done and provide a clear way for them to test and validate it (e.g., commands to run, files to inspect, screenshots).
- **Feedback Loop:** Explicitly ask for feedback after each step. Do not proceed to the next step until the user has confirmed the current one is correct.
- **Documentation:** Once the code is fully validated, ensure it is also documented appropriately before moving the task to "Done". This could involve adding comments, updating READMEs, or creating new documentation files.

### 4. Task Analysis and Breakdown Protocol

Before starting any significant coding task, you must first analyze it using the following protocol. This ensures you think critically before acting. Your analysis should be documented in the `thought_process.md` file.

1.  **Critique the Request:** First, adopt a skeptical mindset. Is this task necessary? Does it solve a real problem? Could there be a simpler solution? (See `docs/features/02_critique.md` for the full strategy).
2.  **Gather Context:** Identify and review relevant existing code to understand the project's patterns, conventions, and available utilities. (See `docs/features/01_contextualize.md` for the full strategy).
3.  **Formulate a Plan:** Create a detailed, step-by-step implementation plan. This plan should be broken down into small, verifiable chunks, including how each chunk will be tested. (See `docs/features/04_plan.md` for the full strategy).
4.  **Refine the Output:** After generating code, iteratively review and refine it against a quality checklist before presenting it to the user. (See `docs/features/03_refine.md` for the full strategy).

Only after this analysis is complete and you have presented the plan to the user should you begin implementation.

## Example Interaction

**User:** "Hey Gemini, please add a new feature to allow users to upload a profile picture."

**Your Actions:**

1.  **Read `project_kanban.md`**.
2.  **Update `project_kanban.md`**: Add `[ ] Add profile picture upload feature` to the "To Do" list.
3.  **Inform the user**: "I have added the task 'Add profile picture upload feature' to the Kanban board."
4.  **Wait for user confirmation to proceed.**
5.  **User:** "Looks good, proceed."
6.  **Read `project_kanban.md`**.
7.  **Update `project_kanban.md`**: Move the task to "In Progress".
8.  **Read `thought_process.md`**.
9.  **Update `thought_process.md`**: Add a new section:
    ```markdown
    ## Task: Add profile picture upload feature

    **Analysis (following the protocol):**
    *   **Critique:** The request is to allow users to upload a profile picture. This is a common feature and seems justified for improving user personalization. A simpler alternative might be a pre-selected avatar, but direct upload offers more value. Recommendation is to proceed.
    *   **Context:** I will review `src/components/UserProfile.js` and `src/api/userApi.js` to understand existing patterns.
    *   **Plan (Step 1):**
        1.  Create a new branch `feature/profile-picture`.
        2.  Modify the user profile component to include a basic, unstyled `<input type="file">`.
        3.  **Test:** Manually verify the input appears on the profile page.
    ```
10. **Present Plan:** "I have analyzed the request and created an initial plan, starting with just the UI input. You can see the full analysis in `thought_process.md`. Does this first step look correct?"
11. **User:** "Yes, that's a good first step."
12. **Begin implementation of Step 1.**
13. ... (continue this loop of implement, present, validate) ...
14. **After final validation and documentation**, move the task to "Done" in `project_kanban.md` and add a final summary to `thought_process.md`.

By following these instructions, you will provide a clear, auditable, and collaborative development process.

## 5. Diagnostic Step: Getting a Second Opinion

If you are stuck on a problem after multiple attempts, do not continue to try the same approach. Instead, you must use the following diagnostic step to get a second opinion from the GPT-5 model.

1.  **Identify the core problem:** Pinpoint the specific code snippet, error message, or logical flaw that is causing the issue.
2.  **Formulate a question:** Create a clear and concise prompt that includes the problematic code, a description of what you have already tried, and a direct question asking for a new approach.
3.  **Execute the command:** Use the `run_shell_command` tool to execute the following `curl` command. You must replace `"Your detailed prompt here..."` with the question you formulated. Assume the `OPENAI_API_KEY` is available in the environment.

    ```bash
    curl https://api.openai.com/v1/chat/completions \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $OPENAI_API_KEY" \
      -d '{ "model": "gpt-5", "messages": [ { "role": "system", "content": "You are a senior software engineer providing a second opinion on a difficult coding problem. The user is an AI assistant who is stuck. The following prompt contains the code, the error, and the attempted solutions. Please provide a fresh perspective and suggest a new approach directly to the AI assistant." }, { "role": "user", "content": "Your detailed prompt here..." } ] }'
    ```
4.  **Analyze and Proceed:** Carefully analyze the response from GPT-5. Document the suggestion in your `thought_process.md` log, and then use the new insight to inform your next step.