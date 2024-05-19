// 数据缓存
import { IParserResult } from "../parser/basic";
import * as vscode from 'vscode';
import pckJson from '../../package.json';
import { isExistFile } from "../utils/file";


export class CacheService {
    private static cacheMap = new Map<string, IParserResult[] | null>();

    static getCacheFileUri(id: string) {
        const extName = `${pckJson.publisher}.${pckJson.name}`;
        const ext = vscode.extensions.getExtension(extName);
        const extDir = ext?.extensionUri;
        if (!extDir) {
            return;
        }
        const encodedId = encodeURIComponent(id);
        return vscode.Uri.joinPath(extDir, 'cache', `${encodedId}.json`);
    }

    private static async createCacheDir() {
        const extName = `${pckJson.publisher}.${pckJson.name}`;
        const cacheDir = vscode.Uri.joinPath(vscode.extensions.getExtension(extName)?.extensionUri!, 'cache');
        const isExist = await isExistFile(cacheDir);
        if (isExist) {
            return;
        }
        await vscode.workspace.fs.createDirectory(cacheDir);
    }

    /**
     * 获取文件系统缓存
     * @returns 
     */
    static async getCache(cacheId: string) {
        try {
            // 内存缓存
            const memCache = this.cacheMap.get(cacheId);
            if (memCache) {
                return memCache;
            }
            const filePath = this.getCacheFileUri(cacheId);
            if (!filePath) {
                return null;
            }
            // 读取本地的缓存文件
            const isPass = await isExistFile(filePath);
            if (!isPass) {
                return null;
            }
            await this.createCacheDir();
            const jsonStr = (await vscode.workspace.fs.readFile(filePath).then(resp => resp.toString()));
            const jsonValue = JSON.parse(jsonStr);
            if (jsonValue) {
                this.cacheMap.set(cacheId, jsonValue);
            }
            return this.cacheMap.get(cacheId);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async setCache(cacheId: string, cache: IParserResult[]) {
        if (!cacheId) {
            return;
        }
        this.cacheMap.set(cacheId, cache);
        const filePath = this.getCacheFileUri(cacheId);
        if (!filePath) {
            console.log('无法找到插件位置');
            return null;
        }
        await this.createCacheDir();
        try {
            vscode.workspace.fs.writeFile(
                filePath,
                Buffer.from(JSON.stringify(cache))
            );
        } catch (error) {
            this.cacheMap.set(cacheId, null);
            return null;
        }
    }
}