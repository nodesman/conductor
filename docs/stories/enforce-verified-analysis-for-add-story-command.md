# Story: Enforce Verified Analysis for `add-story` Command

## Value Proposition

As a project lead, I want the `add-story` command to be gated by a successful analysis, so that I can enforce a high standard of quality and due diligence for all new features, preventing wasted effort on ill-defined ideas.

## Acceptance Criteria

1.  **Given** a story description,
    **When** the `add-story` command is run,
    **And** a corresponding analysis file does not exist in `docs/analysis/`,
    **Then** the command must fail with a clear error message instructing the user to run `conductor analyze-story` first.

2.  **Given** a story description,
    **When** the `add-story` command is run,
    **And** a corresponding analysis file exists but its status is `Unverified`,
    **Then** the command must fail with an error message indicating the story has not yet been verified.

3.  **Given** a story description,
    **When** the `add-story` command is run,
    **And** a corresponding analysis file exists and its status is `Verified`,
    **Then** the command must succeed, creating the story document and updating the Kanban board.

## Epic

Workflow Enforcement
