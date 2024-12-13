import useSpeakingStore from "@/stores/useSpeakingStore";
import { motion } from "framer-motion";
import { useState } from "react";

export const MiniTuber = () => {
    const { isSpeaking, setSpeaking } = useSpeakingStore();
    const floatVariants = {
      idle: {
        y: [0, -10, 0],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
      speaking: {
        y: [0, -20, 0],
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    };
    return (
      <div className="flex flex-col items-center">
        {/* Image */}
        <motion.img
          src={isSpeaking ? "/avatar/avatar_open.png" : "/avatar/avatar_close.png"}
          alt="MiniTuber"
          className="w-full h-full"
          variants={floatVariants}
          animate={isSpeaking ? "speaking" : "idle"}
        />
          {/* {isSpeaking ? "Stop Talking" : "Start Talking"} */}
      </div>
    );
  };