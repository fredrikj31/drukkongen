import { useState } from "react";
import "./index.css";

export const Dice = () => {
  const [canRollDice, setCanRollDice] = useState<boolean>(true);

  const rollDice = () => {
    if (!canRollDice) return;
    setCanRollDice(false);

    setTimeout(() => {
      setCanRollDice(true);
    }, 1500);

    const dice = [...document.querySelectorAll<HTMLOListElement>(".die-list")];
    const randomNumber = getRandomNumber(1, 6);
    dice.forEach((die) => {
      toggleClasses(die);
      die.dataset["roll"] = randomNumber.toString();
    });
  };

  const toggleClasses = (die: HTMLOListElement | null) => {
    if (die) {
      die.classList.toggle("even-roll");
      die.classList.toggle("odd-roll");
    }
  };

  const getRandomNumber = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
  };

  return (
    <>
      <div className="diceContainer">
        <div className="dice" onClick={rollDice}>
          <ol className="die-list even-roll" data-roll="1" id="die-1">
            <li className="die-item" data-side="1">
              <span className="dot"></span>
            </li>
            <li className="die-item" data-side="2">
              <span className="dot"></span>
              <span className="dot"></span>
            </li>
            <li className="die-item" data-side="3">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </li>
            <li className="die-item" data-side="4">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </li>
            <li className="die-item" data-side="5">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </li>
            <li className="die-item" data-side="6">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
};
