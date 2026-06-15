import React, { useState } from "react";
import request from "@/utils/request";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "@/store/authStore";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ← 阻止原生表单提交，页面就不会刷新了
    const params = new URLSearchParams({
      username,
      password,
    });
    const data: { access_token: string } = await request.post(
      "/auth/login",
      params,
    );
    navigate("/");
    console.log(data);
    dispatch(setToken(data.access_token));
  };
  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
