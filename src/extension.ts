import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import { getTestCases } from './fetchTestCase';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating extension "rg-cph-leetcode"');

    const fetchTestCasesCommand = vscode.commands.registerCommand('rg-cph-leetcode.getTestCases', async () => {
        console.log('Command "rg-cph-leetcode.getTestCases" triggered');

        const url = await vscode.window.showInputBox({
            placeHolder: "Enter the URL of your Leetcode problem",
            validateInput: (input: string) => {
                const regex = /^(https?:\/\/)(www\.)?leetcode\.com\/problems\/[a-zA-Z0-9-]+(\/.*)?$/;
                return regex.test(input) ? null : 'Please enter a valid LeetCode problem URL';
            },
        });

        if (!url) {
            vscode.window.showErrorMessage("URL is required");
            console.log("No URL provided");
            return;
        }

        const languages = ["C++", "Python"];
        const selectedLanguage = await vscode.window.showQuickPick(languages, {
            placeHolder: "Select a programming language",
        });

        if (!selectedLanguage) {
            vscode.window.showErrorMessage("Language selection is required");
            console.log("No language selected");
            return;
        }

        try {
            console.log("Fetching test cases for URL:", url);
            await getTestCases(url);
            vscode.window.showInformationMessage("Test cases fetched successfully!");

            const inputFiles = await vscode.workspace.findFiles('**/inputs.txt', '**/node_modules/**', 1);
            if (inputFiles.length === 0) {
                vscode.window.showErrorMessage("inputs.txt file not found in the workspace.");
                console.log("inputs.txt file not found");
                return;
            }

            const inputFileUri = inputFiles[0];
            const folderPath = path.dirname(inputFileUri.fsPath);
            const solutionFileName = `solution.${getFileExtension(selectedLanguage)}`;
            const solutionFilePath = path.join(folderPath, solutionFileName);
            const starterCode = getStarterCode(selectedLanguage);

            await vscode.workspace.fs.writeFile(vscode.Uri.file(solutionFilePath), Buffer.from(starterCode, 'utf8'));
            const document = await vscode.workspace.openTextDocument(vscode.Uri.file(solutionFilePath));
            await vscode.window.showTextDocument(document);

        } catch (error: any) {
            vscode.window.showErrorMessage(`Error fetching test cases: ${error.message}`);
            console.error("Error fetching test cases:", error.message);
        }
    });

    const runAndCompareCommand = vscode.commands.registerCommand('rg-cph-leetcode.runAndCompare', async () => {
        console.log('Command "rg-cph-leetcode.runAndCompare" triggered');
        try {
            const inputFiles = await vscode.workspace.findFiles('**/inputs.txt', '**/node_modules/**', 1);
            const outputFiles = await vscode.workspace.findFiles('**/outputs.txt', '**/node_modules/**', 1);

            if (inputFiles.length === 0 || outputFiles.length === 0) {
                vscode.window.showErrorMessage("inputs.txt or outputs.txt file not found in the workspace.");
                console.log("inputs.txt or outputs.txt file not found");
                return;
            }

            const inputFilePath = inputFiles[0].fsPath;
            const outputFilePath = outputFiles[0].fsPath;

            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor) {
                vscode.window.showErrorMessage("No active editor found.");
                console.log("No active editor found");
                return;
            }

            const language = getLanguageFromExtension(activeEditor.document.languageId);
            console.log(activeEditor.document.languageId);
            const userFilePath = activeEditor.document.uri.fsPath;

            if (!language) {
                vscode.window.showErrorMessage("Unsupported language for execution.");
                console.log("Unsupported language for execution");
                return;
            }

            function normalizeOutput(output: string): string {
                return output
                    .split(/\r?\n/) // Split into lines, handle different newline formats
                    .map(line => line.trim()) // Trim spaces from each line
                    .filter(line => line !== "") // Remove blank lines
                    .join("\n"); // Join back with a consistent newline
            }

            const output = normalizeOutput(await runUserCode(userFilePath, inputFilePath, language));
            const expectedOutput = normalizeOutput(await fs.readFile(outputFilePath, 'utf8'));

            if (output === expectedOutput) {
                vscode.window.showInformationMessage("Test case passed!");
                console.log("Test case passed");
            } else {
                vscode.window.showErrorMessage(`Test case failed.\nExpected:\n${expectedOutput}\n\nReceived:\n${output}`);
                console.log(`Test case failed.\nExpected:\n${expectedOutput}\n\nReceived:\n${output}`);
            }
        } catch (error: any) {
            vscode.window.showErrorMessage(`Error: ${error.message}`);
            console.error("Error:", error.message);
        }
    });

    context.subscriptions.push(fetchTestCasesCommand, runAndCompareCommand);
    console.log('Extension "cph-leetcode" activated');
}

async function runUserCode(filePath: string, inputFilePath: string, language: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const command = getRunCommand(filePath, inputFilePath, language);
        if (!command) {
            reject(new Error("Unsupported language"));
            return;
        }

        exec(command, (error, stdout, stderr) => {
            if (error || stderr) {
                reject(new Error(stderr));
                return;
            }
            resolve(stdout.trim());
        });
    });
}

function getRunCommand(filePath: string, inputFilePath: string, language: string): string | null {
    switch (language) {
        case "C++":
            return `g++ "${filePath}" -o "${filePath}.exe" && "${filePath}.exe" < "${inputFilePath}"`;
        case "Python":
            return `python "${filePath}" < "${inputFilePath}"`;
        default:
            return null;
    }
}

function getFileExtension(language: string): string {
    switch (language) {
        case "C++": return "cpp";
        case "Python": return "py";
        default: return "txt";
    }
}

function getStarterCode(language: string): string {
    switch (language) {
        case "C++": return `#include <bits/stdc++.h>\nusing namespace std;\nusing llu = unsigned long long;\nusing ll = long long;\nusing ld = long double;\nusing vl = vector<ll>;\nusing sl = set<ll>;\nusing msl = multiset<ll>;\nusing ma = map<ll, ll>;\nusing vvl = vector<vector<ll>>;\nusing vp = vector<pair<ll, ll>>;\nusing sp = set<pair<ll, ll>>;\nusing msp = multiset<pair<ll, ll>>;\n\nint main()\n{\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    cout.tie(NULL);\n          // Start your code here\n    return 0;\n}`;
        case "Python": return `# Write your code here\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()`;
        default: return "// Unsupported language";
    }
}

function getLanguageFromExtension(extension: string): string | null {
    switch (extension) {
        case "cpp": return "C++";
        case "python": return "Python";
        default: return null;
    }
}

export function deactivate() {}
