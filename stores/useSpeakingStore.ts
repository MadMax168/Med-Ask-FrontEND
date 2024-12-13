import { create }  from "zustand";

interface SpeakingState {
  isSpeaking: boolean;
  setSpeaking: (value: boolean) => void;
}

const useSpeakingStore = create<SpeakingState>((set) => ({
    isSpeaking: false,
    setSpeaking: (value: boolean) => set({ isSpeaking: value }),
}));

export default useSpeakingStore;