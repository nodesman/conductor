# Conductor: A Manual for AI-Guided Development

`conductor` is not just a prompt generator; it's an opinionated workflow engine for guiding AI in software engineering. It establishes a set of conventions—"the rails"—for interacting with a Large Language Model (LLM) to solve common development tasks.

By using `conductor` to orchestrate your interactions, you guide the AI to be a more effective thought partner, ensuring a structured and high-quality development process.

## The Core Workflow

The `conductor` commands are designed to be chained together to mirror a thoughtful software development lifecycle. A typical workflow might look like this:

### 1. Problem Analysis & Critique (`--critique`)

Before you write a single line of code, question the problem itself. Is this feature necessary? Is there a simpler way? Use `--critique` to have the AI challenge your assumptions.

**Usage:**
```bash
# Ask the AI to act as a skeptical senior engineer and critique your feature idea.
conductor --critique "We should build a real-time notification system for user comments." | gemini
```
**Outcome:** A structured critique that helps you validate, refine, or even discard the idea, saving you from building the wrong thing.

### 2. Planning & Structuring (`--plan`)

Once the idea is validated, create a detailed implementation plan *before* writing code. This forces you to think through the architecture and provides a clear roadmap for the AI.

**Usage:**
```bash
# Ask the AI to create a step-by-step implementation plan for the feature.
conductor --plan "Feature: Real-time notifications for comments" | gemini
```
**Outcome:** A detailed, reviewable plan that breaks the problem into manageable, testable steps. This is your new, well-defined user story.

### 3. Context-Aware Implementation (`--contextualize`)

Now you can start generating code, but ensure the AI is aware of your project's specific conventions. For each step in your plan, provide relevant files for context.

**Usage:**
```bash
# For Step 2 of your plan, provide the API and types files for context.
conductor --contextualize src/api.ts src/types.ts "Implement the API endpoint from Step 2 of the plan" | gemini
```
**Outcome:** Code that is more likely to use your existing helpers, match your style, and integrate cleanly with your codebase.

### 4. Iterative Refinement (`--refine`)

The AI's first draft is rarely perfect. Use `--refine` to have the AI review and improve its own output, catching bugs and quality issues before you do.

**Usage:**
```bash
# Ask the AI to review the code it just generated for bugs and security flaws.
conductor --refine <path/to/generated_code.js> | gemini
```
**Outcome:** Higher-quality, more secure, and more maintainable code.

By following this workflow, you remain in control. You use the AI not as a magic black box, but as a powerful tool for critical thinking, planning, and execution.