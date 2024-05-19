import { IConfig } from "../service/config";
import { IBasicParser, IParserResult } from "./basic";
import { IconFontParser } from './iconfont';

/** 工厂 */
export class ParserFactory {
    private static parserMap: Record<string, IBasicParser> = {
        'iconfont': new IconFontParser()
    };

    static transform(config: IConfig): Promise<IParserResult[]> {
        const parserName = config.parser;
        const parser = ParserFactory.parserMap[parserName];
        if (!parser) {
            throw new Error(`parser ${parserName} not found`);
        }
        return parser.transform(config);
    }

    static getParser(config: IConfig): IBasicParser {
        const parserName = config.parser;
        const parser = ParserFactory.parserMap[parserName];
        if (!parser) {
            throw new Error(`parser ${parserName} not found`);
        }
        return parser;
    }

    /**
     * 注册
     * @param name 
     * @param parser 
     */
    static register(name: string, parser: IBasicParser) {
        ParserFactory.parserMap[name] = parser;
    }
}