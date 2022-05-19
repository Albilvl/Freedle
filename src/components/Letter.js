import { React, useContext, useEffect } from "react";
import { AppContext } from "../App";

function Letter({ letterPos, attemptValue }) {
  const { board, setBoard, correctWord, currAttempt, setDisabledLetters } = useContext(AppContext);
  const letter = board[attemptValue][letterPos];

  const correct = correctWord[letterPos] === letter;
  const almost = !correct && letter !== "" && correctWord.includes(letter);

  const letterState =
    currAttempt.attempt > attemptValue &&
    (correct ? "correct" : almost ? "almost" : "error");

  useEffect(() => {
    if (letter !== "" && !correct && !almost) {
      console.log(letter);
      setDisabledLetters((prev) => [...prev, letter]);
    }
  }, [currAttempt.attempt]);

  
  return (
    <div className="letter" id={letterState}>
      {letter}
    </div>
  );
}

export default Letter;
