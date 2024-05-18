import * as vscode from 'vscode';
import { debounce } from './utils/index';
import { Base64ImgHoverProvider } from './ui/hover-provider';
import { Base64Decoration } from './ui/decoration';
import { Base64CompletionItemProvider } from './ui/completion-provider';
import { getFileType } from './utils/file';
import ConfigService from './service/config';
import { IconService } from './service/icon';

// 检查整个文档是否需要显示icon
const checkAllDocHasIcon = (iconName = 'my-icon', prop = 'name') => {
	const regStr = `<${iconName}.*? [:]{0,1}${prop}=['"](.+?)['"]`;
	const reg = new RegExp(regStr);
	return reg.test(vscode.window.activeTextEditor?.document.getText() || '');
};

const enableFileTypes = ['html', 'vue', 'jsx', 'tsx'];

export function activate(context: vscode.ExtensionContext) {
	console.log('插件激活');
	IconService.load();
	const base64Decoration = new Base64Decoration();
	const provider = vscode.languages.registerCompletionItemProvider(
		enableFileTypes, new Base64CompletionItemProvider(),
		'"',
		'=',
		' '
	);
	context.subscriptions.push(provider);

	vscode.languages.registerHoverProvider(enableFileTypes, new Base64ImgHoverProvider());

	vscode.window.onDidChangeActiveTextEditor((e) => {
		base64Decoration.render();
	});

	let debounceFunc: ReturnType<typeof debounce>;
	vscode.workspace.onDidChangeTextDocument(event => {
		const fileType = getFileType(event.document.fileName, false);
		if (!fileType || !enableFileTypes.includes(fileType)) {
			return;
		}
		const config = ConfigService.getInstance().getCurWorkspaceConfigSync();
		if (!checkAllDocHasIcon(config?.tagName, config?.propName)) {
			base64Decoration.clear();
			return;
		}
		debounceFunc = debounceFunc || debounce(() => {
			base64Decoration.reRender();
		}, 50);
		debounceFunc();
	});
}
