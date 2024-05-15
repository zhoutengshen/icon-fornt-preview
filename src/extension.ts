import * as vscode from 'vscode';
import ConfigService from './service/config';

const iconList = [
	{
		"id": "no-videocamera",
		"viewBox": "0 0 1024 1024",
		"base64": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiPjxwYXRoIGQ9Ik01NzYuNTQzMDMgMjM0LjcxMzIxMmM2Ljg4ODcyNy00LjUzMDQyNCAxNC45NTY2MDYtNi45NTA3ODggMjMuMjEwNjY3LTYuOTUwNzg4IDEwLjk1MzY5NyAwLjI3OTI3MyAyMS40MTA5MDkgNC43MTY2MDYgMjkuMTY4NDg1IDEyLjM4MTA5MSA3Ljc1NzU3NiA3LjY2NDQ4NSAxMi4yNTY5NyAxNy45OTc1NzYgMTIuNTM2MjQyIDI4Ljg1ODE4MiAwIDguMTI5OTM5LTIuNDUxMzk0IDE2LjEwNDcyNy03LjAxMjg0OCAyMi44NjkzMzNhNDEuNjExNjM2IDQxLjYxMTYzNiAwIDAgMS0xOC43NDIzMDMgMTUuMjA0ODQ5IDQyLjIwMTIxMiA0Mi4yMDEyMTIgMCAwIDEtNDUuNDU5Mzk0LTguOTY3NzU4IDQwLjc0Mjc4OCA0MC43NDI3ODggMCAwIDEtOS4wMjk4MTgtNDQuOTAwODQ4YzMuMTAzMDMtNy41NDAzNjQgOC40NzEyNzMtMTMuOTYzNjM2IDE1LjMyODk2OS0xOC40OTQwNjF6TTE2MC4xNzg0MjQgNjM5LjkwNjkwOUwxNS41MTUxNTIgNDU4LjU2NTgxOGw1NS42MzczMzMtMTkuMjM4Nzg4IDE0NC42NjMyNzMgMTgxLjM0MTA5MS01NS42MzczMzQgMTkuMjM4Nzg4eiBtNTU5LjE2NjA2MS01MjIuMDUzODE4bDEwMC4xNjU4MTggMzEzLjIxOTg3OWMyLjg1NDc4OCA2LjU3ODQyNCAyLjk3ODkwOSAxMy45NjM2MzYgMC4zNzIzNjQgMjAuNjY2MTgyYTI3LjYxNjk3IDI3LjYxNjk3IDAgMCAxLTE0LjI3Mzk0IDE1LjA0OTY5NkwyOTYuNDk0NTQ1IDY1MC44OTE2MzZhMTAuMzAyMDYxIDEwLjMwMjA2MSAwIDAgMS04LjM0NzE1MSAyLjczMDY2NyAzNC4zODE1NzYgMzQuMzgxNTc2IDAgMCAxLTIyLjI0ODcyNy0xMC45ODQ3MjdMNDYuMTExMDMgMzcwLjYyNTkzOWEyNy4zMDY2NjcgMjcuMzA2NjY3IDAgMCAxLTUuNTg1NDU0LTI0LjczMTE1MSAyOS4wNDQzNjQgMjkuMDQ0MzY0IDAgMCAxIDE2LjcyNTMzMy0xOS4yMzg3ODhsNjI1Ljk0MzI3My0yMjUuMjhhMzAuOTY4MjQyIDMwLjk2ODI0MiAwIDAgMSAyMi4yNzk3NTcgMGM2LjA1MDkwOSA0LjE1ODA2MSAxMC44NjA2MDYgOS44MzY2MDYgMTMuOTAxNTc2IDE2LjQ3NzA5MXogbS02MDYuNDU2MjQzIDI0NC41MTg3ODhsMTgzLjYwNjMwMyAyMjguMDcyNzI3IDQ2MS44MjQtMTY3LjU5NDY2Ny04MC42Nzg3ODctMjYzLjc1NzU3NS01NjQuNzUxNTE2IDIwMy4zMTA1NDV6IG02NTMuNzc3NDU1IDIzNy4zODE4MTh2LTEuMDU1MDNoNS44NjQ3MjdjLTEuOTg1OTM5IDAuMzEwMzAzLTMuOTQwODQ4IDAuNjgyNjY3LTUuODk1NzU3IDEuMDg2MDZ6IG0tMTIzLjM3NjQ4NSA3OS41NjE2OTdsLTI5LjYzMzkzOS01NS45MTY2MDYgMTU4LjU2NDg0OC01Ny42ODUzMzMtMTkuNDU2LTUyLjE5Mjk3LTQwMy4zOTM5MzkgMTQ1LjYyNTIxMiAzNi4xNTAzMDMgNDYuNzAwNjA2IDE3NS4yNTkxNTEtNjMuMjA4NzI3IDQxLjczNTc1OCA3OS42ODU4MThhMzEuNzc1MDMgMzEuNzc1MDMgMCAwIDAgMTIuNDc0MTgyIDEyLjU2NzI3MyAyMDEuMDc2MzY0IDIwMS4wNzYzNjQgMCAwIDEgMjguMzMwNjY2LTU1LjU0NDI0M3pNNzg5LjIyNDcyNyA3ODMuNjA4MjQybC05Mi44NzM2OTcgOTIuODczNjk3IDMyLjkyMzE1MiAzMi44OTIxMjIgOTIuODczNjk3LTkyLjg0MjY2NyA5Mi44NDI2NjYgOTIuODQyNjY3IDMyLjkyMzE1Mi0zMi44OTIxMjItOTIuODczNjk3LTkyLjg3MzY5NyA5Mi44NzM2OTctOTIuODQyNjY2LTMyLjg5MjEyMS0zMi44OTIxMjEtOTIuODczNjk3IDkyLjg0MjY2Ni05Mi44NzM2OTctOTIuODczNjk3LTMyLjg5MjEyMSAzMi44OTIxMjEgOTIuODQyNjY2IDkyLjg3MzY5N3oiIGZpbGw9IiNGRkZGRkYiID48L3BhdGg+PC9zdmc+",
		"progId": "4152733",
		"name": 'no-videocamera'
	},

	{
		"id": "quxiaoquanping",
		"viewBox": "0 0 1024 1024",
		"base64": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiPjxwYXRoIGQ9Ik0yOTguNjY2NjY3IDYzMS40NjY2NjdIMjI2LjEzMzMzM3YtODEuMDY2NjY3aDIxNy42djIwNC44aC04NS4zMzMzMzN2LTY4LjI2NjY2N2wtMTI4IDEyOEwxNzAuNjY2NjY3IDc1OS40NjY2NjdsMTI4LTEyOHogbTQyMi40IDBsMTI4IDEyOC01OS43MzMzMzQgNTkuNzMzMzMzLTEyOC0xMjh2NjguMjY2NjY3aC04NS4zMzMzMzNWNTU0LjY2NjY2N2gyMTcuNnY4MS4wNjY2NjZoLTcyLjUzMzMzM3pNMjk4LjY2NjY2NyAzNDEuMzMzMzMzTDE4Ny43MzMzMzMgMjMwLjQgMjQzLjIgMTcwLjY2NjY2N2wxMTUuMiAxMTUuMlYyMTcuNmg4NS4zMzMzMzN2MjA0LjhIMjI2LjEzMzMzM1YzNDEuMzMzMzMzSDI5OC42NjY2Njd6IG00MzAuOTMzMzMzIDBoNjR2ODEuMDY2NjY3aC0yMTcuNlYyMTcuNmg4NS4zMzMzMzN2NzIuNTMzMzMzTDc4MC44IDE3MC42NjY2NjdsNTkuNzMzMzMzIDU5LjczMzMzM0w3MjkuNiAzNDEuMzMzMzMzeiIgZmlsbD0iIzEyOTZEQiIgPjwvcGF0aD48L3N2Zz4=",
		"progId": "4152733",
		"name": 'quxiaoquanping'
	}
];

