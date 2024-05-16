import { IConfig } from "../service/config";
import { svg2ImgBase64 } from "../utils";
import { isExistFile } from "../utils/file";
import { IBasicParser, IParserResult } from "./basic";
import * as vs from 'vscode';

// 阿里字体图标解析（提取）
export class IconFontParser implements IBasicParser {
    async transform(config: IConfig): Promise<IParserResult[]> {
        const { target, workspace } = config;
        const fullPath = vs.Uri.joinPath(vs.Uri.parse(workspace!), target);
        const isExist = await isExistFile(fullPath);
        if (!isExist) {
            return [];
        }
        const content = await vs.workspace.fs.readFile(fullPath).then(resp => resp.toString());
        // iconFontPrefix 扩展属性
        return this.extractSvgSymbol(content, config.iconFontPrefix);
    }

    // 抽取svg symbol信息
    private extractSvgSymbol(content: string, iconPrefix: string = '') {
        console.log('抽取阿里Svg图标');
        
        // prog-id window._iconfont_svg_string_4152733 =
        const reg = /_iconfont_svg_string_(\d+)/g;
        const progId = (content.match(reg) && RegExp.$1) || '';
        // <svg><symbol id="videocamera" viewBox="0 0 1024 1024"><path>...</path></symbol></svg>
        const svgSymbolList: IParserResult[] = content.match(/<symbol id="(.+?)" viewBox="(.+?)">(.+?)<\/symbol>/g)?.map((s) => {
            let id = s.match(/id="(.+?)"/)?.[1] || '';
            id = id?.replace(iconPrefix, '') || '';
            const viewBox = s.match(/viewBox="(.+?)"/)?.[1] || '';
            const path = s.match(/<symbol .+?>(.+?)<\/symbol>/)?.[1] || '';
            const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${path}</svg>`;
            const miniSvgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 1024 1024">${path}</svg>`;
            const base64 = svg2ImgBase64(svgIcon);
            const icon = svg2ImgBase64(miniSvgIcon);
            return { id, base64, progId, icon, name: id };
        }) || [];
        return svgSymbolList;
    }
}