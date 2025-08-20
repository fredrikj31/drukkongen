import { useState, type ReactNode } from "react";
import { motion, useAnimationControls } from "framer-motion";

// Helper function to generate a random number in a range
const getRandom = (min: number, max: number) =>
  Math.random() * (max - min) + min;

// --- Coin Face Component ---
// A simple component for the two faces of the coin
const CoinFace = ({
  children,
  isFront = true,
}: {
  children: ReactNode;
  isFront?: boolean;
}) => (
  <div
    className="absolute w-full h-full rounded-full flex items-center justify-center"
    style={{
      transform: isFront ? "rotateY(0deg)" : "rotateY(180deg)",
      backfaceVisibility: "hidden", // Moved from className for robustness
    }}
  >
    <div className="w-full h-full rounded-full flex items-center justify-center text-5xl font-bold text-red-900 bg-gradient-to-br from-red-400 to-red-600 shadow-inner">
      <div className="w-[90%] h-[90%] rounded-full flex items-center justify-center border-4 border-red-700/50">
        {children}
      </div>
    </div>
  </div>
);

export const CoinFlip = () => {
  const controls = useAnimationControls();
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<"Heads" | "Tails" | null>(null); // 'Heads', 'Tails', or null

  const handleFlip = async () => {
    if (isFlipping) return;

    setIsFlipping(true);
    setResult(null);

    controls.set({ rotateY: 0 });

    const outcome = Math.random() < 0.5 ? "Heads" : "Tails";

    const fullSpins = Math.floor(getRandom(5, 9));
    const finalRotation = fullSpins * 360 + (outcome === "Tails" ? 180 : 0);

    await controls.start({
      rotateY: finalRotation, // This will now animate from 0 to the new finalRotation
      transition: {
        duration: 4, // Total animation duration
        // This cubic-bezier creates the slow-in, fast-middle, slow-out effect
        ease: [0.3, 0, 0.7, 1],
      },
    });

    // 4. Set the final result
    setResult(outcome);
    setIsFlipping(false);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-4">
      {/* This wrapper provides the 3D perspective for the flip */}
      <div style={{ perspective: "1000px" }}>
        <motion.div
          className="relative w-48 h-48 md:w-56 md:h-56 rounded-full shadow-2xl"
          style={{ transformStyle: "preserve-3d" }}
          animate={controls}
        >
          {/* Heads Face */}
          <CoinFace isFront={true}>H</CoinFace>
          {/* Tails Face */}
          <CoinFace isFront={false}>T</CoinFace>
        </motion.div>
      </div>

      <div className="flex flex-col items-center space-y-4 w-full">
        <button
          onClick={handleFlip}
          disabled={isFlipping}
          className="px-8 py-3 bg-yellow-500 text-gray-900 font-bold text-lg rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-yellow-400/50"
        >
          {isFlipping ? "Flipping..." : "Flip Coin"}
        </button>

        <div className="h-10 text-2xl text-center">
          {result && (
            <p>
              Result:{" "}
              <span className="font-bold text-yellow-400">{result}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