// 防抖函数
const debounce = (fn: Function, delay: number) => {
	let timer: any = null;
	return function (...args: any) {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			fn.apply(null, args);
		}, delay);
	};
};

const getRowTextMatchReg = (iconName = 'my-icon', prop = 'name') => {
	const regStr = `<${iconName}.*? [:]{0,1}${prop}=['"](.+?)['"]`;
	return new RegExp(regStr);
};

// 判断光标位置，如果不是在icon的name属性中，则不显示icon的补全
const isMatchCompletion = (document: vscode.TextDocument, position: vscode.Position, iconName = 'my-icon', prop = 'name') => {
	const text = document.lineAt(position).text;
	const tagReg = new RegExp(`<${iconName}.*?`);
	const isMatch = tagReg.test(text);
	if (!isMatch) {
		return false;
	}
	// 找到prop=的位置
	const nameIndexReg = new RegExp(`(${prop}=".*?")`);
	// 找到prop=的位置 的范围
	const regValue = text.match(nameIndexReg);
	if (!regValue) {
		return false;
	}
	// 匹配到的prop=的位置
	const index = regValue?.index;
	if (index === undefined) {
		return false;
	}
	// 匹配到的值
	const value = regValue[1];
	const startPot = new vscode.Position(position.line, index);
	const endPot = new vscode.Position(position.line, index + value.length);
	const propRange = new vscode.Range(startPot, endPot);
	// 如果光标落在prop=的值的范围内，则显示icon的补全
	if (propRange.contains(position)) {
		return true;
	}
	return false;
};

// 检查整个文档是否需要显示icon
const checkAllDocHasIcon = (iconName = 'my-icon', prop = 'name') => {
	const regStr = `<${iconName}.*? [:]{0,1}${prop}=['"](.+?)['"]`;
	const reg = new RegExp(regStr);
	return reg.test(vscode.window.activeTextEditor?.document.getText() || '');
};

