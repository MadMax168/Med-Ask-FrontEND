"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MiniTuber } from "@/components/avatar";
import Breadboard from "@/components/breadboard";
import { useStepStore } from "@/stores/useStepStore";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  // 0: unfinished, 1: inprogress, 2: finished
  const { stepState, updateStepStatus } = useStepStore();
  useEffect(() => {
    updateStepStatus(0, 1);
    updateStepStatus(1, 0);
    updateStepStatus(2, 0);
    // console.log(stepState);
  }, [updateStepStatus]);

  const QSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputValue = inputRef.current?.value.trim();
    if (inputValue?.match(/^^[A-B][0-9]{3}$/)) {
      router.push(`/${inputValue}`);
      const audio = new Audio("/sound/sawasdee.mp3");
      audio.play();
    } else {
      alert("We do not have this queue, please try again.(Ex.A001)");
    }
  };

  return (
    <main className="h-screen w-screen flex">
      <div className="h-screen w-3/5 flex flex-col justify-center items-center">
        {/* Breadboard */}
        <Breadboard />
        <div className="h-1/2 w-3/5 flex flex-col py-12 gap-12 items-center">
          <div className="text-3xl">สวัสดีค่ะ, ยินดีต้อนรับคนไข้</div>
          <div className="transition-all text-5xl font-bold tracking-wide">
            กรุณากรอกเลขคิว
          </div>
          <form onSubmit={QSubmit} className="h-16 w-full flex gap-3">
            <Input ref={inputRef} type="text" placeholder="A001" />
            <a href="" className="h-full w-2/5">
              <Button
                type="submit"
                className="h-full w-full text-xl bg-green-700"
              >
                SUBMIT
              </Button>
            </a>
          </form>
        </div>
      </div>
      <div className="h-screen w-2/5 flex justify-center items-center">
        <MiniTuber />
      </div>
    </main>
  );
}
