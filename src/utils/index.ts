import * as vs from 'vscode';



// 防抖函数
export const debounce = (fn: Function, delay: number) => {
    let timer: any = null;
    return function (...args: any) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(null, args);
        }, delay);
    };
};

/**
 * 将svg 转化为 base64 图片
 * @param sgvIcon 
 * @returns 
 */
export const svg2ImgBase64 = (sgvIcon: string) => {
    return `data:image/svg+xml;base64,${Buffer.from(sgvIcon).toString('base64')}`;
};

/**
 * svg 图像列表 <svg>['path', 'rect', 'circle']</svg>
 * 将多个svg path 合成一个svg
 * @param svgList 
 */
export const mergeSvgPathBeOne = (svgPathList: string[] = []) => {
    return `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%">${svgPathList.join('')}</svg>`;
};

export const isNetworkUrl = (url: string | vs.Uri) => {
    if (typeof url === 'string') {
        try {
            const u = vs.Uri.parse(url);
            return ['http', 'https'].includes(u.scheme);
        } catch (error) {
            return false;
        }
    }
    return ['http', 'https'].includes(url.scheme);
};