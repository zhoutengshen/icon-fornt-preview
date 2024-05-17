# 如何使用：
### 方法1：在项目的根创建

# 字体图标预览，vscode 插件 icon-preview.config.json 文件
```json
{
    // 标签名称,例如：<my-icon name="close" />的<my-ico
    "tagName": "my-icon",
    // 图标对应的属性名称，用于正则匹配，例如 <my-icon proName="close" />的proName
    "propName": "name",
    // 被提取图标的文件路径，例如放在项目根下面的iconfont.js
    // iconfont.js 是阿里图标的 Symbol 图标。例如：https://at.alicdn.com/t/c/font_4000788_1bqyuxtf29e.js
    "target": "iconfont.js", 
    // 转换器类型：用于如何提取图标信息，当前只实现了阿里图标，可选值: "iconfont"
    "parser": "iconfont",
    // 图标前缀（暂时没用）
    "iconFontPrefix": "icon-"
}
```

# 方法2：.vscode/setting 问价读取

### 鼠标悬停
![hover](https://github.com/zhoutengshen/icon-fornt-preview/blob/main/doc/dome.jpg)

### 提示
![completion](https://github.com/zhoutengshen/icon-fornt-preview/blob/main/doc/dome-hover.png)