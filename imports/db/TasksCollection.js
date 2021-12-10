import { Mongo } from "meteor/mongo";
// 创建连接 mongodb 数据库的实例
export const TasksCollection = new Mongo.Collection("tasks");
