import { IConfig } from "../service/config";
import { svg2ImgBase64 } from "../utils";
import { IBasicParser, IParserResult } from "./basic";
import * as vs from 'vscode';

// 阿里字体图标解析（提取）
export class IconfontParser implements IBasicParser {
    transform(config: IConfig): IParserResult[] {
        const { target, workspace } = config;
        const fullPath = vs.Uri.joinPath(vs.Uri.parse(workspace!), target);
        // TODO: 判断文件是否存在
        vs.workspace.fs.readFile(fullPath);
        return [];
    }

    // 抽取svg symbol信息
    extractSvgSymbol(content: string, iconPrefix: string = 'icon-') {
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