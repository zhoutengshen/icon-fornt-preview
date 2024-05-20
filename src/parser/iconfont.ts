import https from 'https';
import { IConfig } from "../service/config";
import { isNetworkUrl, svg2ImgBase64 } from "../utils";
import { isExistFile } from "../utils/file";
import { IBasicParser, IParserResult } from "./basic";

import * as vs from 'vscode';

// 阿里字体图标解析（提取）
export class IconFontParser implements IBasicParser {
    genCacheId(config: IConfig): string | undefined {
        if (isNetworkUrl(config.target)) {
            return `iconfont_${config.target}`;
        }
    }

    async transform(config: IConfig): Promise<IParserResult[]> {
        const { target } = config;
        let content;
        if (isNetworkUrl(target)) {
            content = await this.loadNetworkFile(config);

        } else {
            content = await this.loadLocalFile(config);
        }
        if (!content) {
            return [];
        }
        // iconFontPrefix 扩展属性
        return this.extractSvgSymbol(content, config.iconFontPrefix);
    }

    /**
     * 加载本地文件
     * @param config 
     */
    async loadLocalFile(config: IConfig) {
        const { target, workspaceFolder } = config;
        const fullPath = vs.Uri.joinPath(vs.Uri.parse(workspaceFolder), target);        
        const isExist = await isExistFile(fullPath);
        if (!isExist) {
            return "";
        }
        const content = await vs.workspace.fs.readFile(fullPath).then(resp => resp.toString());
        return content;
    }

    /**
     * 加载网络资源
     */
    async loadNetworkFile(config: IConfig) {
        return new Promise<string>((resolve, reject) => {
            const { target } = config;
            const request = https.get(target, (res) => {
                if (res.statusCode !== 200) {
                    console.log('请求失败', target);
                    return reject('请求失败');
                }
                const chunks: Buffer[] = [];
                res.on("data", (chunk: Buffer) => {
                    chunks.push(chunk);
                });
                res.on("end", () => {
                    const allData = Buffer.concat(chunks);
                    const stringData = allData.toString('utf8'); // 如果数据是字符串，可以指定编码
                    // console.log('Received data:', stringData);
                    resolve(stringData);
                });
                res.on("error", reject);
            });
            request.end();
            request.on('error', reject);
        });
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
            const base64 = svg2ImgBase64(svgIcon);
            return { id, base64, progId, name: id, graphics: path };
        }) || [];
        return svgSymbolList;
    }
}