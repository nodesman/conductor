# Gemini Prompt Scaffolding CLI

This project is a command-line interface (CLI) tool designed to help software engineers use Google's Gemini more effectively and thoughtfully.

## The Problem

As outlined in the article "[No, AI is not Making Engineers 10x as Productive](https://colton.io/p/no-ai-is-not-making-engineers-10x-as-productive)", naively using Large Language Models (LLMs) for software development can lead to several problems:
-   Lack of deep codebase context.
-   Tendency to encourage hasty, poorly-architected solutions.
-   Failure to prevent unnecessary work.
-   Creation of code that violates project standards and best practices.

This tool aims to mitigate these problems.

## The Solution

This CLI does not call the Gemini API directly. Instead, it acts as a "prompt generator" or "scaffolder". Its only role is to **generate sophisticated, context-aware prompts and print them to standard output.**

The user can then pipe these carefully constructed prompts into the `gemini` CLI.

```bash
# Example Usage (conceptual)
g-task --generate-critique-prompt <feature.md | gemini
```

By focusing on prompt generation, we can create a library of prompt strategies that encourage the AI to:
-   Think more critically about a problem.
-   Adhere to the specific context of a codebase.
-   Consider trade-offs and alternative solutions.
-   Prevent unnecessary work by analyzing requirements more deeply.

This tool is an experiment in using AI to augment engineering intelligence, not just to generate code.

## Cross-Project Intelligence and Task Management

Beyond generating prompts for code-level tasks, this project also establishes a standardized structure for managing multiple projects. The goal is to enable a centralized tool, potentially powered by Gemini, to read, understand, and reason about the status and priorities of all your projects at a high level.

This is achieved through a set of template files located in the `/templates` directory. By placing these files in the root of every project, you create a consistent, machine-readable footprint that the central tool can use to gather insights.

### The Template Files

1.  **`project_kanban.md`**: This is the most critical file and serves as the single source of truth for a project's status.
    *   **YAML Front-Matter**: The file begins with a YAML block containing key metadata:
        *   `project_name`: The official name of the project.
        *   `status`: The current state (e.g., `active`, `on-hold`, `completed`).
        *   `priority`: A numerical priority (e.g., 1-5).
        *   `owner`: The person or team responsible.
        *   `tags`: Keywords for filtering and categorization.
    *   **Kanban Board**: The body of the file is a simple Markdown-based Kanban board (`backlog`, `todo`, `in-progress`, `done`) to track specific tasks.

2.  **`README.md`**: The standard project README, providing a high-level overview and setup instructions. It's designed to give a human reader immediate context.

3.  **`CHANGELOG.md`**: A structured log of notable changes, decisions, and milestones, helping to track the project's evolution over time.

By standardizing this information, a future script or Gemini-powered agent can parse these files across all your project directories to build a comprehensive dashboard, suggest priorities, and help you decide what to work on next.

## Workflow Commands

To support this system, `g-task` provides commands to handle the clerical work.

### `g-task init`

When run in a project's root directory, this command generates a prompt for Gemini to create the foundational tracking files (`project_kanban.md`, `README.md`, `CHANGELOG.md`) based on the templates.

```bash
# Run from your project's root directory
g-task init | gemini
```

### `g-task add-story`

This command automates the process of adding a new story to your project. It generates a multi-step prompt for Gemini that does two things:
1.  Creates a detailed story document in `/docs/stories/` based on `templates/story_template.md`.
2.  Adds a corresponding one-line task to the `project_kanban.md` backlog, linking to the new story document.

**Usage:**
```bash
g-task add-story "Your one-line story description here" --epic "Name of the Epic" | gemini
```

This ensures that every new piece of work is properly documented and tracked from its inception.
