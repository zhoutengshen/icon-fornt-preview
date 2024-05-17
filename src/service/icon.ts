import { IParserResult } from "../parser/basic";
import { ParserFactory } from "../parser/factory";
import ConfigService from "./config";

export class IconService {

    private static iconList: IParserResult[] | null = null;

    /** 加载图标 */
    static async load() {
        const configList = await ConfigService.getInstance().getWorkspaceConfig();
        if (configList.length) {
            console.log("加载图标");
        }
        const resultPromiseList = configList.map(async config => {
            return await ParserFactory.transform(config);
        });
        // [][]
        const resultList = (await Promise.all(resultPromiseList)).flat();
        this.iconList = resultList;
        return this.iconList;
    }

    /**
     * 获取图标信息，如果已经加载过了，获取缓存
     * @returns 
     */
    static getIconList() {
        if (this.iconList?.length) {
            return this.iconList;
        }
        this.load();
        return [];
    };
}