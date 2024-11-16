工具链：Playwright、TypeScript、Mocha 和 Chai

步骤 1: 初始化项目
npm init -y

步骤 2: 安装必要的依赖
npm install playwright
npm install typescript ts-node @types/node --save-dev
npm install mocha @types/mocha --save-dev
npm install chai@4.3.10 @types/chai@4.3.10 --save-dev

步骤 3: 初始化 TypeScript 配置
运行以下命令生成 tsconfig.json：
npx tsc --init

编辑 tsconfig.json，确保以下配置：
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "types": ["node", "mocha"]
  },
  "include": ["**/*.ts"]
}

步骤 4: 配置 Mocha
在项目根目录下创建一个 mocha.opts 文件

--require ts-node/register
--timeout 10000
--recursive

步骤 5: 安装所需的浏览器二进制文件
npx playwright install