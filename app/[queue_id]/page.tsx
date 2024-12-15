"use client";

import { ChatBox, resetChatBot } from "@/components/chat";
import { notFound } from "next/navigation";
import Image from "next/image";
import React, { use, useEffect, useRef, useState } from "react";
import { MiniTuber } from "@/components/avatar";
import { useStepStore } from "@/stores/useStepStore";
import Breadboard from "@/components/breadboard";
import useChatbotStore from "@/stores/useChatbotStore";
import { useRouter } from "next/navigation";
import { BookCheck, CircleX, MessageCircleWarning } from "lucide-react";
import router from "next/router";
import { fetchEHR, JSONReader } from "@/components/docfunc";

const finish_keyword = "ฉันได้ข้อมูลที่ต้องการครบแล้วค่ะ";

const ConfirmationForm: React.FC = () => {
  const router = useRouter();
  const [EHR_data, setEHR_data] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data: any = await fetchEHR();
      console.log(data);
      setEHR_data(data);
    }
    fetchData();
  }, []);
  return (
    <div className="absolute flex flex-col rounded-2xl justify-center items-center bg-gray-100 opacity-95 w-4/5 h-5/6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
      {/* <CircleX className="absolute top-5 right-5 size-12 text-red-600" /> */}
      <div className="max-h-[60%] w-[80%] p-6">
        <div className="w-full inline-flex mb-4 p-4 bg-yellow-600 round-xl justify-center items-center gap-5">
          <h1 className="text-2xl text-white font-bold">สรุปผล (Summary)</h1>
          <BookCheck className="size-10 text-white" />
          {/* <MessageCircleWarning /> */}
        </div>
        <JSONReader ehr_data={EHR_data} />
      </div>
      <div className="flex flex-col h-full w-full justify-center items-center">
        <div className="my-6 text-center">
          <div className="text-xl my-2">ยืนยันข้อมูลของคุณหรือไม่?</div>
          <p className="text-sm text-red-500">
            ⚠️ โปรดใส่ใจ:
            นี่คือข้อมูลของท่านที่จะถูกส่งต่อไปยังแพทย์ผู้เชี่ยวชาญ
          </p>
        </div>
        <div className="flex gap-6">
          <button
            className="bg-green-300 text-xl h-14 w-48 rounded-xl duration-200 hover:bg-green-400"
            onClick={() => router.push("/finish")}
          >
            ยืนยัน
          </button>
          <button
            className="bg-yellow-300 text-xl h-14 w-48 rounded-xl duration-200 hover:bg-yellow-400"
            onClick={() => window.location.reload()}
          >
            เริ่มใหม่
          </button>
        </div>
      </div>
    </div>
  );
};

export default function PMM({
  params,
}: {
  params: Promise<{ queue_id: string }>;
}) {
  const { queue_id } = use(params);
  const { stepState, updateStepStatus } = useStepStore();
  const { isFinished, setFinished, messages, initMessages } = useChatbotStore();
  // Push to finish page
  useEffect(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].text.includes(finish_keyword) &&
      messages[messages.length - 1].sender == "nurse"
    ) {
      console.log("Finish keyword detected in the latest message.");
      setFinished(true)
    }
  }, [messages]);
  if (!isValidQueue(queue_id)) {
    // Return a 404 page if the slug doesn't match the requirements
    notFound();
  }
  
  const init_page = (): void => {
    updateStepStatus(0, 2);
    updateStepStatus(1, 1);
    updateStepStatus(2, 0);
    setFinished(false);
    // Reset Chat Data When Page Loaded
    initMessages();
    resetChatBot();
  }
  
  useEffect(() => {
    init_page();
  }, []);

  return (
    <main className="h-screen w-screen  ">
      {isFinished ? (
        <ConfirmationForm />
      ) : ""}
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
