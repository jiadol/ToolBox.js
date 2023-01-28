// 与main和preload同级别，注入到main和preload中
import process from "node:process";

const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

const _dbname = "toolbox.sqlite";
const _file = process.env.NODE_ENV === "development" ? path.join("D:\\lib\\Toolbox", _dbname) : path.join(process.cwd(), _dbname);

// 所有文件预创建均使用preload来完成
const _sequelize = new Sequelize({
  dialect: "sqlite",
  storage: _file
});

//预处理将创建两个表，分别是Task表和Environment表
//分别保存用户执行的任务以及用户配置
const _task = _sequelize.define("Task", {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  service: { // service type 服务类型
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "未填写"
  },
  batch: { //处理了多少图片
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  // 自动生成createdAt和updatedAt，不需要自己定义了
  // start_time: {
  //   type: DataTypes.DATE,
  //   allowNull: false,
  //   defaultValue: DataTypes.NOW
  // },
  // end_time: {
  //   type: DataTypes.DATE,
  //   allowNull: true
  // },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "未完成"
  },
  result: {
    type: DataTypes.JSON,
    allowNull: true
  }
});

const _env = _sequelize.define("Environment", {
  KEY: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  VALUE: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "FLAG:NOT_SET"
  }
}, {
  timestamps: false
});

const _init = async () => {
  await _sequelize.sync({ force: true });
};
export { _sequelize as sequelize, _file as db_path, _task as taskDb, _env as envDb, _init as sqliteInit };
