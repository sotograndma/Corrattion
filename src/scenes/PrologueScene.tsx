// src/scenes/PrologueScene.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../context/GameContext";
import { useRef } from "react";

const dialogues = [
  { speaker: "Koruptor", text: "  gua...  ", image: "koruptor.png" },
  { speaker: "Koruptor", text: "  dimana?  ", image: "koruptor_hurt.png" },
  {
    speaker: "Penculik",
    text: "  mwehehehehehehehehe  ",
    image: "penculik_licik.png",
  },
  {
    speaker: "Koruptor",
    text: "  WTF?? LU SIAPA CO?!  ",
    image: "koruptor_angry.png",
  },
  {
    speaker: "Penculik",
    text: "  mwehehehehehehehehehehehe ",
    image: "penculik.png",
  },
  {
    speaker: "Penculik",
    text: "  gua adalah  ",
    image: "penculik_licik.png",
  },
  {
    speaker: "Penculik",
    text: "  pantatlu  ",
    image: "penculik_laugh.png",
  },
  {
    speaker: "Koruptor",
    text: "  apaansi gajelas..  ",
    image: "koruptor.png",
  },
  {
    speaker: "Koruptor",
    text: "  LU APAAN SIH NGURUNG NGURUNG GINI  ",
    image: "koruptor_angry.png",
  },
  {
    speaker: "Penculik",
    text: "  mwehehehehehehehehe  ",
    image: "penculik_licik.png",
  },
  {
    speaker: "Koruptor",
    text: "  lu ngapa sih..  ",
    image: "koruptor.png",
  },
  {
    speaker: "Koruptor",
    text: "  ITU  BOCAH  SIAPA  SIH?!  BERISIK  BANGET!  DIDIEMIN  DULU  GITU  LOH!  ",
    image: "koruptor_angry.png",
  },
  {
    speaker: "Penculik",
    text: "  hei tikus bego.  ",
    image: "penculik_angry.png",
  },
  {
    speaker: "Koruptor",
    text: "  kok ngatain...  ",
    image: "koruptor_hurt.png",
  },
  {
    speaker: "Penculik",
    text: "  itu anakmu bodoh...  ",
    image: "penculik_angry.png",
  },
  {
    speaker: "Penculik",
    text: "  masa  muka  anak  sendiri  aja  bisa  lupa?   ",
    image: "penculik_licik.png",
  },
  {
    speaker: "Penculik",
    text: "  goblok  ",
    image: "penculik_licik.png",
  },
  {
    speaker: "Koruptor",
    text: "  ...  ",
    image: "koruptor.png",
  },
  {
    speaker: "Koruptor",
    text: "  (emang gua punya anak?)  ",
    image: "koruptor_hurt.png",
  },
  {
    speaker: "Koruptor",
    text: "  ...  ",
    image: "koruptor.png",
  },
  {
    speaker: "Koruptor",
    text: "  WHAT DE HELLI LEPASIN ANAK GUA WOILAH!  ",
    image: "koruptor_angry.png",
  },
  {
    speaker: "Penculik",
    text: "  mwehehehehehehehehe (bego ini orang)  ",
    image: "penculik_licik.png",
  },
  {
    speaker: "Koruptor",
    text: "  HEII GOONER, ANDA TIDAK TAU SIAPA GUA KAN?  ",
    image: "koruptor.png",
  },
  {
    speaker: "Koruptor",
    text: "  ANDA TIDAK TAU SIAPA ORANG ORANG BESAR YANG BISA NOLONG GUA KAN?   ",
    image: "koruptor_angry.png",
  },
  {
    speaker: "Penculik",
    text: "  orang besar??  ",
    image: "penculik.png",
  },
  {
    speaker: "Penculik",
    text: "  maksud kamu Tuhan? atau... tikus berdasi yang lain?  ",
    image: "penculik_licik.png",
  },
  {
    speaker: "Penculik",
    text: "  memang kamu melihat ada tikus lain disini?  ",
    image: "penculik_laugh.png",
  },
  {
    speaker: "Koruptor",
    text: "  ...  ",
    image: "koruptor_hurt.png",
  },
  {
    speaker: "Penculik",
    text: "  gaada kan?  ",
    image: "penculik.png",
  },
  {
    speaker: "Penculik",
    text: "  gaada yang bisa nolong lu.. tapi kalau lu ngomongin Tuhan...  ",
    image: "penculik_licik.png",
  },
  {
    speaker: "Koruptor",
    text: "  TUHAN BAKAL BANTU GUA, DIA BAKAL BUNUH LU DAN MENYENGSARAKAN HIDUP LU  ",
    image: "koruptor_hurt.png",
  },
  {
    speaker: "Koruptor",
    text: "  KELUARKAN GUA DARI SINI  ",
    image: "koruptor_angry.png",
  },
  {
    speaker: "Penculik",
    text: "  SOK RELIGIUS,  sumpah  atas  nama  kitab,  tapi  hidup  dari  nyolong  ",
    image: "penculik_angry.png",
  },
  {
    speaker: "Penculik",
    text: "  tampang  suci,  kelakuan  iblis.  Dasar  munafik  ",
    image: "penculik_angry.png",
  },
  {
    speaker: "Koruptor",
    text: "  ...  ",
    image: "koruptor_hurt.png",
  },
  {
    speaker: "Penculik",
    text: "  dan  soal  anak lu...  ",
    image: "penculik_licik.png",
  },
  {
    speaker: "Penculik",
    text: "  gua  gak  culik  dia  buat  disiksa,  sama  sekali  nggak  ",
    image: "penculik.png",
  },
  {
    speaker: "Penculik",
    text: "  gua  cuma  pengen  dia  lihat  siapa  lu  sebenernya  ",
    image: "penculik_licik.png",
  },
  {
    speaker: "Penculik",
    text: "  biar  dia  denger,  liat,  dan  ngerti  bapaknya  siapa  ",
    image: "penculik.png",
  },
  {
    speaker: "Penculik",
    text: "  semua  penggusuran,  dana  dikorup,  anggaran  dipotong, hutan surga dimusnahkan  ",
    image: "penculik_licik.png",
  },
  {
    speaker: "Penculik",
    text: "   itu semua demi keluarga?... egoisme?... uang?... obviously  ",
    image: "penculik.png",
  },
  {
    speaker: "Penculik",
    text: "   gua gapernah paham sama cara pikir orang orang kayak lu  ",
    image: "penculik_angry.png",
  },
  {
    speaker: "Penculik",
    text: "   lu beragama kan?  ",
    image: "penculik.png",
  },
  {
    speaker: "Koruptor",
    text: "  iya...  ",
    image: "koruptor_hurt.png",
  },
  {
    speaker: "Penculik",
    text: "   gua sangat yakin lu udh tau... atau atleast lu pernah denger... ",
    image: "penculik.png",
  },
  {
    speaker: "Penculik",
    text: "   dosa dosa korupsi... dan balasannya ",
    image: "penculik_licik.png",
  },
  {
    speaker: "Penculik",
    text: "   tapi kayaknya emang ga sepenting itu buat lu kan? ",
    image: "penculik_angry.png",
  },
  {
    speaker: "Koruptor",
    text: "  ...  ",
    image: "koruptor_hurt.png",
  },
  {
    speaker: "Penculik",
    text: "  anaklu  di  sini  bukan  buat  disakiti  ",
    image: "penculik.png",
  },
  {
    speaker: "Penculik",
    text: "  Tapi  biar  dia  tahu...  siapa  lu  sebenernya  ",
    image: "penculik_licik.png",
  },
  {
    speaker: "Penculik",
    text: "  lu tuh iblis buat orang orang lain  ",
    image: "penculik_angry.png",
  },
  {
    speaker: "Penculik",
    text: "  gua beneran udh muak sama orang orang egois kayak lu  ",
    image: "penculik_licik.png",
  },
  {
    speaker: "Penculik",
    text: "  tapi yaudahlah, mau gimana lagi... lu emang egois  ",
    image: "penculik.png",
  },
  {
    speaker: "Penculik",
    text: "  ya intinya, lu disini buat... yaa seru seruan lah sama hidup lu  ",
    image: "penculik_licik.png",
  },
  {
    speaker: "Penculik",
    text: "  helm  ini  bakal  nyambungin  pikiranlu  sama  gua  ",
    image: "penculik.png",
  },
  {
    speaker: "Koruptor",
    text: "  FAK APAAN INI GAUSAH ANEH ANEH...  ",
    image: "koruptor_helmet.png",
  },
  {
    speaker: "Penculik",
    text: "  yaa.. dunia virtual gitu, gua udh atur semuanya  ",
    image: "penculik_laugh.png",
  },
  {
    speaker: "Penculik",
    text: "  kalah  sekali,  satu  bagian  tubuhlu  jadi  taruhannya  ",
    image: "penculik_licik.png",
  },
  {
    speaker: "Koruptor",
    text: "  APA APAAN...  ",
    image: "koruptor_helmet.png",
  },
  {
    speaker: "Penculik",
    text: "  tapi  kalau  lu  menang,  bebas.  gak  hilang  apa-apa  ",
    image: "penculik_laugh.png",
  },
  {
    speaker: "Koruptor",
    text: " ... stop ini semua... gua minta maaf...  ",
    image: "koruptor_helmet.png",
  },
  {
    speaker: "Penculik",
    text: "  hmm.. jujur aja gua gatau kenapa gua ngelakuin ini  ",
    image: "penculik.png",
  },
  {
    speaker: "Penculik",
    text: "  tapi...  ",
    image: "penculik.png",
  },
  {
    speaker: "Penculik",
    text: "  gua benci sama orang orang kayak lu  ",
    image: "penculik.png",
  },
  {
    speaker: "Koruptor",
    text: " gua minta maaf...  ",
    image: "koruptor_helmet.png",
  },
  {
    speaker: "Penculik",
    text: "  yaa.. yaudah lah udh terlanjur, selamat datang di dunia nyata  ",
    image: "penculik.png",
  },
  {
    speaker: "Koruptor",
    text: " ya Tuhan... saya minta maaf...  ",
    image: "koruptor_helmet.png",
  },
];

