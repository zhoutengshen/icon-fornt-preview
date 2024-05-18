import * as vscode from 'vscode';
import { getLineIndexPropValueMap } from '../utils/ui';
import { IconService } from '../service/icon';
import { mergeSvgPathBeOne, svg2ImgBase64 } from '../utils';

export class Base64Decoration {
    // rowIndex decoration 关联，索引是rowIndex
    private textEditorDecorationCacheList: Array<{
        decoration: vscode.TextEditorDecorationType,
        name: string,
        line: number,
    }> = [];

    clear(isDispose = false) {
        const { textEditorDecorationCacheList } = this;
        while (textEditorDecorationCacheList.length) {
            const { decoration } = textEditorDecorationCacheList.pop() || {};
            if (decoration) {
                vscode.window.activeTextEditor?.setDecorations(decoration, []);
            }
            if (decoration && isDispose) {
                decoration.dispose();
            }
        }
    }

    dispose() {
        this.clear(true);
    }

    reRender() {
        this.clear();
        this.render();
    }

    render() {
        
        // 行索引和propValue的映射关系
        const linePropValueMap = getLineIndexPropValueMap();
        const lineIndexList = Object.keys(linePropValueMap);
        if (!lineIndexList.length) {
            return;
        }
        // 遍历需要渲染图标的行号
        lineIndexList.forEach(line => {
            const propValue = linePropValueMap[line];
            const useIconList = IconService.getIconByPropValue(propValue);
            if (!useIconList.length) {
                return;
            }
            // 合并多个svg
            // const mergeSvg = mergeSvgPathBeOne(useIconList.filter(item => item.graphics).map(item => item.graphics!));
            const mergeSvgBase64 = useIconList[0].base64;
            const mergeName = useIconList.map(item => item.name).join('_');
            const lineNum = parseInt(line, 10);
            const decorationType = vscode.window.createTextEditorDecorationType({
                gutterIconSize: 'contain',
                gutterIconPath: vscode.Uri.parse(mergeSvgBase64),
            });
            const decorationOps = [
                {
                    range: new vscode.Range(lineNum, 1, lineNum, 1),
                }
            ];
            vscode.window.activeTextEditor?.setDecorations(decorationType, decorationOps);
            this.textEditorDecorationCacheList.push({
                decoration: decorationType,
                name: mergeName,
                line: lineNum,
            });
        });
    }
}
