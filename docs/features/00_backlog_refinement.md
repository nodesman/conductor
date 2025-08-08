# 00: Backlog Refinement & Verification

## The Principle: Think, Then Act

The single most significant source of wasted engineering effort is building the wrong thing, or building the right thing in a needlessly complex way. Before any story is considered "ready for development," it must undergo a rigorous, structured analysis to ensure it is valuable, necessary, and well-understood.

This "Backlog Refinement" phase is a mandatory first step in the Conductor workflow. Its purpose is to use the AI not as a code generator, but as a skeptical, analytical partner to critique and strengthen the problem statement itself.

## The Goal

The goal is to create a verifiable, machine-readable record of the analysis for every epic or significant story. This record serves as a "certificate of analysis," proving that the story has been vetted against a standard checklist.

This process ensures that:
- **The "Why" is Clear:** The justification and value proposition are explicitly stated and challenged.
- **Alternatives are Considered:** We avoid tunnel vision by forcing a brief exploration of alternative solutions.
- **The Scope is Understood:** The problem is clearly defined, and its boundaries are established before implementation begins.

## The Standardized Format

To enforce this, `conductor` will generate a standardized analysis document for each story. This document, stored in the `/docs/analysis/` directory, will follow a strict template. It includes a checklist that the AI must complete and a status field (`Verified: [Yes/No]`) that serves as a gate for development.

Only a story that has a corresponding, `Verified: Yes` analysis document is considered truly "To Do." This creates a clear, auditable trail of critical thinking and prevents half-baked ideas from entering the development cycle.