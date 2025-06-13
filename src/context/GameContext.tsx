// src/context/GameContext.tsx
import React, { createContext, useContext, useState } from "react";

type GameState = {
  scene: string;
  handLost: boolean;
  legLost: boolean;
  earLost: boolean;
  mouthLost: boolean;
  eyeLost: boolean;
  setScene: (scene: string) => void;
  setPartLost: (part: keyof Omit<GameState, 'scene' | 'setScene' | 'setPartLost'>) => void;
};

const defaultState: GameState = {
  scene: "start",
  handLost: false,
  legLost: false,
  earLost: false,
  mouthLost: false,
  eyeLost: false,
  setScene: () => {},
  setPartLost: () => {},
};

const GameContext = createContext<GameState>(defaultState);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scene, setScene] = useState("start");
  const [losses, setLosses] = useState({
    handLost: false,
    legLost: false,
    earLost: false,
    mouthLost: false,
    eyeLost: false,
  });

  const setPartLost = (part: keyof typeof losses) => {
    setLosses((prev) => ({ ...prev, [part]: true }));
  };

  return (
    <GameContext.Provider value={{ ...losses, scene, setScene, setPartLost }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
