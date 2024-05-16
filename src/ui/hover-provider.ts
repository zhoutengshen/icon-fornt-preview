import * as vscode from 'vscode';
import { getRowIndexIconMap } from '../utils/ui';
import { CacheService } from '../service/cache';

export class Base64ImgHoverProvider implements vscode.HoverProvider {
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
        const icon = CacheService.getIconList().find(icon => icon.id === iconName);
        if (!icon) {
            return;
        }
        const iconMd = new vscode.MarkdownString(`<img height="100px" width="100px" src="${icon.base64}"></img>`, true);
        iconMd.supportHtml = true;
        return new vscode.Hover(iconMd);
    }
}