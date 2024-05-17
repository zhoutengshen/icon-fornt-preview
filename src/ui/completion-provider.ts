import * as vscode from 'vscode';
import { IconService } from '../service/icon';
import ConfigService from '../service/config';
import { isPositionInPropRange } from '../utils/ui';

export class Base64CompletionItemProvider implements vscode.CompletionItemProvider {

    // 判断光标位置，如果不是在icon的name属性中，则不显示icon的补全
    isMatchCompletion(document: vscode.TextDocument, position: vscode.Position) {
        return isPositionInPropRange(document, position);
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
