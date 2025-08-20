import { useEffect, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";

// Helper function to get the transform style for each face of the dice
const getFaceStyle = (face: number) => {
  switch (face) {
    case 1:
      return { transform: "rotateY(0deg) translateZ(50px)" };
    case 2:
      return { transform: "rotateY(90deg) translateZ(50px)" };
    case 3:
      return { transform: "rotateX(90deg) translateZ(50px)" };
    case 4:
      return { transform: "rotateX(-90deg) translateZ(50px)" };
    case 5:
      return { transform: "rotateY(-90deg) translateZ(50px)" };
    case 6:
      return { transform: "rotateY(180deg) translateZ(50px)" };
    default:
      return {};
  }
};

// Styles for the dots on each face
const dotPatterns: Record<number, number[][]> = {
  1: [[50, 50]],
  2: [
    [25, 25],
    [75, 75],
  ],
  3: [
    [25, 25],
    [50, 50],
    [75, 75],
  ],
  4: [
    [25, 25],
    [25, 75],
    [75, 25],
    [75, 75],
  ],
  5: [
    [25, 25],
    [25, 75],
    [75, 25],
    [75, 75],
    [50, 50],
  ],
  6: [
    [25, 25],
    [25, 50],
    [25, 75],
    [75, 25],
    [75, 50],
    [75, 75],
  ],
} as const;

const DiceFace = ({ face }: { face: number }) => {
  const faceStyle = getFaceStyle(face);
  const dots = dotPatterns[face] || [];

  return (
    <div
      className="absolute w-[100px] h-[100px] bg-white border border-gray-800 flex justify-center items-center rounded-lg"
      style={{ ...faceStyle, backfaceVisibility: "hidden" }}
    >
      <div className="relative w-full h-full">
        {dots.map(([top, left], i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-black rounded-full"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              transform: "translate(-50%, -50%)",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export const Dice = ({
  isRolling,
  onRollEnd,
}: {
  isRolling: boolean;
  onRollEnd: (result: number) => void;
}) => {
  const controls = useAnimation();

  // This map defines the final rotation needed to show a specific face.
  // For example, to show face 3 (which is on top), we rotate the cube -90 degrees on the X-axis.
  const rotationsForFace: Record<number, { x: number; y: number }> = useMemo(
    () => ({
      1: { x: 0, y: 0 }, // Front
      2: { x: 0, y: -90 }, // Right
      3: { x: -90, y: 0 }, // Top
      4: { x: 90, y: 0 }, // Bottom
      5: { x: 0, y: 90 }, // Left
      6: { x: 0, y: 180 }, // Back
    }),
    []
  );

  useEffect(() => {
    const rollDice = async () => {
      if (isRolling) {
        // Instantly reset the dice to a neutral position before starting the new roll.
        await controls.set({ rotateX: 0, rotateY: 0 });

        // 1. Determine the result of the roll first.
        const result = Math.floor(Math.random() * 6) + 1;

        // 2. Get the target rotation for that result from our map.
        const targetRotation = rotationsForFace[result];

        // 3. Add several full 360-degree spins for a more dynamic "tumble" animation.
        const randomSpinsX = (Math.floor(Math.random() * 4) + 4) * 360;
        const randomSpinsY = (Math.floor(Math.random() * 4) + 4) * 360;

        // 4. Start the animation to the final calculated rotation.
        await controls.start({
          rotateX: targetRotation.x + randomSpinsX,
          rotateY: targetRotation.y + randomSpinsY,
          transition: {
            duration: 3,
            ease: "easeOut",
          },
        });

        // 5. Once the animation is complete, notify the parent with the pre-determined result.
        onRollEnd(result);
      }
    };

    rollDice();
  }, [isRolling, controls, onRollEnd, rotationsForFace]);

  return (
    <div className="w-[100px] h-[100px]" style={{ perspective: "1000px" }}>
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={controls}
        initial={{ rotateX: 0, rotateY: 0 }}
      >
        {[1, 2, 3, 4, 5, 6].map((face) => (
          <DiceFace key={face} face={face} />
        ))}
      </motion.div>
    </div>
  );
};
