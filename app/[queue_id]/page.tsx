"use client";

import { ChatBox, resetChatBot } from "@/components/chat";
import { notFound } from "next/navigation";
import Image from "next/image";
import { use, useEffect, useRef, useState } from "react";
import { MiniTuber } from "@/components/avatar";
import { useStepStore } from "@/stores/useStepStore";
import Breadboard from "@/components/breadboard";
import useChatbotStore from "@/stores/useChatbotStore";
import { useRouter } from "next/navigation";

const finish_keyword = "ฉันได้ข้อมูลที่ต้องการครบแล้วค่ะ";

export default function PMM({
  params,
}: {
  params: Promise<{ queue_id: string }>;
}) {
  const { queue_id } = use(params);
  const { messages, initMessages } = useChatbotStore();
  const router = useRouter();

// Push to finish page   
  useEffect(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].text.includes(finish_keyword) && 
      messages[messages.length - 1].sender == "nurse"
    ) {
      console.log("Finish keyword detected in the latest message.");
      router.push("/finish");
    }
  }, [messages]);
  if (!isValidQueue(queue_id)) {
    // Return a 404 page if the slug doesn't match the requirements
    notFound();
  }
  const { stepState, updateStepStatus } = useStepStore();
  const {} = useChatbotStore();
  useEffect(() => {
    updateStepStatus(0, 2);
    updateStepStatus(1, 1);
    updateStepStatus(2, 0);
    // Reset Chat Data When Page Loaded
    initMessages();
    resetChatBot();
  }, [updateStepStatus]);

  return (
    <main className="h-screen w-screen ">
      <div className="h-[75px] w-full flex items-center">
        <div className="text-4xl ml-20 text-blue-700">
          คิวของคุณ: <b className="font-bold text-5xl">{queue_id}</b>
        </div>
      </div>
      <div className="h-[80%] w-full flex justify-center items-center">
        <div className="h-full w-full flex flex-col-reverse sm:flex-row justify-center items-center">
          <div className="h-full w-full pt-10 flex flex-col justify-center items-center gap-14">
            <Breadboard />
            <ChatBox />
          </div>
          <div className="relative h-full w-3/5 flex justify-center items-center">
            <MiniTuber />
          </div>
        </div>
      </div>
    </main>
  );
}

function isValidQueue(queue_id: string): boolean {
  // Check if slug exists and has minimum required length
  if (!queue_id || queue_id.length != 4) {
    return false;
  }

  // Check first letter is uppercase A-Z
  const firstLetter = queue_id.charAt(0);
  if (!/^[A-Z]$/.test(firstLetter)) {
    return false;
  }

  // Check last 3 characters are numbers
  const lastThreeChars = queue_id.slice(-3);
  if (!/^\d{3}$/.test(lastThreeChars)) {
    return false;
  }

  return true;
}
