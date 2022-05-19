import { createContext, React, useEffect, useState } from "react";
import "./App.css";
import Board from "./components/Board";
import GameOver from "./components/GameOver";
import Keyboard from "./components/Keyboard";
import wordBank from "./word-bank.txt";

export const AppContext = createContext();

function App() {
  const [board, setBoard] = useState([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);
  const [correctWord, setCorrectWord] = useState("")
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });
  const [wordSet, setWordSet] = useState(new Set());
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
  });

  const generateWordSet = async () => {
    let wordSet;
    let newWord;
    await fetch(wordBank)
      .then((r) => r.text())
      .then((res) => {
        const wordArr = res.split(/\r?\n/);
        newWord = wordArr[Math.floor(Math.random() * wordArr.length)];
        wordSet = new Set(wordArr);
      });

    return { wordSet, newWord };
  };

  useEffect(() => {
    generateWordSet().then((words) => {
      setWordSet(words.wordSet);
      setCorrectWord(words.newWord.toUpperCase())
    });
  }, []);

  function onEnter() {
    if (currAttempt.letterPos !== 5) return;

    let currWord = "";

    for (let i = 0; i < 5; i++) {
      currWord += board[currAttempt.attempt][i];
    }
    if (wordSet.has(currWord.toLowerCase())) {
      setCurrAttempt({
        attempt: currAttempt.attempt + 1,
        letterPos: 0,
      });
    } else {
      alert("not found");
    }
    if (currWord === correctWord) {
      setGameOver({
        gameOver: true,
        guessedWord: true,
      });
      return;
    }
    if (currAttempt.attempt === 5) {
      setGameOver({ gameOver: true, guessedWord: false });
      return;
    }
  }

  function onDelete() {
    if (currAttempt.letterPos === 0) return;
    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letterPos - 1] = "";
    setBoard(newBoard);
    setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos - 1 });
  }

  function onSelect(keyVal) {
    if (currAttempt.letterPos > 4) return;
    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letterPos] = keyVal;
    setBoard(newBoard);
    setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos + 1 });
  }


  function reset(){
    setBoard([
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ]);
    setGameOver({ gameOver: false, guessedWord: false});
    setCurrAttempt({attempt: 0, letterPos: 0});
    setDisabledLetters([])
    generateWordSet().then((words) => {
    setCorrectWord(words.newWord.toUpperCase())
      });

  }

  return (
    <div className="App">
      <nav>
        <h2>Freedle</h2>
      </nav>
      <AppContext.Provider
        value={{
          board,
          setBoard,
          currAttempt,
          setCurrAttempt,
          onEnter,
          onDelete,
          onSelect,
          correctWord,
          disabledLetters,
          setDisabledLetters,
          gameOver,
          setGameOver,
          reset
        }}
      >
        <div className="game">
          <Board />
          {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
