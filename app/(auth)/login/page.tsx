"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/app/providers/auth-provider";

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();

  const onSubmit = async (data: any) => {
    try {
      await login(data);
    } catch (error) {
      console.error("Failed to login", error);
      // Adicione um feedback para o usuário aqui
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} placeholder="Email" type="email" />
        <input
          {...register("password")}
          placeholder="Password"
          type="password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage; 