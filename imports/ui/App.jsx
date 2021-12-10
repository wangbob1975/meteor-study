import React, { useState, Fragment } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Task } from "./Task";
import { TasksCollection } from "../db/TasksCollection";
import { TaskForm } from "./TaskForm";
import { LoginForm } from "./LoginForm";
import { Meteor } from "meteor/meteor";
// import { compose } from "@mui/system";

// 向数据库里更新数据
const toggleChecked = ({ _id, isChecked }) => {
  Meteor.call("task.setIsChecked", _id, !isChecked);
  // 根据 id 来更新数据
  TasksCollection.update(_id, {
    // 添加复选框的操作状态
    $set: {
      isChecked: !isChecked, //复选框选中状态
    },
  });
};

// 删除数据
// 根据子组件传过来的 id 进行删除
const deleteTask = ({ _id }) => {
  console.log(_id);
  Meteor.call("task.remove", _id);
  TasksCollection.remove(_id);
};

// 组件 app
export const App = () => {
  // 获取用户,没有返回 null
  const user = useTracker(() => Meteor.user());

  // 定义未完成的任务 复选框的选中和未选中状态
  // 根据 按钮来控制  显示未完成任务,隐藏已完成的任务
  // $ne mongodb 语法 不等于
  const hideCompletedFilter = { isChecked: { $ne: true } };

  // 控制按钮名称 显示/隐藏 默认隐藏
  const [hideCompleted, setHideCompleted] = useState(false);

  // 用户过滤 任务
  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  // 获取 mongodb 里的值
  // 返回是数组类型
  const { tasks, pendingTasksCount, isLoading } = useTracker(() => {
    const noDataAvailable = { tasks: [], pendingTasksCount: 0 };
    if (!Meteor.user()) {
      return noDataAvailable;
    }

    const handler = Meteor.subscribe("tasks");

    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    //find() 条件查找
    // hideCompleted ? hideCompletedFilter : {}  根据按钮来控制任务的显示隐藏
    // 显示 全部任务, 隐藏已经完成的任务
    const tasks = TasksCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter,
      {
        sort: { createdAt: -1 },
      }
    ).fetch();

    const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

    return { tasks, pendingTasksCount };
  });

  // 登出操作
  const logout = () => Meteor.logout();

  // 显示待处理的任务数
  // const pendingTasksCount = useTracker(() => {
  //   if (!user) {
  //     return 0;
  //   }

  //   // find() 查询数据库, 参数表示查询的条件
  //   // 查找所有未完成的任务
  //   return TasksCollection.find(hideCompletedFilter).count();
  // });

  // pendingTasksCount  有值就显示, 没值就不显示
  const pendingTasksTitle = `${
    pendingTasksCount ? `(${pendingTasksCount})` : ""
  }`;

  return (
    <div className="app">
      {/* 头部 */}
      <header>
        <div className="app-bar">
          <div className="app-header">
            <h1>todo list {pendingTasksTitle}</h1>
          </div>
        </div>
      </header>
      {/* 主体部分 */}
      <div className="main">
        {/* 没有用户显示登录组件 */}
        {user ? (
          // 表单增加部分
          <Fragment>
            <div className="user" onClick={logout}>
              {user.username}--退出
            </div>
            <TaskForm user={user} />
            <div className="filter">
              {/* 显示 / 隐藏 按钮 */}
              <button onClick={() => setHideCompleted(!hideCompleted)}>
                {hideCompleted ? "显示" : "隐藏"}
              </button>
            </div>
            {isLoading && <div className="loading">loading...</div>}

            {/* 数据展示 */}
            <ul className="tasks">
              {/* 遍历数据 */}
              {tasks.map((task) => (
                <Task
                  key={task._id}
                  task={task}
                  onCheckboxClick={toggleChecked}
                  onDeleteTask={deleteTask}
                />
              ))}
            </ul>
          </Fragment>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
};
