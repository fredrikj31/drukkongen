import { useState } from "react";
import { Dice } from "../../../../components/Dice";

export const DiceComponent = () => {
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [result, setResult] = useState<number | null>(null);

  const handleRoll = () => {
    if (!isRolling) {
      setResult(null);
      setIsRolling(true);
    }
  };

  const handleRollEnd = (rollResult: number) => {
    setIsRolling(false);
    setResult((prev) => (prev ? (prev += rollResult) : rollResult));
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 mt-4">
        <div className="grid grid-cols-2 gap-8">
          <Dice isRolling={isRolling} onRollEnd={handleRollEnd} />
          <Dice isRolling={isRolling} onRollEnd={handleRollEnd} />
          <Dice isRolling={isRolling} onRollEnd={handleRollEnd} />
          <Dice isRolling={isRolling} onRollEnd={handleRollEnd} />
        </div>
        <button
          onClick={handleRoll}
          disabled={isRolling}
          className="px-8 py-4 mt-8 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer focus:ring-opacity-75 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isRolling ? "Rolling..." : "Roll Dice"}
        </button>

        {result && (
          <div className="mt-8 p-6 bg-gray-800 rounded-xl shadow-inner transition-opacity duration-500">
            <p className="text-2xl text-white font-bold">
              Result: <span className="text-red-500 text-3xl">{result}</span>
            </p>
          </div>
        )}
      </div>
    </>
  );
};
