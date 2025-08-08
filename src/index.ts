#!/usr/bin/env node

import { Command } from 'commander';
import { simpleGit, SimpleGit } from 'simple-git';
import axios from 'axios';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

const program = new Command();
const git: SimpleGit = simpleGit();

const CONFIG_DIR = '.codefeed';
const CONFIG_FILE = 'config.json';

interface Config {
  model: string;
}

program
  .name('codefeed')
  .description('Summarize git changes using AI.')
  .version('1.0.0')
  .action(async () => {
    try {
      const config = await getConfiguration();
      console.log(`Using model: ${config.model}`);
      
      console.log('Analyzing repository...');
      const summary = await summarizeChanges(config.model);
      
      console.log('\n--- Git Changes Summary ---');
      console.log(summary);
      console.log('-------------------------\n');

    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  });

async function getConfiguration(): Promise<Config> {
  const gitRoot = await git.revparse(['--show-toplevel']);
  const configPath = path.join(gitRoot, CONFIG_DIR, CONFIG_FILE);

  if (fs.existsSync(configPath)) {
    const configData = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configData);
  } else {
    return await firstRunSetup(gitRoot);
  }
}

async function firstRunSetup(gitRoot: string): Promise<Config> {
  console.log('First run detected. Setting up codefeed...');

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'model',
      message: 'Which AI model would you like to use by default?',
      choices: ['gpt-5', 'gemini-2.5'],
      default: 'gpt-5',
    },
  ]);

  const config: Config = { model: answers.model };
  const configDir = path.join(gitRoot, CONFIG_DIR);

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
  }

  const configPath = path.join(configDir, CONFIG_FILE);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`Configuration saved to ${configPath}`);

  await addToGitignore(gitRoot);

  return config;
}

async function addToGitignore(gitRoot: string) {
  const gitignorePath = path.join(gitRoot, '.gitignore');
  const ignoreEntry = `
# codefeed configuration
.codefeed
`;

  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
    if (!gitignoreContent.includes('.codefeed')) {
      fs.appendFileSync(gitignorePath, ignoreEntry);
      console.log('Added .codefeed to .gitignore');
    }
  } else {
    fs.writeFileSync(gitignorePath, ignoreEntry);
    console.log('Created .gitignore and added .codefeed entry.');
  }
}


async function getGitDiff(): Promise<string> {
  const diff = await git.diff(['HEAD~1..HEAD']);
  if (!diff) {
    return 'No changes found in the last commit.';
  }
  return diff;
}

async function summarizeChanges(model: string): Promise<string> {
  const diff = await getGitDiff();

  if (diff.startsWith('No changes')) {
    return diff;
  }

  const prompt = `
    Please provide a concise summary of the following git diff.
    Focus on the "why" behind the changes, not just the "what".
    Describe the overall impact of the changes.
    
    Diff:
    ---
    ${diff}
    ---
  `;

  console.log(`Sending request to ${model}...`);

  if (model.toLowerCase() === 'gpt-5') {
    return `(Placeholder) Summary from GPT-5 for the changes.`;
  } else {
    return `(Placeholder) Summary from Gemini 2.5 for the changes.`;
  }
}

program.parse(process.argv);