"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const questions_1 = require("./questions");
const CONTEXT_DIR = 'context';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const askQuestion = (query) => {
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
    for (const item of questions_1.questions) {
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
//# sourceMappingURL=run.js.map