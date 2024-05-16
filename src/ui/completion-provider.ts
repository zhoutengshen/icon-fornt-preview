import * as vscode from 'vscode';
import { IconService } from '../service/icon';

export class Base64CompletionItemProvider implements vscode.CompletionItemProvider {

    // 判断光标位置，如果不是在icon的name属性中，则不显示icon的补全
    isMatchCompletion(document: vscode.TextDocument, position: vscode.Position, iconName = 'my-icon', prop = 'name') {
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
    }

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> {
        const isPass = this.isMatchCompletion(document, position);
        // 判断光标位置，如果不是在icon的name属性中，则不显示icon的补全
        if (!isPass) {
            return undefined;
        }
        const iconCompletionItemList = IconService.getIconList().map(icon => {
            const iconCompletionItem = new vscode.CompletionItem(icon.id, vscode.CompletionItemKind.Property);
            const iconMd = new vscode.MarkdownString(`<img height="100px" width="100px" src="${icon.base64}"></img>`, true);
            iconMd.supportHtml = true;
            iconCompletionItem.documentation = iconMd;
            return iconCompletionItem;
        });
        return iconCompletionItemList;
    }

}
