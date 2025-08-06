import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import { questions } from './questions.js';

const CONTEXT_DIR = 'context';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const scaffold = async () => {
  console.log("Welcome to the Gemini Scaffolder!");
  console.log("I will ask you a series of questions to create a context for your project.");
  console.log("Your answers will be saved as markdown files in the 'context' directory.");
  console.log("----------------------------------------------------------------------");

  if (!fs.existsSync(CONTEXT_DIR)) {
    fs.mkdirSync(CONTEXT_DIR);
  }

  for (const item of questions) {
    const answer = await askQuestion(`${item.question} `);
    const filePath = path.join(CONTEXT_DIR, item.fileName);
    fs.writeFileSync(filePath, `# ${item.question}\n\n${answer}\n`);
    console.log(`✅ Saved: ${filePath}`);
  }

  console.log("----------------------------------------------------------------------");
  console.log("All questions answered. The context has been saved in the 'context' directory.");
  rl.close();
};

scaffold().catch((err) => {
  console.error("An error occurred:", err);
  rl.close();
});