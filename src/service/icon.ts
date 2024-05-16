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

        // const iconList = [
        //     {
        //         "id": "no-videocamera",
        //         "viewBox": "0 0 1024 1024",
        //         "base64": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiPjxwYXRoIGQ9Ik01NzYuNTQzMDMgMjM0LjcxMzIxMmM2Ljg4ODcyNy00LjUzMDQyNCAxNC45NTY2MDYtNi45NTA3ODggMjMuMjEwNjY3LTYuOTUwNzg4IDEwLjk1MzY5NyAwLjI3OTI3MyAyMS40MTA5MDkgNC43MTY2MDYgMjkuMTY4NDg1IDEyLjM4MTA5MSA3Ljc1NzU3NiA3LjY2NDQ4NSAxMi4yNTY5NyAxNy45OTc1NzYgMTIuNTM2MjQyIDI4Ljg1ODE4MiAwIDguMTI5OTM5LTIuNDUxMzk0IDE2LjEwNDcyNy03LjAxMjg0OCAyMi44NjkzMzNhNDEuNjExNjM2IDQxLjYxMTYzNiAwIDAgMS0xOC43NDIzMDMgMTUuMjA0ODQ5IDQyLjIwMTIxMiA0Mi4yMDEyMTIgMCAwIDEtNDUuNDU5Mzk0LTguOTY3NzU4IDQwLjc0Mjc4OCA0MC43NDI3ODggMCAwIDEtOS4wMjk4MTgtNDQuOTAwODQ4YzMuMTAzMDMtNy41NDAzNjQgOC40NzEyNzMtMTMuOTYzNjM2IDE1LjMyODk2OS0xOC40OTQwNjF6TTE2MC4xNzg0MjQgNjM5LjkwNjkwOUwxNS41MTUxNTIgNDU4LjU2NTgxOGw1NS42MzczMzMtMTkuMjM4Nzg4IDE0NC42NjMyNzMgMTgxLjM0MTA5MS01NS42MzczMzQgMTkuMjM4Nzg4eiBtNTU5LjE2NjA2MS01MjIuMDUzODE4bDEwMC4xNjU4MTggMzEzLjIxOTg3OWMyLjg1NDc4OCA2LjU3ODQyNCAyLjk3ODkwOSAxMy45NjM2MzYgMC4zNzIzNjQgMjAuNjY2MTgyYTI3LjYxNjk3IDI3LjYxNjk3IDAgMCAxLTE0LjI3Mzk0IDE1LjA0OTY5NkwyOTYuNDk0NTQ1IDY1MC44OTE2MzZhMTAuMzAyMDYxIDEwLjMwMjA2MSAwIDAgMS04LjM0NzE1MSAyLjczMDY2NyAzNC4zODE1NzYgMzQuMzgxNTc2IDAgMCAxLTIyLjI0ODcyNy0xMC45ODQ3MjdMNDYuMTExMDMgMzcwLjYyNTkzOWEyNy4zMDY2NjcgMjcuMzA2NjY3IDAgMCAxLTUuNTg1NDU0LTI0LjczMTE1MSAyOS4wNDQzNjQgMjkuMDQ0MzY0IDAgMCAxIDE2LjcyNTMzMy0xOS4yMzg3ODhsNjI1Ljk0MzI3My0yMjUuMjhhMzAuOTY4MjQyIDMwLjk2ODI0MiAwIDAgMSAyMi4yNzk3NTcgMGM2LjA1MDkwOSA0LjE1ODA2MSAxMC44NjA2MDYgOS44MzY2MDYgMTMuOTAxNTc2IDE2LjQ3NzA5MXogbS02MDYuNDU2MjQzIDI0NC41MTg3ODhsMTgzLjYwNjMwMyAyMjguMDcyNzI3IDQ2MS44MjQtMTY3LjU5NDY2Ny04MC42Nzg3ODctMjYzLjc1NzU3NS01NjQuNzUxNTE2IDIwMy4zMTA1NDV6IG02NTMuNzc3NDU1IDIzNy4zODE4MTh2LTEuMDU1MDNoNS44NjQ3MjdjLTEuOTg1OTM5IDAuMzEwMzAzLTMuOTQwODQ4IDAuNjgyNjY3LTUuODk1NzU3IDEuMDg2MDZ6IG0tMTIzLjM3NjQ4NSA3OS41NjE2OTdsLTI5LjYzMzkzOS01NS45MTY2MDYgMTU4LjU2NDg0OC01Ny42ODUzMzMtMTkuNDU2LTUyLjE5Mjk3LTQwMy4zOTM5MzkgMTQ1LjYyNTIxMiAzNi4xNTAzMDMgNDYuNzAwNjA2IDE3NS4yNTkxNTEtNjMuMjA4NzI3IDQxLjczNTc1OCA3OS42ODU4MThhMzEuNzc1MDMgMzEuNzc1MDMgMCAwIDAgMTIuNDc0MTgyIDEyLjU2NzI3MyAyMDEuMDc2MzY0IDIwMS4wNzYzNjQgMCAwIDEgMjguMzMwNjY2LTU1LjU0NDI0M3pNNzg5LjIyNDcyNyA3ODMuNjA4MjQybC05Mi44NzM2OTcgOTIuODczNjk3IDMyLjkyMzE1MiAzMi44OTIxMjIgOTIuODczNjk3LTkyLjg0MjY2NyA5Mi44NDI2NjYgOTIuODQyNjY3IDMyLjkyMzE1Mi0zMi44OTIxMjItOTIuODczNjk3LTkyLjg3MzY5NyA5Mi44NzM2OTctOTIuODQyNjY2LTMyLjg5MjEyMS0zMi44OTIxMjEtOTIuODczNjk3IDkyLjg0MjY2Ni05Mi44NzM2OTctOTIuODczNjk3LTMyLjg5MjEyMSAzMi44OTIxMjEgOTIuODQyNjY2IDkyLjg3MzY5N3oiIGZpbGw9IiNGRkZGRkYiID48L3BhdGg+PC9zdmc+",
        //         "progId": "4152733",
        //         "name": 'no-videocamera'
        //     },

        //     {
        //         "id": "quxiaoquanping",
        //         "viewBox": "0 0 1024 1024",
        //         "base64": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiPjxwYXRoIGQ9Ik0yOTguNjY2NjY3IDYzMS40NjY2NjdIMjI2LjEzMzMzM3YtODEuMDY2NjY3aDIxNy42djIwNC44aC04NS4zMzMzMzN2LTY4LjI2NjY2N2wtMTI4IDEyOEwxNzAuNjY2NjY3IDc1OS40NjY2NjdsMTI4LTEyOHogbTQyMi40IDBsMTI4IDEyOC01OS43MzMzMzQgNTkuNzMzMzMzLTEyOC0xMjh2NjguMjY2NjY3aC04NS4zMzMzMzNWNTU0LjY2NjY2N2gyMTcuNnY4MS4wNjY2NjZoLTcyLjUzMzMzM3pNMjk4LjY2NjY2NyAzNDEuMzMzMzMzTDE4Ny43MzMzMzMgMjMwLjQgMjQzLjIgMTcwLjY2NjY2N2wxMTUuMiAxMTUuMlYyMTcuNmg4NS4zMzMzMzN2MjA0LjhIMjI2LjEzMzMzM1YzNDEuMzMzMzMzSDI5OC42NjY2Njd6IG00MzAuOTMzMzMzIDBoNjR2ODEuMDY2NjY3aC0yMTcuNlYyMTcuNmg4NS4zMzMzMzN2NzIuNTMzMzMzTDc4MC44IDE3MC42NjY2NjdsNTkuNzMzMzMzIDU5LjczMzMzM0w3MjkuNiAzNDEuMzMzMzMzeiIgZmlsbD0iIzEyOTZEQiIgPjwvcGF0aD48L3N2Zz4=",
        //         "progId": "4152733",
        //         "name": 'quxiaoquanping'
        //     }
        // ];
    };
}