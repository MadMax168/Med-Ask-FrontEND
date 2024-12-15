import { create } from "zustand";


interface Step {
    step: string;
    status: number;
}

interface StepState {
    stepState: Step[];
    updateStepStatus: (index: number, status: number) => void;
}

export const useStepStore = create<StepState>((set) => ({
    stepState: [
        { step: "กรอกเลขคิว", status: 0 },
        { step: "ซักประวัติ", status: 0 },
        { step: "รอพบแพทย์", status: 0 },
    ],
    updateStepStatus: (index: number, status: number) => set((state) => ({
        stepState: state.stepState.map((step, i) =>
            i === index ? { ...step, status } : step
        ),
    }))
}));