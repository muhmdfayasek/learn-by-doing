import { useRef, useState, useEffect } from "react";
import Die from "./components/Die";
import {nanoid} from 'nanoid';
import Confetti from 'react-confetti'

function App() {

  function generateAllNewDice() {
    return new Array(10)
    .fill(0)
    .map(() => ({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid(5)
      }));
  };
  
  const [dice, setDice] = useState(() => generateAllNewDice());
  const buttonRef = useRef(null);

  const gameWon = dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value);

  useEffect(() => {
    if(gameWon) buttonRef.current.focus();
  }, [gameWon]);
  

  const rollDice = () => {
    if(!gameWon){
      setDice(oldDice => oldDice.map(die =>
        die.isHeld ? die :
              {...die, value: Math.ceil(Math.random() * 6)}
      ));
    } else{
      setDice(generateAllNewDice())
    }
  }

  const hold = (id) => {
    // console.log(id);
    setDice(oldDice => {
      return oldDice.map(die => {
        if(die.id === id){
          return {...die, isHeld: !die.isHeld}
        } else{
          return die
        }
      })
    })
  }

  const diceElements = dice.map(dieObj => 
    <Die 
      key={dieObj.id} 
      value={dieObj.value} 
      isHeld={dieObj.isHeld}
      hold={() => hold(dieObj.id)} 
    />
  );

  return (
    <main>
      {gameWon && <Confetti />}
      <div aria-label="polite" className="sr-only">
        {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
      </div>
      <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
          {gameWon ? "New Game" : "Roll Dice"}
      </button>
    </main>
  );
}

export default App;
