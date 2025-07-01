"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/auth-provider";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>Carregando...</div>
    </div>
  );
}