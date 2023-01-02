"use strict";

const vscode = require("vscode"); // The module "vscode" contains the VS Code extensibility API.

// This method is called when your extension is activated.
// Extension is activated the very first time the command is executed.
function activate(context) {
// param: {vscode.ExtensionContext} context

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log("Extension is now active!");

	// The command has been defined in the package.json file.
	// The commandId parameter must match the command field in package.json.
	let disposable = vscode.commands.registerCommand('hello-world-extension.helloWorld', function () {
		// The code you place here will be executed every time your command is executed.

		const editor = vscode.window.activeTextEditor; // The currently active editor.

		if (editor != undefined) {
			console.log(editor.options.tabSize)
			console.log(editor.options.insertSpaces)
			let languageId = editor.document.languageId;		// Get the identifier of the language associated with document in currently active editor.

			// Get the comment position of each line.
			let commentArr = []; // An array of the starting corner mark of the line comment, used to filter out the longest line of non-comment text content
			let maxCommentIndex = 0; // Index of inline comment at rightmost position after code.

			for(let line = 0; line < editor.document.lineCount; line++) {
				let lineWithCommentAfterCode;
				let curLineText = editor.document.lineAt(line).text; // The text content of the current line.

				switch	(languageId) {
					case "javascript":
					case "typescript":
						lineWithCommentAfterCode = curLineText.match(/^(?!\s*\/{2}).*?(?<!:)(?=\/{2})/);
						break;
				
					case "powershell":
						break;

					default:
						vscode.window.showErrorMessage("File type '" + languageId + "' is not supported."); // Display error message box to the user
						return;
				};
			
				if (lineWithCommentAfterCode != null) { // Lines with inline comment after code.
					let start = new vscode.Position(line, lineWithCommentAfterCode[0].trimEnd().length);
					let end = new vscode.Position(line, lineWithCommentAfterCode[0].length);
					let x = new vscode.Range(start, end)
					commentArr.push(x);
					//commentArr.push(new vscode.Position(line, lineWithCommentAfterCode[0].trimEnd().length)); // Inline comment position.
					maxCommentIndex = Math.max(maxCommentIndex, lineWithCommentAfterCode[0].length); // Get rightmost position.
				};

			};

			editor.edit((TextEditorEdit) => {
				commentArr.forEach(element => {
					TextEditorEdit.delete(element)
					TextEditorEdit.insert(element.start, "x".repeat(maxCommentIndex - element.start.character))
					//TextEditorEdit.insert(element, "x".repeat(maxCommentIndex - element.character)); // Insert spaces after code before inline comment
				})
			})	
			//activeTextEditor.edit((TextEditorEdit) => {
			//	TextEditorEdit.insert(commentArr[0], "miro")
			//})
			
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
