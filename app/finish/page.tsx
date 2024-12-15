"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStepStore } from "@/stores/useStepStore";
import Breadboard from "@/components/breadboard";
import { Star } from "lucide-react";

const FinishPage = () => {
  const [countdown, setCountdown] = useState(20);
  const router = useRouter();
  const { stepState, updateStepStatus } = useStepStore();
  const [rating, setRating] = useState(0);
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
          <h2></h2>
          <h1 className="text-3xl">ต่อไปโปรด<b className="font-semibold ">รอพบแพทย์</b>ที่จุดนัดพบ</h1>
          <div className="text-xl mt-8">โปรดให้คะแนนบริการของเรา</div>
          <div className="flex mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                fill={rating >= star ? "yellow" : "none"}
                className={`w-8 h-8 cursor-pointer ${
                  rating >= star ? "text-yellow-300" : "text-gray-300"
                } hover:text-yellow-300`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <p>Redirecting back in {countdown} seconds...</p>
        </div>
      </div>
    </div>
  );
};

export default FinishPage;
