import * as vscode from 'vscode';
import ConfigService from '../service/config';

const getRowTextMatchReg = (iconName = 'my-icon', prop = 'name') => {
    const regStr = `<${iconName}.*? [:]{0,1}${prop}=['"](.+?)['"]`;
    return new RegExp(regStr);
};

/** 
 * 获取icon 所在行和icon 名称的映射
 * @param lineList 行号列表
 */
export const getRowIndexIconMap = (lineList: Array<number> = []) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const document = editor.document;
    let lineCount = document.lineCount;
    lineList = lineList.length ? lineList : Array.from({ length: lineCount }, (_, i) => i);
    const lineIconMap: Record<string, string> = {};
    const config = ConfigService.getInstance().getCurWorkspaceConfigSync();
    while (lineList.length) {
        const curLine = lineList.shift();
        if (curLine === undefined) {
            lineIconMap;
        }
        const lineText = document.lineAt(curLine!).text;
        const regex = getRowTextMatchReg(config?.tagName, config?.propName);
        const matches = regex.exec(lineText);
        if (matches && matches[1]) {
            const name = matches[1].replace(/['"]/g, '');
            lineIconMap[curLine!] = name;
        }
    }
    return lineIconMap;
};
