import * as vs from 'vscode';
import { isJsonFile } from '../utils/file';

// 文件系统
const { fs, } = vs.workspace;


/** 配置文件接口 */
export interface IConfig {
    [key: string]: any;
    /** 标签名称 */
    tagName?: string
    /** 属性名 */
    propName?: string
    /** 图标地址(本地或者http/https地址) */
    target: string
    /** 解析器 */
    parser: string
    /** 工作空间 */
    workspace?: string
}

/** 配置文件加载服务 */
export default class ConfigService {
    private configs: Array<IConfig> | null = null;
    private static instance: ConfigService;

    private constructor() { }

    public static getInstance() {
        if (!ConfigService.instance) {
            const ist = new ConfigService();
            ConfigService.instance = ist;
        }
        return ConfigService.instance;
    }

    public getWorkspaceConfig(path?: string) {
        if (this.configs === null) {
            return this.loadWorkspaceConfig(path);
        }
        return Promise.resolve(this.configs);
    }

    /**
     * 加载工作空间配置文件
     */
    public async loadWorkspaceConfig(path?: string) {
        path = path || 'icon-preview.config.json';
        // 根
        const rootUris = vs.workspace.workspaceFolders?.map(item => ({
            path: vs.Uri.joinPath(item.uri, path),
            workspace: item.uri
        }));
        const resultPromiseList = rootUris?.filter(async uri => {
            // 排除不存在的文件
            try {
                const { path } = uri;
                return fs.stat(path).then(() => true);
            } catch (error) {
                return false;
            }
        }).map(async config => {
            const path = config.path;
            const workspace = config.workspace;
            const resp = await fs.readFile(path);
            const jsonStr = resp.toString();
            return {
                ...JSON.parse(jsonStr) as IConfig,
                workspace: workspace.toString()
            };
        }) || [];

        this.configs = await Promise.all(resultPromiseList);
        return this.configs;
    }

}