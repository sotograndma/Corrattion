import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";

// Tambahkan suara ketik
const dialogueAudio = "/assets/audio/dialogueSound2.mp3";

const EndingScene: React.FC = () => {
  const { handLost, legLost, earLost, mouthLost, eyeLost, setScene } =
    useGame();

  const [sceneStage, setSceneStage] = useState<1 | 2 | 3 | 4 | 5 | 6>(1); // stage control
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalLost =
    Number(handLost) +
    Number(legLost) +
    Number(earLost) +
    Number(mouthLost) +
    Number(eyeLost);

  const dialogues =
    totalLost === 0
      ? [
          {
            speaker: "Penculik",
            text: "Kau menang... tapi tak ada yang bisa kau rasakan.",
          },
          { speaker: "Penculik", text: "Tubuhmu utuh, tapi jiwamu busuk." },
          {
            speaker: "Penculik",
            text: "Kemenanganmu hanya memperpanjang siksaanmu...",
          },
        ]
      : totalLost === 5
      ? [
          { speaker: "Penculik", text: "Kau kalah... seluruh tubuhmu hilang." },
          {
            speaker: "Penculik",
            text: "Tapi justru di situlah penebusanmu dimulai.",
          },
          { speaker: "Penculik", text: "Tanpa tangan untuk mencuri..." },
          { speaker: "Koruptor", text: "..." },
          { speaker: "Penculik", text: "Kau bebas... dalam penderitaanmu." },
        ]
      : [
          { speaker: "Penculik", text: "Beberapa bagian tubuhmu hilang..." },
          {
            speaker: "Penculik",
            text: "Mungkin ini cukup untuk membuatmu berpikir ulang.",
          },
          { speaker: "Koruptor", text: "..." },
          {
            speaker: "Penculik",
            text: "Atau mungkin tidak. Waktu yang akan menjawab.",
          },
        ];

  const currentDialogue = dialogues[dialogueIndex] || { speaker: "", text: "" };
  const text = currentDialogue.text ?? "";

  const conclusionTexts = [
    "Dan begitulah kisah ini berakhir.",
    "Dalam dunia yang penuh tipu daya, satu demi satu topeng pun terlepas.",
    "Namun pertanyaan terbesar tetap menggantung di udara...",
    "Apakah keadilan benar-benar ditegakkan, atau hanya permainan lainnya?",
  ];

  const [conclusionIndex, setConclusionIndex] = useState(0);
  const [conclusionText, setConclusionText] = useState("");
  const [isTypingConclusion, setIsTypingConclusion] = useState(false);

  const credits = [
    "", // Kosong untuk spasi bawah
    "Game Design: Dzaky",
    "Programming: Dzaky",
    "Assets: Thael",
    "Story: Dzaky",
    "Illustration: ChatGPT",
    "Voice Effect: pixabay.com",
    "The Music - Hollow Knight OST - Deepnest",
    "Thanks for playing!",
    "",
    "Copyright © Dzaky 2025",
  ];

  const [] = useState(false);

  // 👇 Efek ketik dan suara
  useEffect(() => {
    if (sceneStage !== 1) return;

    let i = 0;
    let interval: NodeJS.Timeout;
    const sound = new Audio(dialogueAudio);
    sound.loop = true;
    sound.volume = 0.2;

    setDisplayedText("");
    setIsTyping(true);
    sound.play().catch(() => {});
    audioRef.current = sound;

    interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        sound.pause();
        sound.currentTime = 0;
      }
    }, 30);

    return () => {
      clearInterval(interval);
      sound.pause();
    };
  }, [dialogueIndex, sceneStage]);

  const handleClick = () => {
    if (sceneStage !== 1) return;

    if (isTyping) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    if (dialogueIndex < dialogues.length - 1) {
      setDialogueIndex((prev) => prev + 1);
    } else {
      // lanjut ke stage 2 (fade out)
      setFadeOut(true);
      setTimeout(() => {
        setSceneStage(2);
        setFadeOut(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (sceneStage !== 3) return;

    let i = 0;
    let interval: NodeJS.Timeout;
    const sound = new Audio(dialogueAudio);

    setConclusionText("");
    setIsTypingConclusion(true);

    sound.loop = true;
    sound.volume = 0.2;
    sound.play().catch(() => {});
    audioRef.current = sound;

    interval = setInterval(() => {
      if (i < conclusionTexts[conclusionIndex].length) {
        setConclusionText(
          (prev) => prev + conclusionTexts[conclusionIndex].charAt(i)
        );
        i++;
      } else {
        clearInterval(interval);
        setIsTypingConclusion(false);
        sound.pause();
        sound.currentTime = 0;
      }
    }, 30);

    return () => {
      clearInterval(interval);
      sound.pause();
      sound.currentTime = 0;
    };
  }, [conclusionIndex, sceneStage]);

  useEffect(() => {
    if (sceneStage === 2) {
      const timeout = setTimeout(() => {
        setSceneStage(3);
      }, 1000); // Delay setelah fade out sebelum masuk konklusi
      return () => clearTimeout(timeout);
    }
  }, [sceneStage]);

  useEffect(() => {
    if (sceneStage === 4) {
      const timeout = setTimeout(() => {
        setSceneStage(5);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [sceneStage]);

  useEffect(() => {
    if (sceneStage === 6) {
      setFadeOut(true);
      const timeout = setTimeout(() => {
        setScene("start");
      }, 2000); // tunggu fade selesai
      return () => clearTimeout(timeout);
    }
  }, [sceneStage, setScene]);

  return (
    <div className="relative h-screen w-screen bg-neutral-900 text-white overflow-hidden">
      {/* Fade to black overlay */}
      <AnimatePresence>
        {fadeOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 w-full h-full bg-black z-50"
          />
        )}
      </AnimatePresence>

      {sceneStage === 1 && (
        <div
          className="flex flex-col items-center justify-center h-full p-8"
          onClick={handleClick}
        >
          {/* Karakter utama di tengah */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="mb-40"
          >
            <img
              src={`/assets/characters/${currentDialogue.speaker.toLowerCase()}.png`}
              alt={currentDialogue.speaker}
              className="w-96 h-96 object-contain"
            />
          </motion.div>

          {/* Area dialog */}
          <div className="absolute bottom-4 flex items-end border-2 bg-neutral-800 border-neutral-600 p-4 w-full max-w-6xl rounded-lg">
            <div
              className={`items-center border-2 rounded-lg p-4 mr-4 ${
                currentDialogue.speaker === "Penculik"
                  ? "bg-neutral-900 border-neutral-700"
                  : "bg-red-950 border-red-800"
              }`}
            >
              <img
                src={`/assets/characters/${currentDialogue.speaker.toLowerCase()}.png`}
                alt={currentDialogue.speaker}
                className="w-32 h-32 object-contain"
              />
              <p
                className={`text-3xl text-center w-full ${
                  currentDialogue.speaker === "Penculik"
                    ? "text-neutral-400"
                    : "text-red-500"
                }`}
              >
                {currentDialogue.speaker}
              </p>
            </div>

            <motion.div
              key={`dialogue-${dialogueIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="border-2 bg-neutral-600 border-neutral-500 text-3xl text-neutral-300 rounded-lg p-3 w-full"
            >
              <p>{displayedText}</p>
            </motion.div>
          </div>
        </div>
      )}
      {sceneStage === 3 && (
        <div
          className="flex flex-col items-center justify-center h-screen text-center p-12"
          onClick={() => {
            if (isTypingConclusion) {
              setConclusionText(conclusionTexts[conclusionIndex]);
              setIsTypingConclusion(false);
              return;
            }

            if (conclusionIndex < conclusionTexts.length - 1) {
              setConclusionIndex((prev) => prev + 1);
            } else {
              // selesai semua => lanjut ke fade out (stage 4)
              setFadeOut(true);
              setTimeout(() => {
                setSceneStage(4);
                setFadeOut(false);
              }, 1000);
            }
          }}
        >
          <motion.p
            key={`conclusion-${conclusionIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-2xl text-neutral-300 max-w-3xl"
          >
            {conclusionText}
          </motion.p>
        </div>
      )}
      {sceneStage === 5 && (
        <div className="h-screen w-screen bg-neutral-900 text-white relative overflow-hidden flex items-center justify-center">
          <motion.div
            className="absolute top-full flex flex-col items-center w-full"
            initial={{ y: 0 }}
            animate={{ y: "-400%" }}
            transition={{ duration: 10, ease: "linear" }}
            onAnimationComplete={() => {
              setTimeout(() => {
                setSceneStage(6);
              }, 1000);
            }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-12 text-white">
              Cor"RAT"tion
            </h1>
            {credits.map((line, index) => (
              <p
                key={index}
                className="text-3xl md:text-2xl mb-4 text-neutral-300 text-center"
              >
                {line}
              </p>
            ))}
            <p className="text-4xl md:text-2xl mt-12 text-pink-600 font-bold">
              Free Palestine
            </p>
            <p className="text-4xl md:text-2xl text-lime-600 font-bold">
              #SaveRajaAmpat
            </p>
          </motion.div>
        </div>
      )}

      {/* Stage berikutnya akan saya lanjutkan di tahap selanjutnya */}
    </div>
  );
};

export default EndingScene;
