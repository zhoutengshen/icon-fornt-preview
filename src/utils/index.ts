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