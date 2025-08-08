# Feature: `conductor --contextualize`

## 1. The Problem

LLMs often generate code that is generic and disconnected from the specific realities of a codebase. They fail to use existing helper functions, adhere to established patterns, or use the correct libraries, leading to code that is inconsistent and requires significant refactoring.

As the article states: *"AIs still struggle to absorb the context of a larger codebase... If you use a library that isn't StackOverflow's favorite it will butcher it."*

## 2. The Solution

The `--contextualize` command is designed to combat this by forcing the AI to first learn from relevant parts of the existing codebase before attempting to write new code.

It will take a list of file paths as arguments. It will then read the content of these files and construct a prompt that instructs the AI to analyze them for patterns, conventions, and available utilities before proceeding with the user's primary request.

## 3. Example Usage

```bash
# The user wants the AI to write a new function in 'src/utils.ts'
# They provide existing files for context.
conductor --contextualize src/api.ts src/types.ts "write a function to fetch user data" | gemini
```

## 4. Generated Prompt Example

```text
Hello. Before you respond to the user's request, you must first perform a critical analysis of the following files to understand the existing codebase.

**Analyze these files for context:**

--- FILE: src/api.ts ---
// ... content of api.ts ...

--- FILE: src/types.ts ---
// ... content of types.ts ...

**Your Analysis Task:**

Based on the files provided, please answer the following questions for your own understanding:
1.  What are the primary libraries and frameworks in use (e.g., axios, zod, etc.)?
2.  What are the established coding patterns (e.g., async/await, functional programming, specific class structures)?
3.  What are the naming conventions for variables, functions, and types?
4.  Are there any existing helper functions or utilities that I should reuse?

Once you have completed this internal analysis and understand the project's context, please proceed with the user's original request below. Ensure your response strictly adheres to the patterns and conventions you have identified.

**User's Request:**

"write a function to fetch user data"
```
