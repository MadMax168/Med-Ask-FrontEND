"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchGeneratedVoice } from "@/api/tts";
import useChatbotStore, { ExtendedMessage } from "@/stores/useChatbotStore";
    
const API_BASE_URL = "https://microhum-mali-nurse-rest-api.hf.space";
const tts_service = "botnoi"; // "vaja9" | "botnoi"
const model_name = "openthaigpt"; 

export async function resetChatBot() {
    console.log("Fired Reset");
    try {
        await fetch(`${API_BASE_URL}/reset`, {
            method: "POST",
            headers: {},
        });
        console.log("Endpoint reset completed");
    } catch (error) {
        console.error("Error resetting endpoint:", error);
    }
}

export function ChatBox() {
  // Request Reset everytime component first loaded
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isLoading,
    setIsLoading,
    error,
    setError,
    setFeedback,
  } = useChatbotStore();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessageId = messages.length + 1;
    const newUserMessage: ExtendedMessage = {
      id: userMessageId,
      text: inputMessage,
      sender: "user",
      type: "user",
      feedback: null,
    };

    setInputMessage("");
    setMessages(newUserMessage);
    setIsLoading(true);
    setError(null);

    await getNurseResponse(inputMessage, userMessageId + 1);
  };

  const getNurseResponse = async (
    userInput: string,
    nurseMessageId: number
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/nurse_response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_input: userInput,
          model_name: model_name
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorBody}`
        );
      }

      const data = await response.json();
      console.log("Full API Response:", data);

      const nurseResponse =
        data.nurse_response ||
        data.response ||
        data.text ||
        "No response received";

      const newNurseMessage: ExtendedMessage = {
        id: nurseMessageId,
        text: nurseResponse,
        sender: "nurse",
        type: "nurse",
        feedback: null,
      };

      setMessages(newNurseMessage);
      handleGenerateVoice(nurseResponse);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = (messageId: number) => {
    setFeedback(messageId, "liked");
  };

  // AI Sound Synthesis Service
  const [loading, setLoading] = useState(false);
  const { isSpeaking, setSpeaking } = useChatbotStore();
  const handleGenerateVoice = async (text: string) => {
    setLoading(true);
    try {
      const mp3Blob = await fetchGeneratedVoice({
        service: tts_service,
        text: text,
      });
      const url = URL.createObjectURL(mp3Blob);
      const audio = new Audio(url);
      audio.play();
      setSpeaking(true);
      audio.onended = () => {
        setSpeaking(false);
      };
    } catch (e: any) {
      setError(e.message || "An error occurred while generating the voice");
    } finally {
      setLoading(false);
    }
  };

  const handleDislike = (messageId: number) => {
    setFeedback(messageId, "disliked");
  };

  return (
    <div className="h-full w-4/5 border rounded-t-xl p-2 bg-white flex flex-col gap-10">
      <div className="h-4/5 w-full p-2 overflow-y-auto bg-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user"
                ? "justify-end mb-6"
                : "justify-start mb-10"
            }`}
          >
            <div
              className={`relative max-w-[80%] p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-gray-100 text-black"
                  : "bg-gray-100 text-black"
              }`}
            >
              {message.text}
              {message.sender === "nurse" && (
                <div className="absolute -bottom-6 right-0 flex space-x-2 mt-2">
                  <button
                    onClick={() => handleLike(message.id)}
                    className={`flex items-center space-x-1 ${
                      message.feedback === "liked"
                        ? "text-green-600"
                        : "text-gray-500 hover:text-green-600"
                    }`}
                  >
                    <ThumbsUp size={16} />
                  </button>
                  <button
                    onClick={() => handleDislike(message.id)}
                    className={`flex items-center space-x-1 ${
                      message.feedback === "disliked"
                        ? "text-red-600"
                        : "text-gray-500 hover:text-red-600"
                    }`}
                  >
                    <ThumbsDown size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Skeleton Chatbox */}
        {isLoading && (
          <div className="flex justify-start mb-6">
            <div className="relative min-w-[80%] min-h-12 p-5 rounded-lg bg-gray-200 duration-1000 animate-pulse text-black"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="h-[50px] flex space-x-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your message..."
          className="flex-grow"
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading}
          className="h-full w-[150px]"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
