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

/** 
 * 判断当前位置是否落在标签属性上范围内
 * eg: 
 * 如果position位于 中 icon="my-icon" 属性上 那么返回true
 * <my-tag icon="my-icon" />
 */
export const isPositionInPropRange = (document: vscode.TextDocument, position: vscode.Position) => {
    const config = ConfigService.getInstance().getCurWorkspaceConfigSync();
    if (!config) {
        return false;
    }
    const iconName = config.tagName;
    const prop = config.propName;
    if (!iconName || !prop) {
        return;
    }
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