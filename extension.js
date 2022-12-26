const vscode = require("vscode"); // The module "vscode" contains the VS Code extensibility API
const languageCommentMarker = {"javascript": "//", "powershell": "#"}; // {languageId: marker}

// This method is called when your extension is activated.
// Extension is activated the very first time the command is executed.
function activate(context) {
// param: {vscode.ExtensionContext} context

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log("Extension is now active!");

	// The command has been defined in the package.json file.
	// The commandId parameter must match the command field in package.json.
	let disposable = vscode.commands.registerCommand('hello-world-extension.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		let activeTextEditor = vscode.window.activeTextEditor;
		let activeDocument = activeTextEditor.document;

		if (activeTextEditor != undefined) {


			let languageId = activeTextEditor.document.languageId;		// Get the identifier of the language associated with document in currently active editor.
			let marker = languageCommentMarker[languageId];
			
			if (marker == undefined) {
				vscode.window.showErrorMessage("File type '" + languageId + "' is not supported."); // Display error message box to the user
				return;
			}

	
			// Get the comment information (position, content) of each line
			let commentArr = []; // Line information cache array
			let commentIndexArr = []; // An array of the starting corner mark of the line comment, used to filter out the longest line of non-comment text content

			let endLine = activeDocument.lineCount; // The number of lines in this document.

			for(let i = 0; i < endLine; i++) {
				let curLineText = activeDocument.lineAt(i).text; // The text content of the current line
				console.log(endLine + "/" + curLineText)
			}


			vscode.window.showInformationMessage(languageId + " " + marker);
		}
	
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
