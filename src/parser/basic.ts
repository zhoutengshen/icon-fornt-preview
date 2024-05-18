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
    transform(config: IConfig): Promise<IParserResult[]>
}