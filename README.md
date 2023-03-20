# Align Inline Comments

A Visual Studio Code extension for aligning the inline trailing comments after code.

This extension aligns inline comments to the rightmost position. It only aligns inline comments placed after the code. Inline comments standing alone on a line will not be aligned. The space between the end of the code and the inline comment is filled/replaced with spaces. Tabs used from the beginning of the line to the end of the code remain untouched.

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Usage
In editor, right-click mouse on supported file type to open Context Menu and then select **Align Inline Comments** command from modification group or open Command Palette (Ctrl+Shift+P) a then type **Align Inline Comments**.

## Supported file type / language ID
* javascript
* powershell
* typescript

## Requirements
None

## Install
Manual install (Requirements: Node.js):
- Download packaged extension .vsix file from [Releases](https://github.com/chrobaktruhlik/align-inline-comments-vscode-extension/releases).
- Make sure you have [Node.js®](https://nodejs.org) installed.
- Open Node.js command prompt and install a command-line tool for packaging, publishing and managing VS Code extensions:<br>
`npm install -g @vscode/vsce`
- To install the extension run:<br>
`code --install-extension align-inline-comments-extension-x.x.x.vsix`

## Release Notes
For more information see [CHANGELOG](CHANGELOG.md) file.

## License
Licensed under the [MIT](LICENSE) License.

## Resource code
https://github.com/chrobaktruhlik/align-inline-comments-vscode-extension