/** 
 * 获取icon 所在行和icon 名称的映射
 * @param lineList 行号列表
 */
const getRowIndexIconMap = (lineList: Array<number> = []) => {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}
	const document = editor.document;
	let lineCount = document.lineCount;
	lineList = lineList.length ? lineList : Array.from({ length: lineCount }, (_, i) => i);
	const lineIconMap: Record<string, string> = {};
	while (lineList.length) {
		const curLine = lineList.shift();
		if (curLine === undefined) {
			lineIconMap;
		}
		const lineText = document.lineAt(curLine!).text;
		const regex = getRowTextMatchReg();
		const matches = regex.exec(lineText);
		if (matches && matches[1]) {
			const name = matches[1].replace(/['"]/g, '');
			lineIconMap[curLine!] = name;
		}
	}
	return lineIconMap;
};

class Base64ImgHoverProvider implements vscode.HoverProvider {
	provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
		const lineIconMap = getRowIndexIconMap();
		if (!lineIconMap) {
			return;
		}
		const line = position.line;
		const iconName = lineIconMap[line];
		if (!iconName) {
			return;
		}
		const icon = iconList.find(icon => icon.id === iconName);
		if (!icon) {
			return;
		}
		const iconMd = new vscode.MarkdownString(`<img height="100px" width="100px" src="${icon.base64}"></img>`, true);
		iconMd.supportHtml = true;
		return new vscode.Hover(iconMd);
	}
}
// rowIndex decoration 关联，索引是rowIndex
const textEditorDecorationCacheList: Array<{
	decoration: vscode.TextEditorDecorationType,
	name: string,
	line: number,
}> = [];
const renderIcon = (lineIconMap: Record<string, string> = {}) => {
	const keys = Object.keys(lineIconMap);
	const iconNameImgMap = iconList.reduce((prev, cur) => {
		prev[cur.id] = cur.base64;
		return prev;
	}, {} as any);
	keys.forEach(line => {
		const name = lineIconMap[line];
		const decorations: vscode.DecorationOptions[] = [
			{
				range: new vscode.Range(parseInt(line, 10), 0, parseInt(line, 10), 0),
			}
		];

		const base64Img = iconNameImgMap[name];
		if (!base64Img) {
			return;
		}
		const decorationRenderOptions: vscode.DecorationRenderOptions = {
			gutterIconPath: vscode.Uri.parse(base64Img),
			gutterIconSize: 'contain',
		};
		const textEditorDecorationType: vscode.TextEditorDecorationType = vscode.window.createTextEditorDecorationType(<any>decorationRenderOptions);
		textEditorDecorationCacheList.push({
			decoration: textEditorDecorationType,
			name,
			line: parseInt(line, 10),
		});
		vscode.window.activeTextEditor?.setDecorations(textEditorDecorationType, decorations);
	});
};

export function activate(context: vscode.ExtensionContext) {
	const provider2 = vscode.languages.registerCompletionItemProvider(
		'html',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const isPass = isMatchCompletion(document, position);
				// 判断光标位置，如果不是在icon的name属性中，则不显示icon的补全
				if (!isPass) {
					return undefined;
				}
				const iconCompletionItemList = iconList.map(icon => {
					const iconCompletionItem = new vscode.CompletionItem(icon.id, vscode.CompletionItemKind.Property);
					const iconMd = new vscode.MarkdownString(`<img height="100px" width="100px" src="${icon.base64}"></img>`, true);
					iconMd.supportHtml = true;
					iconCompletionItem.documentation = iconMd;
					return iconCompletionItem;
				});
				return iconCompletionItemList;
			}
		},
		// 删除也触发
		'"',
		'=',

	);
	context.subscriptions.push(provider2);

	vscode.languages.registerHoverProvider('html', new Base64ImgHoverProvider());

	vscode.window.onDidChangeActiveTextEditor((e) => {
		const lineIconMap = getRowIndexIconMap();
		if (!lineIconMap) {
			return;
		}
		renderIcon(lineIconMap);
	});

	let debounceFunc: ReturnType<typeof debounce>;
	vscode.workspace.onDidChangeTextDocument(event => {
		if (!checkAllDocHasIcon()) {
			return;
		}
		debounceFunc = debounceFunc || debounce(() => {
			while (textEditorDecorationCacheList.length) {
				const { decoration } = textEditorDecorationCacheList.pop() as any;
				vscode.window.activeTextEditor?.setDecorations(decoration, []);
			}
			const lineIconMap = getRowIndexIconMap([]);
			if (!lineIconMap) {
				return;
			}
			renderIcon(lineIconMap);
		}, 50);
		debounceFunc();
	});

	// 工作目录配置文件读取
	ConfigService.loadWorkspaceConfig('icon-preview.json');
	// 插件销毁释放缓存
	context.subscriptions.push({
		dispose() {
			while (textEditorDecorationCacheList.length) {
				const { decoration } = textEditorDecorationCacheList.pop() as any;
				vscode.window.activeTextEditor?.setDecorations(decoration, []);
			}
		},
	
	});
}
