import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";
import { useRef } from "react";

const dialoguesPre = [
  {
    speaker: "Penculik",
    text: "Tangan busuk yang telah menulis ribuan kebohongan.",
  },
  {
    speaker: "Penculik",
    text: "Sekarang... kau akan mengetik ulang kebohonganmu sendiri.",
  },
  {
    speaker: "Penculik",
    text: "Jika akurasimu rendah... tanganmu akan jadi taruhannya.",
  },
];

const dialoguesDuringGame = [
  "Lihat kamu... tangan gemetar ketik ulang bohongmu sendiri.",
  "Aduh, jari kamu kaku ya? Maklum, biasa tanda tangan palsu.",
  "Hehe... kok salah terus? Padahal kamu yang nulis ini dulu, kan?",
  "Ketik yang rapi ya... ini mungkin terakhir kalinya kamu punya tangan.",
];

const dialoguesPost = [
  {
    speaker: "Penculik",
    text: "Aku sudah bilang... satu kegagalan, satu bagian tubuh hilang.",
  },
  {
    speaker: "Penculik",
    text: "Tanganmu... untuk sekarang, aman. Tapi jangan terlalu lega.",
  },
];

const dialoguesPostFailure = [
  {
    speaker: "Penculik",
    text: "Aku sudah bilang... satu kegagalan, satu bagian tubuh hilang.",
  },
  {
    speaker: "Penculik",
    text: "Selamat tinggal... tangan kananmu.",
  },
];

const dialoguesPostSuccess = [
  {
    speaker: "Penculik",
    text: "Aku sudah bilang... satu kegagalan, satu bagian tubuh hilang.",
  },
  {
    speaker: "Penculik",
    text: "Tanganmu... untuk sekarang, aman. Tapi jangan terlalu lega.",
  },
];

const typingWords = [
  "korup",
  "uang",
  "suap",
  "palsu",
  "bohong",
  "rakyat",
  "tanda",
  "tangan",
  "izin",
  "gelap",
];

const Chapter1Scene: React.FC = () => {
  const { setScene, setPartLost } = useGame();

  const [stage, setStage] = useState<"pre" | "game" | "post">("pre");
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [activeWords, setActiveWords] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(40);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [gameDialogueIndex, setGameDialogueIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [dialogueReady, setDialogueReady] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const currentDialogue =
    stage === "pre"
      ? dialoguesPre[dialogueIndex]
      : stage === "post"
      ? accuracy !== null && accuracy < 70
        ? dialoguesPostFailure[dialogueIndex]
        : dialoguesPostSuccess[dialogueIndex]
      : null;

  const text = currentDialogue?.text ?? "";

  useEffect(() => {
    requestAnimationFrame(() => {
      setDialogueReady(true);
    });
  }, []);

  useEffect(() => {
    if (!currentDialogue || !dialogueReady) return;

    let i = 0;
    let interval: NodeJS.Timeout;
    const sound = new Audio("/assets/audio/dialogueSound2.mp3");

    setDisplayedText("");
    setIsTyping(true);

    // Mulai ketik dan suara BERSAMAAN
    interval = setInterval(() => {
      if (i === 0) {
        // Mainkan suara ketik saat huruf pertama mulai diketik
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
      return;
    }

    setDialogueReady(false); // reset trigger

    if (stage === "pre" && dialogueIndex < dialoguesPre.length - 1) {
      setDialogueIndex((prev) => prev + 1);
      requestAnimationFrame(() => setDialogueReady(true));
    } else if (stage === "pre") {
      setStage("game");
      setStarted(true);
    } else if (stage === "post" && dialogueIndex < dialoguesPost.length - 1) {
      setDialogueIndex((prev) => prev + 1);
      requestAnimationFrame(() => setDialogueReady(true));
    } else {
      setIsFading(true);

      if (accuracy !== null && accuracy < 70) {
        // KALAH
        const chainsaw = new Audio("/assets/audio/chainsaw.mp3");
        const scream = new Audio("/assets/audio/male_screaming.mp3");
        chainsaw.volume = 0.7;
        scream.volume = 1;
        chainsaw.play();
        scream.play();
      } else {
        // MENANG
        const powerDown = new Audio("/assets/audio/power_down.mp3");
        powerDown.volume = 1;
        powerDown.play();
      }

      setTimeout(() => {
        setScene("chapter2");
      }, 10000);
    }
  };

  useEffect(() => {
    if (!started || finished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const dialogueLoop = setInterval(() => {
      setGameDialogueIndex((prev) => (prev + 1) % dialoguesDuringGame.length);
    }, 3500);

    return () => {
      clearInterval(timer);
      clearInterval(dialogueLoop);
    };
  }, [started, finished]);

  const handleTypingEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (activeWords.includes(input.trim())) {
        setActiveWords((prev) => prev.filter((word) => word !== input.trim()));
        setCorrectCount((prev) => prev + 1);
      }
      setInput("");
    }
  };

  const calculateAccuracy = () => {
    const totalWords = correctCount + activeWords.length;
    return totalWords === 0 ? 0 : (correctCount / totalWords) * 100;
  };

  useEffect(() => {
    if (!started || finished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const dialogueLoop = setInterval(() => {
      setGameDialogueIndex((prev) => (prev + 1) % dialoguesDuringGame.length);
    }, 3500);

    const wordSpawner = setInterval(() => {
      const newWord =
        typingWords[Math.floor(Math.random() * typingWords.length)];
      setActiveWords((prev) => [...prev, newWord].slice(-5));
    }, 1500);

    return () => {
      clearInterval(timer);
      clearInterval(dialogueLoop);
      clearInterval(wordSpawner);
    };
  }, [started, finished]);

  useEffect(() => {
    if (!finished) return;

    const acc = calculateAccuracy();
    setAccuracy(acc);

    if (acc < 70) {
      setPartLost("handLost");
    }

    setStage("post");
    setDialogueIndex(0);
  }, [finished]);

  return (
    <div className="h-screen w-screen bg-neutral-900 text-white flex flex-col justify-center items-center relative p-8">
      {/* Tampilkan mini game jika sedang berlangsung */}
      {stage === "game" && !finished && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute w-full max-w-6xl top-1/3 flex flex-col items-center"
        >
          {/* Area kata-kata yang bergerak */}
          <div className="relative w-full h-32 bg-neutral-800 border-neutral-600 rounded-lg p-4 flex items-center justify-center border-2">
            {activeWords.map((word, index) => (
              <span
                key={index}
                className="absolute text-2xl font-bold text-red-300 animate-pulse"
                style={{
                  left: `${Math.random() * 80}%`,
                  top: `${Math.random() * 80}%`,
                }}
              >
                {word}
              </span>
            ))}
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleTypingEnter}
            className="mt-4 p-3 w-full max-w-6xl text-white border-2 border-neutral-800 bg-neutral-950 rounded-md text-2xl focus:outline-none focus:border-red-400"
            placeholder="ketik kata anda disini atau saya klitikin ..."
          />
        </motion.div>
      )}

      {/* Dialog box tetap tampil di bawah */}
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

export default Chapter1Scene;
