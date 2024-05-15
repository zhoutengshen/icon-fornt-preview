export const getFileType = (filename: string) => {
    const regex = /\.[^.]+$/;
    const match = filename.match(regex);
    return match ? match[0] : null; // 如果匹配到则返回后缀（包括点），否则返回null
};


export const isJsonFile = (filename: string) => {
    const ext = getFileType(filename);
    if (!ext) {
        return false;
    }
    return ext.toUpperCase().includes('JSON');
};