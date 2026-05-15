import { useState } from "react"
import Confetti from "react-confetti"

import Header from "./components/Header"
import StatusBar from "./components/Status"
import Langchip from "./components/LangChip"
import Key from "./components/Keyboard"

import { languages } from "../lib/languages";
import { getFarewellText, getRandomWord } from "../lib/utils";
import clsx from "clsx"

function App() {
  // State variables
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);

  // Derived variables
  const wrongGuessCount = guessedLetters.filter(letter => 
    !currentWord.includes(letter)).length;
  console.log(wrongGuessCount);
  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter));
  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter);
  const farewellMessage = (isLastGuessIncorrect && !isGameOver) ? getFarewellText(languages[wrongGuessCount - 1].name) : "";
  
  
  // Static variables
  const alphabet = "qwertyuiopasdfghjklzxcvbnm";

  const addGuessedLetter = (letter) => {
    setGuessedLetters(prevLetter => 
      prevLetter.includes(letter) ? 
          prevLetter : [...prevLetter, letter]
    )
    // console.log(letter);
  }

  const resetGame = () => {
    setCurrentWord(getRandomWord());
    setGuessedLetters([]);
  }

  return (
    <main>
      {/* Confetti if Win */}
      <section className="confetti">
        {isGameOver && isGameWon && <Confetti />}
      </section>
      
      {/* Header of Page */}
      <Header />

      {/* Status bar */}
      <StatusBar 
        isGameOver={isGameOver}
        farewellMessage={farewellMessage}
        isGameWon={isGameWon}
        isGameLost={isGameLost}
      />

      {/* Language life-lines */}
      <section className="language-container">
        {languages.map((lang, index) => {
          const isLanguageLost = index < wrongGuessCount;
          return (
            <Langchip
              key={lang.name} 
              name={lang.name}
              backgroundColor={lang.backgroundColor}
              color={lang.color}
              lostLive={isLanguageLost}
            />)
        })}
      </section>

      {/* Where word input will display */}
      <section className="word-display">
        {currentWord.split("").map((letter, index) => {
          const shouldRevealLetter = isGameLost || guessedLetters.includes(letter);
          const styleInputSpan = clsx("word-letter", 
            isGameLost && !guessedLetters.includes(letter) && "missed-letter"
          );
          return (
            <span 
              key={index} 
              className={styleInputSpan}
            >{shouldRevealLetter ? letter.toUpperCase() : ""}</span>
          )})
        }
      </section>
      
      {/* Keyboard layout container */}
      <section className="keyboard">
        {alphabet.split("").map(letter => {

          const isGuessed = guessedLetters.includes(letter);
          const isCorrect = isGuessed && currentWord.includes(letter);
          const isWrong = isGuessed && !currentWord.includes(letter);

          return (
            <Key 
              key={letter} 
              cap={letter}
              clickFunc={addGuessedLetter}
              isCorrect={isCorrect}
              isWrong={isWrong}
              isGameOver={isGameOver}
            />
          )
        })}
      </section>

        {/* New Game Button */}
      {isGameOver &&<button className="new-game pointer" onClick={resetGame}>New Game</button>}
    </main>
  )
}

export default App
