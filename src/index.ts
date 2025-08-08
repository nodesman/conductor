#!/usr/bin/env node

import { Command } from 'commander';
import { simpleGit, SimpleGit } from 'simple-git';
import axios from 'axios';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import http from 'http';
import open from 'open';
import portfinder from 'portfinder';

const program = new Command();
const git: SimpleGit = simpleGit();

const CONFIG_DIR = '.codefeed';
const CONFIG_FILE = 'config.json';

interface Config {
  model: string;
}

interface Summary {
    branch: string;
    summary: string;
}

async function runAnalysis(): Promise<Summary[]> {
    const gitRoot = await git.revparse(['--show-toplevel']);
    
    const remotes = await git.getRemotes();
    if (!remotes.some(remote => remote.name === 'origin')) {
        throw new Error("This repository does not have a remote named 'origin'. Please add one to continue.");
    }

    const config = await getConfiguration(gitRoot);
    
    console.log('Fetching latest changes...');
    await git.fetch();

    const branches = await getBranchesToAnalyze();
    const summaries: Summary[] = [];
    
    for (const branch of branches) {
      const remoteBranch = `origin/${branch}`;
      console.log(`\nAnalyzing branch: ${branch}`);

      const latestRemoteHash = await git.revparse([remoteBranch]);
      const sincePoint = await getSincePointFromReflog(branch);

      let diff;
      if (sincePoint && sincePoint !== latestRemoteHash) {
        console.log(`Changes since last pull (${sincePoint.slice(0, 7)})...`);
        diff = await getGitDiff(sincePoint, latestRemoteHash);
      } else {
        console.log('No previous pull found, summarizing last 5 commits...');
        diff = await getGitDiff(`${remoteBranch}~5`, latestRemoteHash);
      }

      if (diff) {
        const summary = await summarizeChanges(config.model, diff, branch);
        summaries.push({ branch, summary });
      } else {
        console.log('No new changes found.');
      }
    }

    if (summaries.length === 0) {
      console.log('\nNo new changes detected on analyzed branches.');
    }
    
    return summaries;
}

async function getSincePointFromReflog(branch: string): Promise<string | null> {
    try {
        const reflog = await git.raw(['reflog', 'show', `origin/${branch}`]);
        const pullLine = reflog.split('\n').find(line => line.includes('pull:'));
        
        if (pullLine) {
            const lines = reflog.split('\n');
            const pullIndex = lines.findIndex(line => line.includes('pull:'));
            if (pullIndex > 0) {
                const prevLine = lines[pullIndex];
                const match = prevLine.match(/^([a-f0-9]+)/);
                if (match) {
                    return match[1];
                }
            }
        }
    } catch (error) {
        // Silently fail
    }
    return null;
}

let server: http.Server | null = null;

program
  .name('codefeed')
  .description('Summarize git changes using AI.')
  .version('1.0.0')
  .action(async () => {
    const startServer = (summaries: Summary[]): Promise<{ server: http.Server, url: string }> => {
        return new Promise(async (resolve) => {
            const port = await portfinder.getPortPromise();
            const html = generateHtml(summaries);
            const serverInstance = http.createServer((req, res) => {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            });
            serverInstance.listen(port, () => {
                const url = `http://localhost:${port}`;
                resolve({ server: serverInstance, url });
            });
        });
    };

    let keepRunning = true;
    while(keepRunning) {
        try {
            const summaries = await runAnalysis();
            if (summaries.length > 0) {
                const serverInfo = await startServer(summaries);
                server = serverInfo.server;
                console.log(`\nReport is available at: ${serverInfo.url}`);

                const { openBrowser } = await inquirer.prompt([{
                    type: 'confirm',
                    name: 'openBrowser',
                    message: 'Open in browser?',
                    default: true
                }]);

                if (openBrowser) {
                    await open(serverInfo.url);
                }
            }
        } catch (error) {
            handleError(error);
        }

        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do next?',
                choices: ['Re-analyze', 'Exit'],
                default: 'Re-analyze',
            },
        ]);

        if (action === 'Exit') {
            keepRunning = false;
        }
        if (server) {
            server.close();
        }
    }
  });

function handleError(error: any) {
    if (axios.isAxiosError(error)) {
        console.error('API Error:', error.response?.data || error.message);
    } else if (error instanceof Error) {
        console.error('Error:', error.message);
    } else {
        console.error('An unknown error occurred.');
    }
}

