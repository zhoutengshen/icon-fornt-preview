import { IConfig } from "../service/config";

export interface IParserResult {
    id: string
    // 图像有效部分，例如 <path d="M0 0h24v24H0z" fill="none"/>
    // <rect x="0" y="0" width="24" height="24" fill="none"/>
    // <circle cx="12" cy="12" r="10"/> 等等
    graphics?: string
    base64: string
    progId?: string
    name: string
}

export interface IBasicParser {
    /**
     * 生成图标列表
     * @param config 
     */
    transform(config: IConfig): Promise<IParserResult[]>;

    /**
     * 缓存id生成规则，如果指定生成规则，那么缓存id将使用此规则生成
     * 生成时机：缓存文件不存在时
     * 返回undefined表示不缓存
     * @param config 
     */
    genCacheId(config: IConfig): string | undefined;
}