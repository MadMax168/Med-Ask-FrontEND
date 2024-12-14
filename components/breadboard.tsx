import React, { useState } from 'react';
import { create, useStore } from 'zustand';
import { useStepStore } from "@/stores/useStepStore"
const Breadboard = () => {
    const { stepState, updateStepStatus } = useStepStore();
    return (
        <div className="bg-gray-100 rounded-full grid grid-cols-3 justify-around items-center w-3/5 divide-x-[2px]">
            {stepState.map((step, index) => {
                const stepColor =
                    step.status === 2
                        ? "bg-green-200"
                        : step.status === 1
                        ? "bg-yellow-200 animate-pulse"
                        : "";
                return (
                    <div
                        key={index}
                        className={`${stepColor} transition-all py-3 ${
                            index === 0
                                ? "rounded-l-full"
                                : index === stepState.length - 1
                                ? "rounded-r-full"
                                : ""
                        }`}
                        style={{ transitionDuration: '500ms', animationDuration: '1.5s' }}
                    >
                        <div className="flex flex-col justify-center items-center">
                            {step.step}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Breadboard;