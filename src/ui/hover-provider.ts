import * as vscode from 'vscode';
import { getLineIndexPropValueMap, isPositionInPropRange, parsePropValue } from '../utils/ui';
import { IconService } from '../service/icon';
import ConfigService from '../service/config';

export class Base64ImgHoverProvider implements vscode.HoverProvider {

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        const isHoverInProp = isPositionInPropRange(document, position);
        // 获取指定行的属性值列表
        const lineIconMap = getLineIndexPropValueMap([position.line]);
        if (!lineIconMap || !isHoverInProp) {
            return;
        }
        const line = position.line;
        const propValue = lineIconMap[line];
        if (!propValue) {
            return;
        }
        // 属性里面有多个图标
        const useIcons = IconService.getIconByPropValue(propValue);
        if (!useIcons) {
            return;
        }
        const mdStr = useIcons.reduce((pre, icon) => {
            return pre + `<img height="100px" width="100px" src="${icon.base64}"></img>`;
        }, "");
        const iconMd = new vscode.MarkdownString(`${mdStr}`, true);
        iconMd.supportHtml = true;
        return new vscode.Hover(iconMd);
    }
}