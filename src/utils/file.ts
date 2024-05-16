import * as vs from 'vscode';

/**
 * 获取文件后缀
 * @param filename 
 * @returns 
 */
export const getFileType = (filename: string) => {
    const regex = /\.[^.]+$/;
    const match = filename.match(regex);
    return match ? match[0] : null; // 如果匹配到则返回后缀（包括点），否则返回null
};

/**
 * 判断是否为json 文件
 * @param filename 
 * @returns 
 */
export const isJsonFile = (filename: string) => {
    const ext = getFileType(filename);
    if (!ext) {
        return false;
    }
    return ext.toUpperCase().includes('JSON');
};

/**
 * 判断文件是否存在
 * @param path 路径
 * @returns 
 */
export const isExistFile = async (path: vs.Uri | string) => {
    try {
        path = typeof path === 'string' ? vs.Uri.parse(path) : path;
        await vs.workspace.fs.stat(path);
        return true;
    } catch (error) {
        return false;
    }
};