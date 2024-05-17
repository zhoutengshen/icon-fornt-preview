import * as vscode from 'vscode';
import { getRowIndexIconMap, isPositionInPropRange, parsePropValue } from '../utils/ui';
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
        // 属性里面有多个图标
        const iconList = parsePropValue(iconName);
        const useIcons = IconService.getIconList().filter(icon => iconList.includes(icon.id));
        if (!useIcons) {
            return;
        }
        const mdStr = useIcons.reduce((pre, icon) => {
            return pre + `<img height="100px" width="100px" margin-left="8px" src="${icon.base64}"></img>`;
        }, "");
        const iconMd = new vscode.MarkdownString(`${mdStr}`, true);
        iconMd.supportHtml = true;
        return new vscode.Hover(iconMd);
    }
}