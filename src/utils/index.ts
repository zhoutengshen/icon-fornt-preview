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

export const svg2ImgBase64 = (sgvIcon: string) => {
    return `data:image/svg+xml;base64,${Buffer.from(sgvIcon).toString('base64')}`;
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