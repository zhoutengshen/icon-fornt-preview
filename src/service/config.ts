
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
export class ConfigService {
    private static instance: ConfigService;
    private static config: IConfig;

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
     * 加载配置文件
     */
    public static loadConfig(url: string): void {
        
        return config;
    }

}