async function getDefaultBranch(): Promise<string> {
    const remoteInfo = await git.remote(['show', 'origin']);
    if (remoteInfo) {
        const headBranchMatch = remoteInfo.match(/HEAD branch: (.*)/);
        if (headBranchMatch && headBranchMatch[1]) {
            return headBranchMatch[1];
        }
    }
    const branchSummary = await git.branch();
    return branchSummary.current || 'main';
}

async function getBranchesToAnalyze(): Promise<string[]> {
    const currentBranch = await git.revparse(['--abbrev-ref', 'HEAD']);
    const mainBranch = await getDefaultBranch();
    
    const branches = new Set([mainBranch]);
    if (currentBranch !== mainBranch) {
        branches.add(currentBranch);
    }

    return Array.from(branches);
}

async function getConfiguration(gitRoot: string): Promise<Config> {
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
      choices: ['gpt-4', 'gemini-2.5-pro'],
      default: 'gpt-4',
    },
  ]);

  const config: Config = { model: answers.model };
  const configDir = path.join(gitRoot, CONFIG_DIR);

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const configPath = path.join(configDir, CONFIG_FILE);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`Configuration saved to ${configPath}`);

  await addToGitignore(gitRoot);

  return config;
}

async function addToGitignore(gitRoot: string) {
  const gitignorePath = path.join(gitRoot, '.gitignore');
  const ignoreEntry = `\n# codefeed configuration\n.codefeed\n`;

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

async function getGitDiff(from: string, to: string): Promise<string | null> {
  try {
    const diff = await git.diff([`${from}..${to}`]);
    return diff;
  } catch (e) {
    console.warn(`Could not get diff between ${from} and ${to}. It's possible the old commit hash is no longer available.`);
    return null;
  }
}

function isContextLengthError(error: any): boolean {
    if (axios.isAxiosError(error)) {
        const errorCode = error.response?.data?.error?.code;
        if (errorCode === 'context_length_exceeded') {
            return true;
        }
        const errorMessage = error.response?.data?.error?.message;
        if (typeof errorMessage === 'string' && errorMessage.includes('token limit')) {
            return true;
        }
    }
    return false;
}

async function summarizeChanges(model: string, diff: string, branchName: string): Promise<string> {
  const prompt = `
    Please provide a concise, high-level summary of the following git diff for the "${branchName}" branch.
    Focus on the "why" behind the changes, not just the "what".
    Describe the overall impact and purpose of the changes.
    
    Diff:
    ---
    ${diff}
    ---
  `;

  console.log(`Sending request to ${model} for ${branchName}...`);

  const primaryModelFn = model.toLowerCase().startsWith('gpt') ? callGptApi : callGeminiApi;
  const fallbackModelFn = model.toLowerCase().startsWith('gpt') ? callGeminiApi : callGptApi;
  const fallbackModelName = model.toLowerCase().startsWith('gpt') ? 'Gemini' : 'GPT';

  try {
      return await primaryModelFn(prompt);
  } catch (error) {
      if (isContextLengthError(error)) {
          console.warn(`Warning: The diff is too long for ${model}. Attempting fallback with ${fallbackModelName}...`);
          return await fallbackModelFn(prompt);
      }
      throw error;
  }
}

async function callGptApi(prompt: string): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY environment variable is not set.');
    }
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }]
    }, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data.choices[0].message.content.trim();
}

async function callGeminiApi(prompt: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not set.');
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;
    const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }]
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data.candidates[0].content.parts[0].text.trim();
}

function generateHtml(summaries: Summary[]): string {
    const summariesHtml = summaries.map(s => `
        <div class="summary-card">
            <h2>Branch: ${s.branch}</h2>
            <pre>${s.summary.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
        </div>
    `).join('');

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Codefeed Report</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    background-color: #f0f2f5;
                    color: #1c1e21;
                    margin: 0;
                    padding: 2rem;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                }
                h1 {
                    color: #1877f2;
                    text-align: center;
                    margin-bottom: 2rem;
                }
                .summary-card {
                    background-color: #fff;
                    border-radius: 8px;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                h2 {
                    color: #1c1e21;
                    border-bottom: 2px solid #e4e6eb;
                    padding-bottom: 0.5rem;
                    margin-top: 0;
                }
                pre {
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    background-color: #f5f6f8;
                    padding: 1rem;
                    border-radius: 6px;
                    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
                    font-size: 0.9rem;
                    line-height: 1.5;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Codefeed Report</h1>
                ${summariesHtml}
            </div>
        </body>
        </html>
    `;
}

program.parse(process.argv);