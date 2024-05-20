import * as vs from 'vscode';
import { isExistFile } from '../utils/file';
import pckJson from '../../package.json';

// 文件系统
const { fs } = vs.workspace;


/** 配置文件接口 */
export interface IConfig {
    /** 标签名称 */
    tagName?: string
    /** 属性名 */
    propName?: string
    /** 图标地址(本地或者http/https地址) */
    target: string
    /** 解析器 */
    parser: string
    /** 工作目录 */
    workspaceFolder: string
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
        if (this.configs?.length === 1) {
            return this.configs[0];
        }
        return this.configs?.find(item => {
            const { workspaceFolder } = item;
            if (!workspaceFolder) {
                return false;
            }
            // 判断了 Uri 是否是包含关系
            const targetUri = vs.Uri.parse(workspaceFolder);
            const curUri = vs.window.activeTextEditor?.document.uri;
            const isInclude = curUri && curUri.fsPath.includes(targetUri.fsPath);
            return isInclude;
        });
    }

    /**
     * 加载工作空间配置文件
     * icon-preview.config.json 文件优先于 vscode setting 配置
     * 从四个地方获取配置文件
     *  1. 当前项目的根目录下
     *  2. 当前项目的 .vscode 目录下 icon-preview.config.json
     *  3. 当前项目的 .vscode/setting.json
     *  4. 全局的 setting.json
     */
    public async loadWorkspaceConfig() {
        let configList: IConfig[] = [];
        const iconPreviewConfigs = await this.loadWorkspaceIconPreviewConfig();
        if ((iconPreviewConfigs).length) {
            configList = iconPreviewConfigs;
        }
        const settingConfigs = await this.loadWorkspaceSettingConfig();
        if ((settingConfigs).length) {
            configList = settingConfigs;
        }
        if (!configList.length) {
            console.log('没有找到配置文件');
        }
        this.configs = configList;
        return this.configs;
    }

    /**
     * 加载setting 的配置
     * @returns 
     */

    private async loadWorkspaceSettingConfig() {
        const progName = pckJson.name;
        const orginConfig = vs.workspace.getConfiguration(progName);

        const config: IConfig = {
            target: '',
            parser: '',
            tagName: '',
            propName: '',
            iconFontPrefix: '',
            workspaceFolder: vs.workspace.workspaceFolders?.[0].uri.toString()!,
        };

        Object.keys(config).forEach(key => {
            const value = orginConfig.get(key);
            if (value) {
                // @ts-ignore
                config[key] = value;
            }
        });
        if (config && config) {
            return [config];
        }
        return [];
    }

    private async loadWorkspaceIconPreviewConfig() {
        const fileName = 'icon-preview.config.json';
        // 根
        const rootUriPromiseList = vs.workspace.workspaceFolders?.map(async item => {
            let config = null;
            // 根目录配置文件
            const proConfigPath = vs.Uri.joinPath(item.uri, fileName);
            // 项目.vscode/icon-preview.config.json
            const proVscodeConfigPath = vs.Uri.joinPath(item.uri, '.vscode', fileName);
            if (await isExistFile(proConfigPath)) {
                config = {
                    path: proConfigPath,
                    workspace: item.uri,
                    isExist: true
                };
            } else if (await isExistFile(proVscodeConfigPath)) {
                config = {
                    path: proVscodeConfigPath,
                    workspace: item.uri,
                    isExist: true
                };
            }
            return config;
        }) || [];
        let rootUris = (await Promise.all(rootUriPromiseList)).filter(item => item && item.isExist);
        if (rootUris.length) {
            const resultPromiseList = rootUris.filter(v => !!v).map(async config => {
                const path = config!.path;
                const workspace = config!.workspace;
                const resp = await fs.readFile(path);
                const jsonStr = resp.toString();
                console.log(`加载${path.toString()}工作空间配置文件`);
                return {
                    ...JSON.parse(jsonStr) as IConfig,
                    workspace: workspace.toString()
                };
            }) || [];

            return await Promise.all(resultPromiseList);
        }
        return [];
    }

}