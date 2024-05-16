import { IConfig } from "../service/config";
import { IBasicParser, IParserResult } from "./basic";
import { IconfontParser } from './iconfont';

/** 工厂 */
export class ParserFactory {
    private static parserMap: Record<string, IBasicParser> = {
        'iconfont': new IconfontParser()
    };

    static transform(config: IConfig): IParserResult[] {
        const parserName = config.parser;
        const parser = ParserFactory.parserMap[parserName];
        return parser.transform();
    }
}