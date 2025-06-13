// src/components/DialogueBox.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DialogueBoxProps = {
  speaker: string;
  text: string;
  onClick: () => void;
};

const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  text,
  onClick,
}) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <AnimatePresence>
      <motion.div
        key={text}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white text-black p-4 rounded-md shadow-md max-w-xl ml-auto cursor-pointer"
        onClick={onClick}
      >
        <p className="text-2xl font-semibold text-neutral-700 mb-1">
          {speaker}
        </p>
        <p>{displayedText}</p>
      </motion.div>
    </AnimatePresence>
  );
};

export default DialogueBox;