const PrologueScene: React.FC = () => {
  const { setScene } = useGame();
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentDialogue = dialogues[index] || { speaker: "", text: "" };
  const text = currentDialogue.text ?? "";

  useEffect(() => {
    let i = 0;
    let interval: NodeJS.Timeout;
    let sound: HTMLAudioElement | null = null;

    setDisplayedText("");
    setIsTyping(true);

    // Hitung durasi animasi teks (misalnya 30ms per karakter)
    const duration = text.trim().length * 30;

    // Stop previous sound jika masih ada
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Load dan mainkan sound hanya untuk durasi animasi
    sound = new Audio("/assets/audio/dialogueSound2.mp3");
    sound.loop = true;
    sound.volume = 0.2;
    sound.play().catch(() => {}); // catch untuk menghindari warning autoplay

    audioRef.current = sound;

    // Stop backsound setelah durasi animasi selesai
    const soundTimeout = setTimeout(() => {
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }
    }, duration);

    // Efek ketikan per karakter
    interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);

    return () => {
      clearInterval(interval);
      clearTimeout(soundTimeout);
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }
    };
  }, [index]);

  const handleClick = () => {
    if (isTyping) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    if (index < dialogues.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      // Trigger fade and audio
      setIsFading(true);
      const powerDownSound = new Audio("/assets/audio/power_down.mp3");
      powerDownSound.play();

      setTimeout(() => {
        setScene("chapter1");
      }, 10000); // 10 detik fade
    }
  };

  const handleSkip = () => {
    const skipButton = new Audio("/assets/audio/click.mp3");
    skipButton.play();
    setIndex(dialogues.length - 1);
    setDisplayedText(dialogues[dialogues.length - 1].text);
    setIsTyping(false);
  };

  return (
    <div className="h-screen w-screen bg-neutral-900 text-white flex flex-col justify-center items-center relative p-8">
      {/* Gambar karakter utama di tengah */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index} // memicu animasi ulang saat index (dialogue) berubah
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="mb-40"
        >
          <img
            src={`/assets/characters/${currentDialogue.image}`}
            alt={currentDialogue.speaker}
            className="w-96 h-96 object-contain"
          />
        </motion.div>
      </AnimatePresence>

      {/* Area dialog & karakter bawah */}
      <div
        className="absolute bottom-4 flex items-end border-2 bg-neutral-800 border-neutral-600 p-4 w-full max-w-6xl rounded-lg"
        onClick={handleClick}
      >
        {currentDialogue.speaker.toLowerCase() === "penculik" ? (
          <div className="items-center bg-neutral-900 border-neutral-700 border-2 rounded-lg p-4 mr-4">
            <img
              src={`/assets/characters/${currentDialogue.image}`}
              alt={currentDialogue.speaker}
              className="w-32 h-32 object-contain"
            />
            <p className="text-3xl text-center text-neutral-400 w-full">
              {currentDialogue.speaker}
            </p>
          </div>
        ) : (
          <div className="items-center bg-red-950 border-red-800 border-2 rounded-lg p-4 mr-4">
            <img
              src={`/assets/characters/${currentDialogue.image}`}
              alt={currentDialogue.speaker}
              className="w-32 h-32 object-contain"
            />
            <p className="text-3xl text-center text-red-500 w-full">
              {currentDialogue.speaker}
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="border-2 bg-neutral-600 border-neutral-500 text-4xl text-neutral-300 rounded-lg p-3 w-full"
          >
            <p>{displayedText}</p>
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
      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-6 right-6 px-16 py-5 pixel-button text-4xl  font-bold rounded-xl shadow-md z-40"
      >
        Skip
      </button>
    </div>
  );
};

export default PrologueScene;
