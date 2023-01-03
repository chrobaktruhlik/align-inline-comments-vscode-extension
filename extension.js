"use strict";
// This extension align inline comments to the rightmost position.
// Align only inline comments placed after code. Inline comments standing alone on a line will not align.

const vscode = require("vscode"); // The module "vscode" contains the VS Code extensibility API.

function smartExpandTabs(tabbedText, tabSize) {
// Smart expand tabs to spaces.

	let offset;

	while ((offset = tabbedText.indexOf("\t")) != -1) {
		tabbedText = tabbedText.replace("\t", "@".repeat(tabSize - offset % tabSize));
	};
//console.log(tabbedText)
	return tabbedText;
}



// This method is called when your extension is activated. Extension is activated the very first time the command is executed.
function activate(context) {
// param: {vscode.ExtensionContext} context

	// Use the console to output diagnostic information (console.log) and errors (console.error). This line of code will only be executed once when your extension is activated.
	// console.log("Extension is now active!");

	// The command has been defined in the package.json file. The commandId parameter must match the command field in package.json.
	let disposable = vscode.commands.registerCommand('align-inline-comments.align', function () {
		// The code you place here will be executed every time your command is executed.

		const editor = vscode.window.activeTextEditor; // The currently active editor.

		if (editor != undefined) {

			let languageId = editor.document.languageId;		// Get the identifier of the language associated with document in currently active editor.
			let tabSize = Number(editor.options.tabSize);				// Get the size in spaces a tab takes.
					
			let commentArr = []; 								// An array of the range: position immediately after code and starting corner mark of the inline comment, used to delete all whitespaces between this. (To replace tabs with spaces.)
			let maxCommentIndex = 0; // Index of inline comment at rightmost position after code.

			for(let line = 0; line < editor.document.lineCount; line++) {		// For all document lines.

				let match; 								// Match all characters on line with inline comment between start of line and corner mark of inline comment.
				let curLineText = editor.document.lineAt(line).text; // The text content of the current line.

				switch	(languageId) {
					case "javascript":
					case "typescript":
						match = curLineText.match(/^(?!\s*\/{2}).*?(?<!:)(?=\/{2})/);
						break;
				
					case "powershell":
						break;

					default:
						vscode.window.showErrorMessage("File type '" + languageId + "' is not supported."); // Display error message box to the user.
						return;
				};

				if (match != null) { // Only lines with inline comment after code.

					let originalText = match[0];
					let untabbedText = smartExpandTabs(matchText, tabSize);	// Smart expand all tabs.

					maxCommentIndex = Math.max(maxCommentIndex, untabbedText.length); // Get rightmost position of inline comment.

			//		let originalText = matchText[0].trimEnd();
			//		let expandedText = originalText;
			//		let offset;

			//		while ((offset = expandedText.indexOf("\t")) != -1) {
			//			expandedText = expandedText.replace("\t", " ".repeat(tabSize - offset % tabSize));
			//		}

					let start = new vscode.Position(line, originalText.length); // The position immediately after the code.
					let end = new vscode.Position(line, originalText.length);			// Position of starting mark inline comment.
					commentArr.push({
						rangeToDelete: new vscode.Range(start, end),
			//			tabExpand: expandedText.length - originalText.length
					});
				};
			};

			//editor.edit((TextEditorEdit) => {
			//	commentArr.forEach(el => {
			//		TextEditorEdit.delete(el.range); // Delete all whitespaces between last code character and inline comment.
			//		TextEditorEdit.insert(el.range.start, " ".repeat(maxCommentIndex - el.range.start.character - el.tabExpand)); // Insert spaces after code before inline comment.
			//	})
			//});	
			
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
