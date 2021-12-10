import React from "react";

// { task, onCheckboxClick, onDeleteTask }  相当于 props 解构赋值 处理
export const Task = ({ task, onCheckboxClick, onDeleteTask }) => {
  // console.log("task", task);
  return (
    <li>
      <input
        type="checkbox"
        checked={!!task.isChecked}
        // 子传父
        onClick={() => onCheckboxClick(task)}
        readOnly
      />
      <span>{task.text}</span>
      <button onClick={() => onDeleteTask(task)}>删除</button>
    </li>
  );
};
