"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/weekly");
  }, []);

  return <div className="bg-white h-screen"></div>;
}
