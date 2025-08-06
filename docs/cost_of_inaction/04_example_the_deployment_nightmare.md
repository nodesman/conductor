# Example: The Deployment Nightmare

## The Scenario

A developer is building a data processing pipeline. They tell the AI, "Write a script that downloads a file from an FTP server, processes it, and saves the result to a local directory."

The AI generates a perfectly functional Python script that uses a large, multi-megabyte data science library (like Pandas) and writes its output to `/tmp/output.csv`. The script works flawlessly on the developer's machine.

However, the developer's intended deployment target is **AWS Lambda**, a serverless environment with strict limitations:
*   A small, temporary `/tmp` directory (512MB).
*   A limited deployment package size (a few hundred MB).
*   A short execution timeout (e.g., 15 minutes).

## The Cost

1.  **Works Locally, Fails in Production:** The developer attempts to deploy the script to AWS Lambda. The deployment fails immediately because the dependency library (Pandas) is too large for the Lambda package size limit.

2.  **The "It Works On My Machine" Problem:** The developer is now stuck. The code the AI wrote is logically correct but architecturally incompatible with the target environment.

3.  **Forced Architectural Rework:** The developer must now manually rewrite the script, making significant changes:
    *   **Dependency Removal:** They have to replace the heavy Pandas library with lighter, built-in Python modules for file parsing, drastically increasing the complexity of their own code.
    *   **State Management:** They can no longer write to a local file system. They must refactor the code to stream the output directly to a service like Amazon S3.
    *   **Timeout Issues:** If the processing is long, they may need to break the single script into a multi-step workflow using AWS Step Functions.

4.  **Lost Time and Increased Complexity:** A simple script has now become a complex, distributed system. The developer has wasted significant time debugging an issue that has nothing to do with the core logic and everything to do with an unstated deployment constraint.

## How the Scaffolder Helps

The Scaffolder would have asked: *"How will the project be deployed? (e.g., AWS, Vercel, Docker)"*.

By answering "AWS Lambda," the developer provides critical context. The AI would then know from the outset to:
*   Avoid large, heavy dependencies.
*   Use services like S3 for storage instead of the local filesystem.
*   Write code that is mindful of execution time limits.

This forethought prevents the deployment nightmare entirely, ensuring the generated code is not just functionally correct, but also architecturally sound for its intended environment.
