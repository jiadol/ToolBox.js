import Dexie from "dexie";

// 单例模式
const db = new Dexie("Toolbox");

db.version(0.1).stores({
  tasks: "&uid,service,batch,status,result,startAt,endAt",
  settings: "key,value"
});

//这里采用手动配置设置
//因为1.设置项使用的控件不同，绑定方式不同造成代码膨胀
//2.不使用key，value表的话造成配置项不简洁
//3.不是所有配置项都是允许配置的，还有的是需要系统读取的
//判断Setting里的版本号来决断下一步操作
db.settings.get("VERSION").then(async res => {
  if (res) return;
  db.transaction("rw", db.settings, () => {
    db.settings.bulkPut([
      {
        key: "DEFAULT_SAVE_PATH",
        value: "EMPTY_PATH"
      },
      {
        key: "VERSION",
        value: "23.1.30"
      }
    ]);
  });
});
export default db;
