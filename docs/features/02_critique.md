# Feature: `g-task --critique`

## 1. The Problem

AI assistants are eager to please and will often jump directly into generating a solution without questioning the premise of the request. This encourages hasty development and "over-building," failing to prevent unnecessary work.

As the article notes: *"Notably, AI coding assistants do very little to prevent unnecessary work. On the contrary, AI often seems to encourage hastiness and over-building."*

## 2. The Solution

The `--critique` command instructs the AI to adopt the persona of a skeptical, experienced senior engineer. Its primary goal is not to *solve* the problem, but to *question* it.

It takes a feature specification (as a file or string) and generates a prompt that asks the AI to challenge the request, identify potential edge cases, and propose simpler, more efficient alternatives.

## 3. Example Usage

```bash
# The user has a spec for a new feature and wants the AI to challenge it.
g-task --critique docs/new_feature_spec.md | gemini
```

## 4. Generated Prompt Example

```text
Hello. Your role is not to implement the following feature request. Instead, your role is to act as a skeptical, pragmatic, and experienced senior software engineer. Your goal is to prevent unnecessary work and reduce complexity.

Please read the following feature specification carefully.

--- FEATURE SPECIFICATION ---
// ... content of docs/new_feature_spec.md ...

**Your Critique Task:**

Please provide a critical review of this feature specification. Address the following points in your review:
1.  **Core Justification:** Is the "why" behind this feature clear and compelling? Is it solving a real, valuable user problem?
2.  **Complexity vs. Value:** Does the proposed solution seem overly complex for the value it delivers?
3.  **Alternative Solutions:** Can you propose one or more significantly simpler alternatives that would achieve 80% of the value with 20% of the effort?
4.  **Unforeseen Consequences:** What are the potential hidden costs, maintenance burdens, or negative side-effects of building this feature as specified?
5.  **Recommendation:** What is your final recommendation? (e.g., "Proceed as specified," "Implement the simpler alternative," "Reject this feature for now").

Provide your response as a structured critique. Do not write any implementation code.
```
