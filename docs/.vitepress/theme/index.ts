// .vitepress/theme/index.ts
import Theme from "vitepress/theme";
import "virtual:group-icons.css";

console.clear();
console.log(
  "%c熙熙的个人博客",
  `
    font-family: 'Microsoft YaHei', sans-serif;
    font-size: 100px;
    font-weight: bold;
    color: #ff6b6b;
    text-shadow:
      1px 1px 0 #999,
      2px 2px 0 #aaa,
      3px 3px 0 #bbb;
    padding: 8px;
    background: #f8f9fa;
    border-left: 4px solid #ff6b6b;
  `,
);

export default Theme;
