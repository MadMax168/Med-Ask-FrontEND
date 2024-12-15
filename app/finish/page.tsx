"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStepStore } from "@/stores/useStepStore";
import Breadboard from "@/components/breadboard";

const FinishPage = () => {
  const [countdown, setCountdown] = useState(15);
  const router = useRouter();
  const { stepState, updateStepStatus } = useStepStore();
  useEffect(() => {
    updateStepStatus(0, 2);
    updateStepStatus(1, 2);
    updateStepStatus(2, 1);
    // console.log(stepState);
  }, [updateStepStatus]);
  useEffect(() => {
    if (countdown === 0) {
      router.push("/");
    }

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, router]);

  return (
    <div className="h-screen w-screen ">
      <div className="h-2/3 w-screen flex flex-col justify-center items-center">
        <div className="flex h-auto w-full my-24 justify-center items-center">
          <Breadboard />
        </div>
        <div className="h-1/3 w-full flex flex-col justify-center items-center">
          <h1 className="text-4xl text-green-600">สำเร็จ !</h1>
          <h1 className="text-3xl">ต่อไปโปรด<b className="font-semibold ">รอพบแพทย์</b>ที่จุดนัดพบ</h1>
          <p>Redirecting back in {countdown} seconds...</p>
        </div>
      </div>
    </div>
  );
};

export default FinishPage;
