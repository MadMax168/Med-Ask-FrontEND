"use client";

import { ChatBox } from "@/components/chat";
import { notFound } from "next/navigation";
import Image from "next/image";
import { use, useState } from "react";
import { MiniTuber } from "@/components/avatar";

export default function PMM({
  params,
}: {
  params: Promise<{ queue_id: string }>;
}) {
  const { queue_id } = use(params);
  if (!isValidQueue(queue_id)) {
    // Return a 404 page if the slug doesn't match the requirements
    notFound();
  }

  return (
    <main className="h-screen w-screen ">
      <div className="h-[75px] w-full flex items-center">
        <div className="text-4xl font-bold ml-20 text-blue-700">
          คิว: {queue_id}
        </div>
      </div>
      <div className="h-[80%] w-full flex justify-center items-center">
        <div className="h-full w-full flex flex-col-reverse sm:flex-row justify-center items-center">
          <div className="h-full w-full pt-10 flex justify-center">
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
