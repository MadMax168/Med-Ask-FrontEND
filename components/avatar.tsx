import useChatbotStore from "@/stores/useChatbotStore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Volume, Volume1, Volume2 } from "lucide-react";

const VolumeLoop = () => {
  const [volumeIcon, setVolumeIcon] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVolumeIcon((prev) => (prev + 1) % 3);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const size = 200,
    strokeWidth = 1.5;
  return (
    <div>
      {volumeIcon === 0 && <Volume strokeWidth={strokeWidth} size={size} />}
      {volumeIcon === 1 && <Volume1 strokeWidth={strokeWidth} size={size} />}
      {volumeIcon === 2 && <Volume2 strokeWidth={strokeWidth} size={size} />}
    </div>
  );
};
export const MiniTuber = () => {
  const { isSpeaking, setSpeaking } = useChatbotStore();
  const fadeVariants = {
    hidden: { opacity: 0, duration: 0.5 },
    visible: { opacity: 1, duration: 0.5 },
  };
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
const volumeVariants = {
    speaking: {
        rotate: [0, -1, 1, 0],
        scale: [1, 1.1, 1],
        transition: {
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

  return (
    <div className="relative flex flex-col items-center">
      {/* Image */}
    <motion.div
      variants={floatVariants}
      animate={isSpeaking ? "speaking" : "idle"}
    >
      <motion.img
        src={
        isSpeaking ? "/avatar/avatar_open.png" : "/avatar/avatar_close.png"
        }
        alt="MiniTuber"
        className="w-full h-full"
      />
    </motion.div>
      {isSpeaking ? (
        <motion.div
          className="absolute text-yellow-200 animate-pulse left-0"
          variants={volumeVariants}
          animate={isSpeaking ? "speaking" : "speaking"}
        >
          <VolumeLoop />
        </motion.div>
      ) : (
        ""
      )}
    </div>
  );
};
