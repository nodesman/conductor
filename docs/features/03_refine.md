# Feature: `conductor --refine`

## 1. The Problem

The first draft of AI-generated code is often flawed. It can contain subtle bugs, security vulnerabilities, or simply fail to meet the quality and style standards of the project.

As the article puts it: *"What LLMs produce is often broken, hallucinated, or below codebase standards."*

## 2. The Solution

The `--refine` command is designed for iterative improvement. It takes a piece of generated code and asks the AI to review its *own* work against a checklist of quality criteria.

This creates a feedback loop where the AI is forced to transition from a "generator" to a "reviewer," catching its own mistakes before a human has to.

## 3. Example Usage

```bash
# The user has some AI-generated code and wants to improve it.
conductor --refine generated_code.js | gemini
```

## 4. Generated Prompt Example

```text
Hello. You are now in "Refinement Mode." Your task is to act as a meticulous code reviewer for the code provided below. Do not add new features. Your only goal is to improve the quality of the existing code.

--- CODE TO REVIEW ---
// ... content of generated_code.js ...

**Your Refinement Checklist:**

Please analyze and, if necessary, rewrite the code to address the following points:
1.  **Security:** Are there any potential security vulnerabilities (e.g., injection attacks, improper handling of secrets, etc.)?
2.  **Bugs & Edge Cases:** Are there any obvious bugs? Does the code handle edge cases gracefully (e.g., null inputs, empty arrays)?
3.  **Readability & Maintainability:** Is the code clear, well-documented, and easy for another human to understand? Are variable names meaningful?
4.  **Project Conventions:** (You may not have this context, but do your best) Does this code appear to follow standard conventions for this language or framework? If you see anything that looks like a non-standard pattern, flag it.
5.  **Simplicity:** Can any part of this code be made simpler or more efficient without sacrificing functionality?

Provide a new version of the code with your improvements integrated. Include a brief summary of the changes you made and why.
```
