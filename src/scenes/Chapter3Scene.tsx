import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";

type Question = {
  audio: string;
  options: string[];
  answer: string;
};

const questions: Question[] = [
  {
    audio: "/assets/audio/chapter3/1.mp3",
    options: [
      "Suara Menyeramkan",
      "Semangka",
      "sorakan untuk raja",
      "Ketupat Sayur",
    ],
    answer: "sorakan untuk raja",
  },
  {
    audio: "/assets/audio/eagle.mp3",
    options: ["Elang", "Kereta", "Pesawat", "Motor"],
    answer: "Elang",
  },
  {
    audio: "/assets/audio/chapter3/2.mp3",
    options: [
      "Sirine",
      "Dentuman",
      "apresiasi pempimpin untuk pemimpin lain",
      "Lonceng",
    ],
    answer: "apresiasi pempimpin untuk pemimpin lain",
  },
  {
    audio: "/assets/audio/fart.mp3",
    options: ["Laut", "Kentut", "Petir", "Angin"],
    answer: "Kentut",
  },
  {
    audio: "/assets/audio/chapter3/4.mp3",
    options: [
      "teriakan",
      "tawa",
      "bayi menangis",
      "suara tentara ngawi sedang berusaha semaksimal mungkin mereka untuk menang",
    ],
    answer:
      "suara tentara ngawi sedang berusaha semaksimal mungkin mereka untuk menang",
  },
];

const dialoguesPre = [
  {
    speaker: "Penculik",
    text: "Sekarang kita uji telingamu. Suara-suara dosa... suara rakyat... kau harus mendengarkannya. Tapi hanya jika telingamu layak.",
  },
];

const dialoguesDuringGame = [
  "Kau tahu suara rakyat? Tidak? Ya jelas, telingamu sudah penuh bisikan uang.",
  "Dengarkan baik-baik... itu suara masa depan yang tak kau hiraukan.",
  "Hayo... mana suara nuranimu? Sudah hilang ya?",
  "Jangan cuma dengar pujian. Dengarkan juga jeritan mereka yang kau abaikan.",
];

const dialoguesPost = [
  {
    speaker: "Penculik",
    text: "Sepertinya telingamu hanya terbiasa mendengar pujian palsu.",
  },
  {
    speaker: "Penculik",
    text: "Telingamu masih bisa mendengar. Tapi sampai kapan?",
  },
];

const Chapter3Scene: React.FC = () => {
  const { setScene, setPartLost } = useGame();
  const [stage, setStage] = useState<"pre" | "game" | "post">("pre");
  const [dialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [gameDialogueIndex, setGameDialogueIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [shakeWrong, setShakeWrong] = useState(false);
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
        setScene("chapter4");
      }, 10000);
    }

    requestAnimationFrame(() => setDialogueReady(true));
  };

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
      setTimeout(() => setShakeWrong(false), 500); // reset shake
    }

    setTimeout(() => {
      setAnswered(false);
      setSelectedOption(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setStage("post");
        if (wrongAnswer || isWrong) setPartLost("earLost");
      }
    }, 1000);
  };

  return (
    <div className="h-screen w-screen bg-neutral-900 text-white flex flex-col justify-center items-center relative p-8">
      {/* Game Area */}
      {stage === "game" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute w-full max-w-6xl top-1/3 flex flex-col items-center gap-8"
        >
          <p className="text-4xl font-bold flex">
            Soal {currentQuestion + 1} dari {questions.length}
          </p>
          <audio controls autoPlay key={questions[currentQuestion].audio}>
            <source src={questions[currentQuestion].audio} type="audio/mpeg" />
            Browser tidak mendukung audio.
          </audio>
          <div className="grid grid-cols-2 gap-4 mt-3">
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

export default Chapter3Scene;
