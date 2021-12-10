import React, { useState } from "react";
import { TasksCollection } from "../db/TasksCollection";

export const TaskForm = () => {
  const [text, setText] = useState("");

  // 表单提交事件
  const handleSubmit = (e) => {
    // 阻止默认行为
    e.preventDefault();
    //   判断 text 是否有值
    if (!text) return;
    // 向数据库中插入数据
    TasksCollection.insert({
      text: text,
      createdAt: new Date(), // 时间戳
      userId: user._id,
    });

    Meteor.call("tasks.insert", text);

    // 提交后清空 text 值
    setText("");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {/* 当输入框的值改变的时候，将text值更新 */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">add task</button>
    </form>
  );
};
