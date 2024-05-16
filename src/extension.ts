import * as vscode from 'vscode';
import { debounce } from './utils/index';
import { getRowIndexIconMap } from './utils/ui';
import { Base64ImgHoverProvider } from './ui/hover-provider';
import { Base64Decoration } from './ui/decoration';
import { Base64CompletionItemProvider } from './ui/completion-provider';

// 检查整个文档是否需要显示icon
const checkAllDocHasIcon = (iconName = 'my-icon', prop = 'name') => {
	const regStr = `<${iconName}.*? [:]{0,1}${prop}=['"](.+?)['"]`;
	const reg = new RegExp(regStr);
	return reg.test(vscode.window.activeTextEditor?.document.getText() || '');
};


export function activate(context: vscode.ExtensionContext) {
	const base64Decoration = new Base64Decoration();
	const provider = vscode.languages.registerCompletionItemProvider(
		'html', new Base64CompletionItemProvider(),
		// 删除也触发
		'"',
		'=',
	);
	context.subscriptions.push(provider);

	vscode.languages.registerHoverProvider('html', new Base64ImgHoverProvider());

	vscode.window.onDidChangeActiveTextEditor((e) => {
		base64Decoration.render();
	});

	let debounceFunc: ReturnType<typeof debounce>;
	vscode.workspace.onDidChangeTextDocument(event => {
		if (!checkAllDocHasIcon()) {
			return;
		}
		debounceFunc = debounceFunc || debounce(() => {
			base64Decoration.reRender();
		}, 50);
		debounceFunc();
	});
}
