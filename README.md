# vue-start

本项目是在我学习 webpack v4 的时候搭建的 vue-webpack demo

为什么在有 `vue-cli` 这类脚手架工具后还需要自己学着搭建呢？

1. 自己搭建一个项目可以加深对 webpack 的理解，包括各个插件，各个 loaders 等
2. webpack v4 和之前版本有不少 breaking change 所以是学习 webpack 新版本的好时机
3. 平日里做的项目可以使用自己简单搭建的项目框架，而不用借用庞大的由官方生成的框架
4. 自己搭建项目，可以完全理解搭建的各个步骤的用意，有助于开发，也有助于对生产和开发不同环境的理解

在学习的过程中希望用两种方式来完成项目的搭建：
1. `npm script`
2. 使用命令行脚本加上 webpack 自身的 webpack api 的方式

支持：
1. 公共代码提取
2. 热加载，以及自定义热加载内容输出
3. 打包后的模块分析
4. `less` `stylus` `postcss` `pug`
5. ES6
6. 缓存优化
7. js Tree Shaking
