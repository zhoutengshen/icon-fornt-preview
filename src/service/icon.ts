import { IParserResult } from "../parser/basic";
import { ParserFactory } from "../parser/factory";
import { parsePropValue } from "../utils/ui";
import ConfigService from "./config";

export class IconService {

    // 列表
    private static iconList: IParserResult[] | null = null;
    // 名称-图片 Map 映射（用于快速数据查找）
    private static iconMap = new Map<string, IParserResult>();

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

        // 获取映射数据
        this.iconMap.clear();
        resultList.forEach(icon => {
            this.iconMap.set(icon.name, icon);
        });
        return this.iconList;
    }

    /**
     * 获取图标信息，如果已经加载过了，获取缓存
     * @returns 
     */
    static getIconList() {
        if (!this.iconList?.length) {
            this.load();
        }
        return this.iconList || [];
    };

    /**
     * 根据图标名称，获取图标配置
     * @param name 
     * @returns 
     */
    static getIconByIconName(name: string) {
        if (!this.iconMap.size) {
            this.load();
        }
        return this.iconMap.get(name);
    }

    /**
     * 根据标签属性值获取图标配置
     * @param propValue 
     * @returns 
     */
    static getIconByPropValue(propValue: string) {
        const iconNameList = parsePropValue(propValue);
        const list = iconNameList.map(name => this.getIconByIconName(name));
        return list.filter(item => !!item) as IParserResult[];
    }
}