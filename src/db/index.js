// 与main和preload同级别，注入到main和preload中
import process from "node:process";

const { Sequelize } = require("sequelize");
const path = require("path");

const _dbname = "toolbox.sqlite";
const _file = process.env.NODE_ENV === "development" ? path.join("D:\\lib\\Toolbox", _dbname) : path.join(process.cwd(), _dbname);

// 所有文件预创建均使用preload来完成
const _sequelize = new Sequelize({
  dialect: "sqlite",
  storage: _file
});


export { _sequelize as sequelize, _file as db_path };
