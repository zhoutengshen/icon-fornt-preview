import * as vscode from 'vscode';
import { getRowIndexIconMap } from '../utils/ui';
import { IconService } from '../service/icon';

export class Base64Decoration {
    // rowIndex decoration 关联，索引是rowIndex
    private textEditorDecorationCacheList: Array<{
        decoration: vscode.TextEditorDecorationType,
        name: string,
        line: number,
    }> = [];

    clear() {
        const { textEditorDecorationCacheList } = this;
        while (textEditorDecorationCacheList.length) {
            const { decoration } = textEditorDecorationCacheList.pop() || {};
            if (decoration) {
                vscode.window.activeTextEditor?.setDecorations(decoration, []);
            }
        }
    }

    reRender() {
        this.clear();
        this.render();
    }

    render() {
        const lineIconMap = getRowIndexIconMap();
        if (!lineIconMap) {
            return;
        }
        const keys = Object.keys(lineIconMap);
        const iconNameImgMap = IconService.getIconList().reduce((prev, cur) => {
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
            this.textEditorDecorationCacheList.push({
                decoration: textEditorDecorationType,
                name,
                line: parseInt(line, 10),
            });
            vscode.window.activeTextEditor?.setDecorations(textEditorDecorationType, decorations);
        });
    }
}
