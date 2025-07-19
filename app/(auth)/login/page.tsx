"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/app/providers/auth-provider";

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setError(null);
      setIsLoading(true);
      await login(data);
    } catch (error: any) {
      console.error("Failed to login", error);
      setError(error.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center text-black">Login</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input 
              {...register("email")} 
              placeholder="Email" 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <input
              {...register("password")}
              placeholder="Password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "Fazendo login..." : "Login"}
          </button>
        </form>
        <a className="text-sky-500" href="/register">Registre-se</a>
      </div>
    </div>
  );
};

export default LoginPage; 