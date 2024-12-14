"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStepStore } from '@/stores/useStepStore';

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
            router.push('/');
        }

        const timer = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown, router]);

    return (
        <div className='h-screen w-screen flex flex-col justify-center items-center'>
            <h1 className="text-4xl text-green-600">สำเร็จ !</h1>
            <h1 className="text-3xl">ต่อไปโปรดรอแพทย์ที่จุดนัดพบ</h1>
            <p>Redirecting back in {countdown} seconds...</p>
        </div>
    );
};

export default FinishPage;