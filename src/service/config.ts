import * as vs from 'vscode';
import { isJsonFile } from '../utils/file';

// 文件系统
const { fs, } = vs.workspace;


/** 配置文件接口 */
interface IConfig {
    [key: string]: any;
    /** 标签名称 */
    tagName?: string
    /** 属性名 */
    propName?: string
    /** 图标地址(本地或者http/https地址) */
    target: string
}

/** 配置文件加载服务 */
export default class ConfigService {
    private static instance: ConfigService;
    private static configs: IConfig[];

    /**
     * 获取单例
     * @returns {Config} 返回配置文件实例
     */
    public static getInstance(): ConfigService {
        if (ConfigService.instance) {
            return ConfigService.instance;
        }
        ConfigService.instance = new ConfigService();
        return ConfigService.instance;
    }

    /**
     * 加载工作空间配置文件
     */
    public static async loadWorkspaceConfig(path: string) {
        // 根
        const rootUris = vs.workspace.workspaceFolders?.map(item => vs.Uri.joinPath(item.uri, path));
        const files = rootUris?.filter(async uri => {
            // 排除不存在的文件
            try {
                return fs.stat(uri).then(() => true);
            } catch (error) {
                return false;
            }
        }).map(uri => fs.readFile(uri).then(resp => {
            return resp.toString();
        })) || [];
        const fileStringList = await Promise.all(files);
        const configList = fileStringList.map(item => {
            return JSON.parse(item) as IConfig;
        });
        ConfigService.configs = configList;
        console.log(ConfigService.configs);
        
    }

}