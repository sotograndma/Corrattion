import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";

type Obstacle = {
  id: number;
  left: number;
  position: "top" | "bottom";
  hit?: boolean;
};

const dialoguesPre = [
  {
    speaker: "Penculik",
    text: "Lari... terus lari. Lari dari tanggung jawabmu. Tapi di sini, kaki palsumu takkan menyelamatkanmu.",
  },
];

const dialoguesDuringGame = [
  "Kaki koruptor ternyata nggak cuma lemah... tapi juga licin.",
  "Lho? Bukannya biasa lari dari penyelidikan? Kok sekarang lambat?",
  "Jatuh lagi? Apa kamu nyogok pelatih lari juga?",
  "Hehe... tumitmu pasti berat karena dosa-dosamu.",
];

const dialoguesPost = [
  {
    speaker: "Penculik",
    text: "Terpeleset ya? Mungkin karena dosamu terlalu berat untuk ditopang.",
  },
  {
    speaker: "Penculik",
    text: "Kau cukup cekatan. Tapi ini baru permulaan.",
  },
];

const Chapter2Scene: React.FC = () => {
  const { setScene, setPartLost } = useGame();
  const [stage, setStage] = useState<"pre" | "game" | "post">("pre");
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleJump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stage]);
  const [y, setY] = useState(0);
  const velocityRef = useRef(0);
  const gravity = 0.9;
  const jumpForce = -12;
  const [dialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const obstacleRef = useRef<Obstacle[]>([]);
  const [collisions, setCollisions] = useState(0);
  const [timer, setTimer] = useState(40);
  const [gameOver, setGameOver] = useState(false);
  const [gameDialogueIndex, setGameDialogueIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [dialogueReady, setDialogueReady] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const playerRef = useRef<HTMLDivElement>(null);

  const currentDialogue =
    stage === "pre"
      ? dialoguesPre[dialogueIndex]
      : stage === "post"
      ? collisions > 3
        ? dialoguesPost[0]
        : dialoguesPost[1]
      : null;

  const text = currentDialogue?.text ?? "";

  useEffect(() => {
    requestAnimationFrame(() => setDialogueReady(true));
  }, []);

  // Typewriter effect
  // Typewriter effect with audio
  useEffect(() => {
    if (!currentDialogue || !dialogueReady) return;

    let i = 0;
    let interval: NodeJS.Timeout;
    const sound = new Audio("/assets/audio/dialogueSound2.mp3");

    setDisplayedText("");
    setIsTyping(true);

    interval = setInterval(() => {
      if (i === 0) {
        sound.loop = true;
        sound.volume = 0.2;
        sound.play().catch(() => {});
        audioRef.current = sound;
      }

      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        sound.pause();
        sound.currentTime = 0;
        setIsTyping(false);
      }
    }, 30);

    return () => {
      clearInterval(interval);
      sound.pause();
      sound.currentTime = 0;
    };
  }, [dialogueIndex, stage, dialogueReady]);

  const handleDialogueClick = () => {
    if (isTyping) {
      setDisplayedText(text);
      setIsTyping(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    setDialogueReady(false);

    if (stage === "pre") {
      setStage("game");
    } else if (stage === "post") {
      setIsFading(true);

      if (collisions > 3) {
        const chainsaw = new Audio("/assets/audio/chainsaw.mp3");
        const scream = new Audio("/assets/audio/male_screaming.mp3");
        chainsaw.volume = 0.7;
        scream.volume = 1;
        chainsaw.play();
        setTimeout(() => scream.play(), 700);
      } else {
        const powerDown = new Audio("/assets/audio/power_down.mp3");
        powerDown.volume = 1;
        powerDown.play();
      }

      setTimeout(() => {
        setScene("chapter3");
      }, 10000); // 10 detik
    }

    requestAnimationFrame(() => setDialogueReady(true));
  };

  // Timer countdown
  useEffect(() => {
    if (stage !== "game" || gameOver) return;

    const timerInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const dialogueInterval = setInterval(() => {
      setGameDialogueIndex((prev) => (prev + 1) % dialoguesDuringGame.length);
    }, 3500);

    return () => {
      clearInterval(timerInterval);
      clearInterval(dialogueInterval);
    };
  }, [stage, gameOver]);

  // Spawn & move obstacles
  useEffect(() => {
    if (stage !== "game" || gameOver) return;

    const spawn = setInterval(() => {
      const position: "top" | "bottom" = Math.random() > 0.5 ? "top" : "bottom";
      setObstacles((prev) => {
        const next = [
          ...prev,
          { id: Date.now(), left: 100, position, hit: false },
        ];
        obstacleRef.current = next;
        return next;
      });
    }, 1500);

    const move = setInterval(() => {
      setObstacles((prev) => {
        const updated = prev
          .map((obs) => ({ ...obs, left: obs.left - 2 }))
          .filter((obs) => obs.left > -10);
        obstacleRef.current = updated;
        return updated;
      });
    }, 30);

    return () => {
      clearInterval(spawn);
      clearInterval(move);
    };
  }, [stage, gameOver]);

  // Collision check
  useEffect(() => {
    if (!playerRef.current || gameOver) return;

    const updated: Obstacle[] = [];
    let shouldUpdate = false;

    obstacleRef.current.forEach((obs) => {
      const isNear = obs.left < 12 && obs.left > 0;
      const isBottom = obs.position === "bottom";
      const isTop = obs.position === "top";
      const alreadyHit = obs.hit ?? false;

      let hit = false;

      const PLAYER_HEIGHT = 40;
      const OBSTACLE_HEIGHT = 40;
      const TOLERANCE = 10;

      const hitBottom = isBottom && y < OBSTACLE_HEIGHT - TOLERANCE;
      const hitTop = isTop && y > 150 - PLAYER_HEIGHT + TOLERANCE;

      if (isNear && !alreadyHit) {
        if (hitBottom || hitTop) {
          console.log("HIT:", { position: obs.position, y });
          hit = true;
          shouldUpdate = true;
          setCollisions((prev) => prev + 1);
        }
      }

      updated.push({ ...obs, hit: alreadyHit || hit });
    });

    if (shouldUpdate) {
      obstacleRef.current = updated;
      setObstacles(updated); // agar UI ikut update
    }
  }, [y, gameOver]);

  // Game over check
  useEffect(() => {
    if (gameOver) {
      if (collisions > 3) {
        setPartLost("legLost");
      }
      setStage("post");
    }
  }, [gameOver]);

  const handleJump = () => {
    if (stage !== "game" || y > 0) return;
    velocityRef.current = jumpForce;
  };

  useEffect(() => {
    if (stage !== "game") return;

    const interval = setInterval(() => {
      velocityRef.current += gravity;

      setY((prevY) => {
        const nextY = prevY - velocityRef.current; // karena naik = y turun
        if (nextY <= 0) {
          velocityRef.current = 0;
          return 0;
        }

        // batasi ketinggian maksimal (misal 150px)
        if (nextY > 150) return 150;

        return nextY;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [stage]);

  return (
    <div className="h-screen w-screen bg-neutral-900 text-white flex flex-col justify-center items-center relative p-8 overflow-hidden">
      {/* Game area */}
      {stage === "game" && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute w-full max-w-6xl top-1/3 flex flex-col items-center"
          >
            <p className="text-4xl font-bold flex">Time Left: {timer}s</p>
            <p className="text-2xl text-red-400">Collisions: {collisions}</p>

            <div className="relative w-full h-48 bg-neutral-800 border-neutral-600 border-2 rounded-xl overflow-hidden mt-4">
              {/* Player */}
              <motion.div
                ref={playerRef}
                className="w-10 h-10 bg-red-400 absolute bottom-0 left-12 rounded"
                style={{ transform: `translateY(${-y}px)` }}
              />

              {/* Obstacles */}
              {obstacles.map((obs) => (
                <motion.div
                  key={obs.id}
                  className={`w-10 h-10 bg-neutral-600 absolute rounded ${
                    obs.position === "top" ? "top-0" : "bottom-0"
                  }`}
                  style={{ left: `${obs.left}%` }}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}

      {/* Dialog box bawah */}
      <div
        className="absolute bottom-4 bg-neutral-800 border-neutral-600 w-full max-w-6xl flex items-end border-2 p-4 rounded-lg"
        onClick={stage !== "game" ? handleDialogueClick : undefined}
      >
        <div className="items-center bg-neutral-900 border-neutral-700 border-2 rounded-lg p-4 mr-4">
          <img
            src={`/assets/characters/penculik.png`}
            alt="Penculik"
            className="w-32 h-32 object-contain"
          />
          <p className="text-3xl text-center text-neutral-400 w-full">
            Penculik
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${stage}-${dialogueIndex}-${gameDialogueIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="border-2 bg-neutral-600 border-neutral-500 text-neutral-300 text-4xl rounded-lg p-4 w-full"
          >
            <p>
              {stage === "game"
                ? dialoguesDuringGame[gameDialogueIndex]
                : displayedText}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {isFading && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-black z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 10 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chapter2Scene;
