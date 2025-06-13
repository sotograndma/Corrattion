import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";

type Question = {
  image: string;
  options: string[];
  answer: string;
};

const questions: Question[] = [
  {
    image: "/assets/chapter5/1.png",
    options: ["Gajah", "Kembang Api", "Gorilla", "Peterpan"],
    answer: "Gorilla",
  },
  {
    image: "/assets/chapter5/2.png",
    options: [
      "Tragedi nasional",
      "Anjing",
      "Anjing Bukan",
      "Anjing Apa Penguin sih ini aduh kacau deh",
    ],
    answer: "Anjing Apa Penguin sih ini aduh kacau deh",
  },
  {
    image: "/assets/chapter5/3.png",
    options: [
      "Ini bebek bukan yaa",
      "Bebek bukan sih ini aduh",
      "Bebek bebek apa yang suka makan bebek",
      "Bebek Kuda ini nih",
    ],
    answer: "Bebek Kuda ini nih",
  },
  {
    image: "/assets/chapter5/4.png",
    options: [
      "HIU >.< !!!",
      "Hiu bukan yaaa...",
      "HIU KUDA DEH >.< !!!",
      "hmmm bingung nihh",
    ],
    answer: "HIU KUDA DEH >.< !!!",
  },
  {
    image: "/assets/chapter5/5.png",
    options: [
      "APELLLLLL",
      "APELLL DONGGG",
      "APELLL INI DONG APEL DONG",
      "raditya dika",
    ],
    answer: "raditya dika",
  },
];

const dialoguesPre = [
  {
    speaker: "Penculik",
    text: "Kau tunjukkan begitu banyak gambar kepada dunia. Kini, coba lihat dan nilai sendiri. Apa benar seperti yang kau gembar-gemborkan?",
  },
];

const dialoguesDuringGame = [
  "Matamu hanya melihat pencitraan, bukan penderitaan.",
  "Bagus gambarnya... sayang isinya bohong semua.",
  "Kau unggah ilusi, bukan bukti.",
  "Foto bisa diatur, tapi kebenaran tak bisa dipoles.",
];

const dialoguesPost = [
  {
    speaker: "Penculik",
    text: "Matamu tak terbiasa melihat kenyataan. Maka kau tak membutuhkannya lagi.",
  },
  {
    speaker: "Penculik",
    text: "Kau berhasil membedakan ilusi dari kebenaran. Setidaknya untuk saat ini.",
  },
];

const Chapter5Scene: React.FC = () => {
  const { setScene, setPartLost } = useGame();
  const [stage, setStage] = useState<"pre" | "game" | "post">("pre");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [gameDialogueIndex, setGameDialogueIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [shakeWrong, setShakeWrong] = useState(false);
  const [revealImage, setRevealImage] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [dialogueReady, setDialogueReady] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const currentDialogue =
    stage === "pre"
      ? dialoguesPre[dialogueIndex]
      : stage === "post"
      ? wrongAnswer
        ? dialoguesPost[0]
        : dialoguesPost[1]
      : null;

  const text = currentDialogue?.text ?? "";

  useEffect(() => {
    requestAnimationFrame(() => setDialogueReady(true));
  }, []);

  // Typewriter effect
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

      if (wrongAnswer) {
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
        setScene("ending");
      }, 10000);
    }

    requestAnimationFrame(() => setDialogueReady(true));
  };

  // Loop sindiran selama game
  useEffect(() => {
    if (stage !== "game") return;
    const loop = setInterval(() => {
      setGameDialogueIndex((prev) => (prev + 1) % dialoguesDuringGame.length);
    }, 3500);
    return () => clearInterval(loop);
  }, [stage]);

  const handleAnswer = (option: string) => {
    if (answered) return;
    setAnswered(true);
    setSelectedOption(option);

    const isWrong = option !== questions[currentQuestion].answer;

    const audio = new Audio(
      isWrong ? "/assets/audio/fart.mp3" : "/assets/audio/correct.mp3"
    );
    audio.play();

    if (isWrong) {
      setWrongAnswer(true);
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 500);
    }

    setRevealImage(true); // munculkan gambar asli

    // Setelah 3 detik, lanjut soal
    setTimeout(() => {
      setRevealImage(false);
      setAnswered(false);
      setSelectedOption(null);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setStage("post");
        if (wrongAnswer || isWrong) setPartLost("eyeLost");
      }
    }, 3000);
  };

  return (
    <div className="h-screen w-screen bg-neutral-900 text-white flex flex-col justify-center items-center relative p-8">
      {/* Game Area */}
      {stage === "game" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute w-full max-w-6xl top-1/4 flex flex-col items-center gap-4"
        >
          <p className="text-4xl font-bold">
            Gambar {currentQuestion + 1} dari {questions.length}
          </p>
          <img
            src={questions[currentQuestion].image}
            alt={`Soal ${currentQuestion + 1}`}
            className={`w-80 h-48 object-cover rounded border transition-all duration-500
              ${revealImage ? "clip-none" : "clip-half"}
            `}
          />
          <div className="grid grid-cols-2 gap-4 mt-4">
            {questions[currentQuestion].options.map((opt, idx) => {
              const isCorrect = opt === questions[currentQuestion].answer;
              const isSelected = opt === selectedOption;

              const buttonColor = isSelected
                ? isCorrect
                  ? "bg-green-700 text-green-100 border-green-500"
                  : "bg-red-700 text-red-100 border-red-500"
                : "bg-neutral-700 text-neutral-400 border-neutral-600";

              return (
                <motion.button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  className={`px-6 py-2 border rounded-md text-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonColor}`}
                  animate={
                    shakeWrong && isSelected && !isCorrect
                      ? { x: [-8, 8, -8, 8, 0] }
                      : {}
                  }
                  transition={{ duration: 0.4 }}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Dialogue box bawah */}
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

export default Chapter5Scene;
