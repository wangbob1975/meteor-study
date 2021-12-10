// 登录表单
import { Meteor } from "meteor/meteor";
import React, { useState } from "react";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 提交表单,添加用户
  const submit = (e) => {
    e.preventDefault();
    Meteor.loginWithPassword(username, password);
  };

  return (
    <form onSubmit={submit} className="login-form">
      <label htmlFor="username">用户名</label>
      <input
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        name="username"
        required
      />
      <label htmlFor="">密码</label>
      <input
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        name="password"
        required
      />
      <button type="submit">登录</button>
    </form>
  );
};
