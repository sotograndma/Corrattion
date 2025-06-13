// src/scenes/StartScene.tsx
import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "../context/GameContext";

const StartScene: React.FC = () => {
  const { setScene } = useGame();
  const [showPopup, setShowPopup] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [showMusicConfirm, setShowMusicConfirm] = useState(false);
  const [playMusic, setPlayMusic] = useState(false);
  const musicRef = useRef<HTMLAudioElement>(
    new Audio("/assets/audio/music.mp3")
  );

  const handleStart = () => {
    const clickSound = new Audio("/assets/audio/click.mp3");
    clickSound.play();

    setIsFading(true);

    const powerDownSound = new Audio("/assets/audio/power_down.mp3");
    powerDownSound.play();

    if (playMusic) {
      musicRef.current.volume = 0.3;
      musicRef.current.loop = true;
      musicRef.current.currentTime = 0;
      musicRef.current.play();
    }

    setTimeout(() => {
      setScene("prologue");
    }, 10000);
  };

  const handleClickMouse = () => {
    if (!clicked) {
      setClicked(true);
      const audio = new Audio("/assets/audio/mouse_squeak.mp3");
      audio.play();
      document.body.style.cursor =
        'url("/assets/cursors/mouse_cursor.png"), auto';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-neutral-900 text-white relative">
      <button
        className="absolute top-4 left-4 music-button z-50"
        onClick={() => {
          const clickSound = new Audio("/assets/audio/click.mp3");
          clickSound.play();
          setShowMusicConfirm(true);
        }}
      >
        Play the game with the music on?
      </button>
      {showMusicConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.6)] z-50">
          <div className="bg-neutral-200 border-neutral-400 border-3 text-neutral-500 p-6 rounded-lg text-center w-[300px]">
            <p className="mb-4 text-5xl">Play with music on?</p>
            <p className="mb-4 text-2xl">
              The music's a bit creepy, so... maybe think twice?
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <button
                className="bg-lime-400 text-lime-700 hover:bg-lime-600 px-4 py-2 rounded-lg text-xl px-12"
                onClick={() => {
                  const clickSound = new Audio("/assets/audio/click.mp3");
                  clickSound.play();
                  setPlayMusic(true);
                  setShowMusicConfirm(false);
                }}
              >
                Yes
              </button>
              <button
                className="bg-red-400 text-red-700 hover:bg-red-600 px-4 py-2 rounded-lg text-xl px-12"
                onClick={() => {
                  const clickSound = new Audio("/assets/audio/click.mp3");
                  clickSound.play();
                  setPlayMusic(false);
                  setShowMusicConfirm(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <motion.h1
        className="text-9xl font-bold mb-20 flex items-center gap-2 relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <span>cor“</span>
        <motion.span
          onMouseEnter={() => setShowPopup(true)}
          onMouseLeave={() => {
            setShowPopup(false);
            setClicked(false); // reset if needed
            document.body.style.cursor = "auto"; // reset cursor
          }}
          className="relative text-red-900"
          animate={{
            x: [0, 1.5, -1.2, 1.8, -1.5, 0.8, -1, 0],
            y: [0, -1.2, 1.8, -1.5, 1, -0.8, 1.2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          RAT
          <AnimatePresence>
            {showPopup && (
              <motion.img
                src={
                  clicked
                    ? "/assets/characters/koruptor_hurt.png"
                    : "/assets/characters/koruptor.png"
                }
                alt="Koruptor"
                className="absolute -top-52 left-1/2 transform -translate-x-1/2 w-80 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onClick={handleClickMouse}
                draggable={false}
              />
            )}
          </AnimatePresence>
        </motion.span>
        <span>”tion</span>
      </motion.h1>

      <motion.button
        className="pixel-button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={handleStart}
      >
        Start Game
      </motion.button>

      <AnimatePresence>
        {isFading && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-black z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 5 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StartScene;
