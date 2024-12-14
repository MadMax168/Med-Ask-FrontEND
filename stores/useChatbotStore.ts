import { create } from 'zustand';
import React, { useState } from 'react';

interface ChatbotState {
    inputMessage: string;
    setInputMessage: (message: string) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    isSpeaking: boolean;
    setSpeaking: (value: boolean) => void;
    messages: ExtendedMessage[];
    initMessages: () => void;
    setMessages: (messages: ExtendedMessage) => void;
    setFeedback: (id: number, feedback: "liked" | "disliked" | null) => void;
}

export interface ExtendedMessage {
    id: number;
    text: string;
    sender: "user" | "nurse";
    type: string;
    feedback?: "liked" | "disliked" | null;
}
const init_messages: ExtendedMessage[] = [
    {
        id: 1,
        text: "สวัสดีค่ะ ดิฉัน มะลิ เป็นพยาบาลเสมือนที่จะมาดูแลการซักประวัตินะคะ",
        sender: "nurse",
        type: "",
        feedback: null,
    },
]
const useChatbotStore = create<ChatbotState>((set) => ({
    inputMessage: "",
    setInputMessage: (message) => set({ inputMessage: message }),
    isLoading: false,
    setIsLoading: (loading) => set({ isLoading: loading }),
    error: null,
    setError: (error) => set({ error }),
    isSpeaking: false,
    setSpeaking: (value) => set({ isSpeaking: value }),
    messages: init_messages,
    initMessages: () => set(() => ({ messages: init_messages })),
    setMessages: (messages) => set((state) => ({ messages: [...state.messages, messages] })),
    setFeedback: (id, feedback) => set((state) => ({
        messages: state.messages.map((message) =>
            message.id === id ? { ...message, feedback } : message
        ),
    })),
}));

export default useChatbotStore;
