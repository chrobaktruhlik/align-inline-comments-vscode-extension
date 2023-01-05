"use strict";
// This extension align inline comments to the rightmost position.
// Align only inline comments placed after code. Inline comments standing alone on a line will not align.

const vscode = require("vscode");                                                                             // The module "vscode" contains the VS Code extensibility API.

function smartExpandTabs(tabbedText, tabSize) {
// Smart expand tabs to spaces like editor IDE. Return untabbed (expanded tabs to spaces) text.
// param: 	String: context		String with tabs to expand
//			Number: tabSize		Tab size in spaces

	let offset;                                                                                               // Tab '\t' position in input string.

	while ((offset = tabbedText.indexOf("\t")) != -1) {                                                       // Iterate all tabs.
		tabbedText = tabbedText.replace("\t", " ".repeat(tabSize - offset % tabSize));                        // Smart replace tab with spaces.
	};

	return tabbedText;                                                                                        // Return tab expanded to spaces text.
}


function activate(context) {
// This method is called when your extension is activated. Extension is activated the very first time the command is executed.
// param: {vscode.ExtensionContext} context

	// Use the console to output diagnostic information (console.log) and errors (console.error). This line of code will only be executed once when your extension is activated.
	// console.log("Extension is now active!");

	// The command has been defined in the package.json file. The commandId parameter must match the command field in package.json.
	let disposable = vscode.commands.registerCommand('align-inline-comments.align', function () {
	// The code you place here will be executed every time your command is executed.

		const editor = vscode.window.activeTextEditor;                                                        // The currently active editor.

		if (editor != undefined) {

			let languageId = editor.document.languageId;                                                      // Get the identifier of the language associated with document in currently active editor.
			let tabSize = Number(editor.options.tabSize);                                                     // Get the size in spaces a tab takes.
					
			let commentArr = [];                                                                              // An array of the range: position immediately after code and starting corner mark of the inline comment, used to delete all whitespaces between this. (To replace tabs with spaces.)
			let maxCommentIndex = 0;                                                                          // Index of inline comment at rightmost position after code.

			for(let line = 0; line < editor.document.lineCount; line++) {                                     // For all document lines.

				let match;                                                                                    // Match all characters on line with inline comment between start of line and corner mark of inline comment.
				let curLineText = editor.document.lineAt(line).text;                // The text content of the current line in the editor.

				// 1. Replace all string literals with NUL characters -> Clear flags of fake inline comments in strings.
				// 2. Match all characters from start of line to first inline comment after code.
				// Language ID specific.
				switch	(languageId) {
					case "javascript":
					case "typescript":
						match = curLineText
							.replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, (match) => "\0".repeat(match.length))
							.match(/^(?!\s*\/{2}).*?(?<!:)(?=\/{2})/);
						break;
				
					case "powershell":
						match = curLineText
							.match(/^(?!\s*#).*?(?=#)/);
						break;

					default:
						vscode.window.showErrorMessage("File type '" + languageId + "' is not supported.");   // Display error message box to the user.
						return;
				};

				if (match != null) {                                                                          // Only lines with inline comment after code.

					let originalText = match[0];                                                              // Get code text
					let untabbedText = smartExpandTabs(originalText, tabSize);                                // Smart expand all tabs to spaces.

					maxCommentIndex = Math.max(maxCommentIndex, untabbedText.length);                         // Get rightmost position of inline comment.

					let start = new vscode.Position(line, originalText.trimEnd().length);                     // The position immediately after the code.
					let end = new vscode.Position(line, originalText.length);                                 // Position of starting mark inline comment.
					commentArr.push({
						rangeToDelete: new vscode.Range(start, end),                                          // Range to be deleted (whitespaces).
						tabExpandedSpaces: untabbedText.trimEnd().length - originalText.trimEnd().length      // How many spaces are added to the text in code in the editor current view.
					});
				};
			};

			editor.edit((TextEditorEdit) => {
				commentArr.forEach(el => {
					TextEditorEdit.delete(el.rangeToDelete);                                                  // Delete all whitespaces after last code character and inline comment.
					TextEditorEdit.insert(                                                                    // Insert spaces after code and before inline comment.
						el.rangeToDelete.start,                                                               // Start position
						" ".repeat(maxCommentIndex - el.rangeToDelete.start.character - el.tabExpandedSpaces) // The number of inserted spaces.
					); 
				})
			});	
			
		};
	
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
