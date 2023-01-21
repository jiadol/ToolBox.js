# 本项目基于Vue 3 + Vite + Electron实现，还处于开发阶段
# 采用Electron-store进行持久化存储
# 集成图像降噪放大，OCR识别，以图搜图等功能

# 感谢开源项目：
# https://github.com/nihui/waifu2x-ncnn-vulkan
# https://github.com/RapidAI/RapidOcrNcnn

build 步骤
运行npm run exe-build
注意以下几点
1.打包时在main.js里注释掉控制台
2.打包后在win-unpacked下加入两个包，再重新打包