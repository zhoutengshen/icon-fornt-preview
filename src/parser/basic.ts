import { IConfig } from "../service/config";

export interface IParserResult {
    id: string
    base64: string
    progId?: string
    name: string
}

export interface IBasicParser {
    transform(config: IConfig): IParserResult[]
}