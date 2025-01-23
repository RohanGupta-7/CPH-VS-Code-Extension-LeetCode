# rg-cph-leetcode

The rg-cph-leetcode extension bridges the gap between LeetCode and the CPH (Competitive Programming Helper) VS Code extension, enabling users to fetch problem test cases directly from LeetCode and run their code locally against these test cases. This extension is particularly useful for those who prefer working offline or debugging their solutions locally without submitting code to LeetCode.

## Features

### 1. Automated Test Case Fetching

Fetches problem test cases directly from LeetCode problem URLs.

Parses the problem description to extract all test cases, including input and expected output.

Handles problems with multiple test cases seamlessly.

Stores test cases in structured files for local use:

Input Files: inputs.txt

Output Files: outputs.txt

### 2. Local Code Execution

Allows users to write and test their solutions in their preferred programming language.

Supports running code against the fetched test cases locally.

Compares actual outputs with expected outputs and highlights discrepancies for easy debugging.

### 3. Multi-Language Support

Supports multiple programming languages, including but not limited to:

* Python

* C++

Provides customizable compile and run commands for each supported language.

### 4. Exclusion of Code Submission Feature

Does not include any functionality to submit code to LeetCode, ensuring focus on local testing and debugging.

## Requirements

To use rg-cph-leetcode, ensure the following prerequisites are met:

* VS Code: Version 1.65.0 or higher.

* CPH Extension: Installed and configured in VS Code.

* Internet Access: Required for fetching test cases from LeetCode.

* Programming Language Compilers/Interpreters:

* Python: Python 3.x installed and added to PATH.

* C++: GCC or any standard C++ compiler installed.

### Extension Settings

The extension contributes the following settings that can be customized:

### Language-Specific Configurations

C++ Configuration Example

{
  "cph.language.cpp.compile": "g++ -std=c++17 -o $fileNameWithoutExt $fileName",
  "cph.language.cpp.run": "./$fileNameWithoutExt"
}

Python Configuration Example

{
  "cph.language.python.run": "python $fileName"
}

### Test Case Management

Test Case Directory: Specify the folder where input and output test case files are stored.

Custom Test Cases: Users can manually add or edit test cases for further testing.

## User Workflow

### 1. Fetching Problem Test Cases

Run the command CPH: Fetch Test Cases.

Enter the LeetCode problem URL in the input prompt.

The extension parses the problem description and extracts test cases.

Test cases are saved locally in the specified directory.

### 2. Writing and Testing Code

Write your solution in your preferred programming language.

Run the command CPH: Run Test Cases to execute your solution against the fetched test cases.

### 3. Viewing Results

The extension compares the actual outputs of your solution with the expected outputs.

Highlights any mismatches for easier debugging.

## Known Issues

### Test Case Fetching Errors:

Some problem descriptions may have non-standard formats, leading to parsing failures.

Ensure the problem URL is accessible and publicly available.

### Multi-Language Support:

The default configurations may need adjustments for less commonly used languages.

### File Path Conflicts:

Avoid using directories with restricted permissions for storing test cases.

## Release Notes

### 1.0.0

Initial release of rg-cph-leetcode.

Added features for fetching test cases, executing solutions locally, and comparing outputs.

Supported languages: Python, C++.

### 1.1.0

Improved error handling for test case fetching.

Added support for customizable test case directories.

Enhanced multi-language support.
