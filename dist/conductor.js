#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const args = process.argv.slice(2);
if (args.length === 0) {
    // No arguments, print the main task management prompt.
    const promptPath = path.join(__dirname, '../gemini_task_management_prompt.md');
    try {
        const prompt = fs.readFileSync(promptPath, 'utf-8');
        console.log(prompt);
    }
    catch (error) {
        console.error('Error reading the prompt file:', error);
        process.exit(1);
    }
}
else {
    const command = args[0];
    if (command === '--contextualize') {
        if (args.length < 2) {
            console.error('Error: --contextualize requires at least one file path and a final prompt string.');
            process.exit(1);
        }
        const filePaths = args.slice(1, -1);
        const userRequest = args[args.length - 1];
        let fileContents = '';
        for (const filePath of filePaths) {
            try {
                const absolutePath = path.resolve(filePath);
                const content = fs.readFileSync(absolutePath, 'utf-8');
                fileContents += `--- FILE: ${filePath} ---
${content}

`;
            }
            catch (error) {
                console.error(`Error reading file: ${filePath}`, error);
                process.exit(1);
            }
        }
        const promptLines = [
            "Hello. Before you respond to the user's request, you must first perform a critical analysis of the following files to understand the existing codebase.",
            "",
            "**Analyze these files for context:**",
            "",
            fileContents,
            "**Your Analysis Task:**",
            "",
            "Based on the files provided, please answer the following questions for your own understanding:",
            "1.  What are the primary libraries and frameworks in use (e.g., axios, zod, etc.)?",
            "2.  What are the established coding patterns (e.g., async/await, functional programming, specific class structures)?",
            "3.  What are the naming conventions for variables, functions, and types?",
            "4.  Are there any existing helper functions or utilities that I should reuse?",
            "",
            "Once you have completed this internal analysis and understand the project's context, please proceed with the user's original request below. Ensure your response strictly adheres to the patterns and conventions you have identified.",
            "",
            "**User's Request:**",
            "",
            `"${userRequest}"`
        ];
        console.log(promptLines.join('\n'));
    }
    else if (command === 'add-story') {
        const storyDescriptionIndex = args.findIndex(arg => !arg.startsWith('--'));
        const storyDescription = args[storyDescriptionIndex];
        const epicIndex = args.findIndex(arg => arg === '--epic');
        const epic = epicIndex !== -1 && args.length > epicIndex + 1 ? args[epicIndex + 1] : 'Unassigned';
        if (!storyDescription) {
            console.error('Error: The add-story command requires a story description.');
            console.error('Example: conductor add-story "As a user, I want to see my profile" --epic "User Management"');
            process.exit(1);
        }
        const sanitized = storyDescription.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
        const storyFileName = `docs/stories/${sanitized.slice(0, 50)}.md`;
        const storyTitle = storyDescription.replace(/As a .*?, I want to /i, '');
        const templatePath = path.join(__dirname, '..', 'templates', 'story_template.md');
        let storyContent = fs.readFileSync(templatePath, 'utf-8');
        storyContent = storyContent.replace('{{STORY_TITLE}}', storyTitle);
        const kanbanPath = 'project_kanban.md';
        const newBacklogItem = `- [ ] ${storyTitle} (Epic: ${epic}) - see ${storyFileName}`;
        const promptLines = [
            "Hello! I need to add a new user story to my project. Please perform the following two steps carefully.",
            "",
            "**Step 1: Create the Story Document**",
            "",
            `First, please create a new file named \`${storyFileName}\`.`,
            "",
            "Populate this new file with the following content. Based on the initial user story, please flesh out the \"Acceptance Criteria\" and \"Value Proposition\" sections with sensible, detailed information.",
            "",
            "```markdown",
            storyContent,
            "---",
            `*Initial User Story:* "${storyDescription}"`,
            "```",
            "",
            "**Step 2: Update the Kanban Board**",
            "",
            "After creating the story file, you must update the main Kanban board.",
            "",
            `1. Read the file ${kanbanPath}.`,
            "2. Find the line that says ## backlog.",
            "3. Add the following new line directly underneath it:",
            "```",
            `${newBacklogItem}`,
            "```",
            `4. Save the modified ${kanbanPath} file.`,
            "",
            "Please ensure both steps are completed."
        ];
        console.log(promptLines.join('\n'));
    }
    else if (command === 'init') {
        const projectName = path.basename(process.cwd());
        const templatesDir = path.join(__dirname, '..', 'templates');
        const filesToCreate = {
            'project_kanban.md': 'project_kanban.md',
            'README.md': 'README.md',
            'CHANGELOG.md': 'CHANGELOG.md',
        };
        let prompt = `Please perform the following file creation operations to scaffold the project named "${projectName}". Create each file with the exact content provided.\n\n`;
        for (const [templateFile, outputFile] of Object.entries(filesToCreate)) {
            try {
                const templatePath = path.join(templatesDir, templateFile);
                let content = fs.readFileSync(templatePath, 'utf-8');
                content = content.replace(/\{\{PROJECT_NAME\}\}/g, projectName);
                if (templateFile === 'project_kanban.md') {
                    content = content.replace(/PROJECT_NAME_HERE/g, projectName);
                }
                const promptPart = [
                    '---',
                    `**Create the file \\\`${outputFile}\\\\\`**`,
                    'Please create this file with the following content:',
                    '```markdown',
                    content,
                    '```',
                    '---',
                    ''
                ].join('\n');
                prompt += promptPart;
            }
            catch (error) {
                console.error(`Error processing template file: ${templateFile}`, error);
                process.exit(1);
            }
        }
        console.log(prompt);
    }
    else {
        console.log(`Command '${command}' is not yet implemented.`);
    }
}
