import * as vs from 'vscode';
import { isExistFile } from '../utils/file';

// 文件系统
const { fs } = vs.workspace;


/** 配置文件接口 */
export interface IConfig {
    /** 其他扩展的属性 */
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
    // ============ 扩展属性
    // 阿里图标前缀
    iconFontPrefix?: string
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

    public getWorkspaceConfigSync() {
        if (!this.configs?.length) {
            this.getWorkspaceConfig();
        }
        return this.configs;
    }

    public getWorkspaceConfig() {
        if (this.configs === null) {
            return this.loadWorkspaceConfig();
        }
        return Promise.resolve(this.configs);
    }

    /**
     * 同步获取
     * 获取当前工作空间的配置文件
     * @returns 
     */
    public getCurWorkspaceConfigSync() {
        if (!this.configs?.length) {
            this.getWorkspaceConfig();
        }
        return this.configs?.find(item => {
            const { workspace } = item;
            if (!workspace) {
                return false;
            }
            // 判断了 Uri 是否是包含关系
            const targetUri = vs.Uri.parse(workspace);
            const curUri = vs.window.activeTextEditor?.document.uri;
            const isInclude = curUri && curUri.fsPath.includes(targetUri.fsPath);
            return isInclude;
        });
    }

    /**
     * 加载工作空间配置文件
     */
    public async loadWorkspaceConfig() {
        const path = 'icon-preview.config.json';
        // 根
        const rootUriPromiseList = vs.workspace.workspaceFolders?.map(async item => ({
            path: vs.Uri.joinPath(item.uri, path),
            workspace: item.uri,
            isExist: await isExistFile(vs.Uri.joinPath(item.uri, path))
        })) || [];
        const rootUris = (await Promise.all(rootUriPromiseList)).filter(item => item.isExist);
        if (!rootUris.length) {
            console.log(`工作空间没有配置文件，请添加：${path}`);
        }
        const resultPromiseList = rootUris.map(async config => {
            const path = config.path;
            const workspace = config.workspace;
            const resp = await fs.readFile(path);
            const jsonStr = resp.toString();
            console.log(`加载${path.toString()}工作空间配置文件`);
            return {
                ...JSON.parse(jsonStr) as IConfig,
                workspace: workspace.toString()
            };
        }) || [];

        this.configs = await Promise.all(resultPromiseList);
        return this.configs;
    }

}