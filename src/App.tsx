import { GameProvider, useGame } from "./context/GameContext";
import StartScene from "./scenes/StartScene";
import PrologueScene from "./scenes/PrologueScene";
import Chapter1Scene from "./scenes/Chapter1Scene";
import Chapter2Scene from "./scenes/Chapter2Scene";
import Chapter3Scene from "./scenes/Chapter3Scene";
import Chapter4Scene from "./scenes/Chapter4Scene";
import Chapter5Scene from "./scenes/Chapter5Scene";
import EndingScene from "./scenes/EndingScene";
import "./styles/global.css";
// ...import scene lainnya

const SceneManager = () => {
  const { scene } = useGame();
  switch (scene) {
    case "start":
      return <StartScene />;
    case "prologue":
      return <PrologueScene />;
    case "chapter1":
      return <Chapter1Scene />;
    case "chapter2":
      return <Chapter2Scene />;
    case "chapter3":
      return <Chapter3Scene />;
    case "chapter4":
      return <Chapter4Scene />;
    case "chapter5":
      return <Chapter5Scene />;
    case "ending":
      return <EndingScene />;
    // tambahkan scene lain...
    default:
      return <StartScene />;
  }
};

function App() {
  return (
    <GameProvider>
      <SceneManager />
    </GameProvider>
  );
}

export default App;
