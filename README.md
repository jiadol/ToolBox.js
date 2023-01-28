# toolbox.js

An Electron application with Vue

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

# 打包注意事项

1. 不能一股脑排除node_modules
2. 不能完全不排除node_modules,只能尽量减少dependences的大小
3. 使用extraResources项避免二次打包
4. 使用yarn autoclean --force,删除node_modules包中的无用文件，详见.yarnclean,去除各类文本文件后可减少约50M
