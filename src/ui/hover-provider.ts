import * as vscode from 'vscode';
import { getRowIndexIconMap, isPositionInPropRange } from '../utils/ui';
import { IconService } from '../service/icon';
import ConfigService from '../service/config';

export class Base64ImgHoverProvider implements vscode.HoverProvider {
    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        const isHoverInProp = isPositionInPropRange(document, position);
        const lineIconMap = getRowIndexIconMap();
        if (!lineIconMap || !isHoverInProp) {
            return;
        }
        const line = position.line;
        const iconName = lineIconMap[line];
        if (!iconName) {
            return;
        }
        const icon = IconService.getIconList().find(icon => icon.id === iconName);
        if (!icon) {
            return;
        }
        const iconMd = new vscode.MarkdownString(`<img height="100px" width="100px" src="${icon.base64}"></img>`, true);
        iconMd.supportHtml = true;
        return new vscode.Hover(iconMd);
    }
}