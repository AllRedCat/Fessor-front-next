"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/app/providers/auth-provider";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const { register: formRegister, handleSubmit } = useForm();
  const { register: authRegister } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      await authRegister(data);
      router.push('/(auth)/login');
    } catch (error) {
      console.error("Failed to register", error);
      // Adicione um feedback para o usuário aqui
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...formRegister("name")} placeholder="Name" />
        <input {...formRegister("email")} placeholder="Email" type="email" />
        <input
          {...formRegister("password")}
          placeholder="Password"
          type="password"
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage; 