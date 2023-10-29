import "./index.css";

import heads from "../../../../assets/images/heads.svg";
import tails from "../../../../assets/images/tails.svg";
import { useState } from "react";

export const CoinFlip = () => {
  const [canFlipCoin, setCanFlipCoin] = useState<boolean>(true);
  const [result, setResult] = useState<"Krone" | "Plat" | null>(null);

  const flipCoin = () => {
    if (!canFlipCoin) return;

    const flipResult = Math.random();
    const coinElem = document.getElementById("coin");
    setResult(null);
    setCanFlipCoin(false);

    coinElem?.classList.remove("heads", "tails");
    setTimeout(() => {
      if (flipResult <= 0.5) {
        coinElem?.classList.add("heads");
      } else {
        coinElem?.classList.add("tails");
      }
    }, 100);
    setTimeout(() => {
      if (flipResult <= 0.5) {
        setResult("Krone");
      } else {
        setResult("Plat");
      }
      setCanFlipCoin(true);
    }, 3000);
  };

  return (
    <>
      <div id="coin" onClick={flipCoin}>
        <div className="side-a">
          <img src={heads} />
        </div>
        <div className="side-b">
          <img src={tails} />
        </div>
      </div>
      {result && (
        <div className="flex justify-center mt-2">
          <div className="bg-slate-400 w-24 px-3 py-1 rounded-full text-white text-center font-semibold">
            {result}
          </div>
        </div>
      )}
    </>
  );
};
