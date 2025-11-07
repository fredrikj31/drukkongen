import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../../components/Header";
import { useMemo, useState, type FormEvent } from "react";
import { ChevronDown, Trash2 } from "lucide-react";

// Predefined color palette for the wheel segments
const COLORS = ["#efb100", "#00c951", "#2b7fff", "#fb2c36"];

export const WheelOfFortunePage = () => {
  // State for the options on the wheel
  const [options, setOptions] = useState(["Test 1", "Test 2"]);
  // State for the input field to add a new option
  const [newOption, setNewOption] = useState<string>("");
  // State to track if the wheel is currently spinning
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  // State to store the final rotation angle of the wheel
  const [rotation, setRotation] = useState<number>(0);
  // State to store the winning option, displayed after spin
  const [winner, setWinner] = useState<string | null>(null);
  // State to store the winner while the wheel is spinning
  const [pendingWinner, setPendingWinner] = useState<string | null>(null);
  // State for the duration of the spin animation
  const [spinDuration, setSpinDuration] = useState<number>(7.5);

  // Memoize the angle of each segment to avoid recalculation on every render
  const segmentAngle = useMemo(() => 360 / options.length, [options.length]);

  /**
   * Handles adding a new option to the wheel.
   * @param {React.FormEvent} e - The form event.
   */
  const handleAddOption = (e: FormEvent) => {
    e.preventDefault();
    if (
      newOption.trim() &&
      !options.includes(newOption.trim()) &&
      options.length < COLORS.length
    ) {
      setOptions([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  /**
   * Handles removing an option from the wheel.
   * @param {string} optionToRemove - The option string to remove.
   */
  const handleRemoveOption = (optionToRemove: string) => {
    if (options.length > 2) {
      // Keep at least 2 options
      setOptions(options.filter((opt) => opt !== optionToRemove));
    }
  };

  /**
   * Handles the spinning logic of the wheel.
   */
  const handleSpin = () => {
    if (isSpinning || options.length < 2) return;

    setIsSpinning(true);
    setWinner(null);

    // Determine a random winning segment and store it
    const winningSegmentIndex = Math.floor(Math.random() * options.length);
    const winningOption = options[winningSegmentIndex];
    setPendingWinner(winningOption);

    // Randomize spin duration for more unpredictability
    const duration = Math.random() * 2 + 7; // Random duration between 7 and 9 seconds
    setSpinDuration(duration);

    // --- Calculate the final rotation ---
    // 1. Calculate the target angle for the middle of the winning segment.
    const winningSegmentMiddleAngle =
      winningSegmentIndex * segmentAngle + segmentAngle / 2;

    // 2. Add a random offset within the segment to make the landing position less predictable.
    const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.8);
    const targetAngleOnWheel = winningSegmentMiddleAngle + randomOffset;

    // 3. The pointer is at the top (270 degrees in SVG coordinate system). We calculate the rotation
    // needed to bring the target angle to the pointer's position.
    const rotationToWinner = 270 - targetAngleOnWheel;

    // 4. Calculate the additional rotation from the current position, ensuring it's always clockwise.
    const additionalRotation =
      (360 - (rotation % 360) + rotationToWinner) % 360;

    // 5. Add several full spins for visual effect.
    const fullSpins = (Math.floor(Math.random() * 5) + 4) * 360; // 4-8 full spins

    // 6. Set the new total rotation, accumulating from the previous rotation.
    const newRotation = rotation + fullSpins + additionalRotation;
    setRotation(newRotation);
  };

  /**
   * Called when the spin animation completes.
   */
  const onSpinComplete = () => {
    if (pendingWinner) {
      setWinner(pendingWinner);
      setPendingWinner(null);
    }
    setIsSpinning(false);
  };

  /**
   * Renders the segments of the wheel.
   * Each segment is an SVG path (a pie slice).
   */
  const renderSegments = () => {
    const radius = 200; // Radius of the wheel
    const center = 250; // Center coordinate of the SVG viewbox

    return options.map((option, index) => {
      const startAngle = segmentAngle * index;
      const endAngle = startAngle + segmentAngle;

      // Convert angles to radians for trigonometric functions
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      // Calculate the coordinates for the arc
      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);

      // Create the SVG path data for the pie slice
      const largeArcFlag = segmentAngle > 180 ? 1 : 0;
      const pathData = `M${center},${center} L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2} Z`;

      // Calculate position for the text
      const textAngle = startAngle + segmentAngle / 2;
      const textRad = (textAngle * Math.PI) / 180;
      const textX = center + (radius / 1.5) * Math.cos(textRad);
      const textY = center + (radius / 1.5) * Math.sin(textRad);

      return (
        <g key={index}>
          <path
            d={pathData}
            fill={COLORS[index % COLORS.length]}
            stroke="#fff"
            strokeWidth="2"
          />
          <text
            x={textX}
            y={textY}
            fill="#fff"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
            transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            {option.length > 15 ? option.substring(0, 13) + "..." : option}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="min-w-full">
      <Header text="Hjul" />
      <div className="w-full flex flex-row items-center justify-center">
        {/* Wheel Section */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <ChevronDown size={60} className="text-black" fill="white" />
          </div>
          <motion.div
            className="relative w-[400px] h-[400px] rounded-full"
            animate={{ rotate: rotation }}
            transition={{
              type: "tween",
              ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for slow-fast-slow effect
              duration: spinDuration,
            }}
            onAnimationComplete={onSpinComplete}
          >
            <svg viewBox="0 0 500 500" className="w-full h-full">
              <defs>
                <filter
                  id="shadow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="10"
                    floodColor="#000"
                    floodOpacity="0.5"
                  />
                </filter>
              </defs>
              <g filter="url(#shadow)">{renderSegments()}</g>
              <circle
                cx="250"
                cy="250"
                r="40"
                fill="#000000"
                stroke="#fff"
                strokeWidth="4"
              />
              <circle cx="250" cy="250" r="15" fill="#fb2c36" />
            </svg>
          </motion.div>
          <AnimatePresence>
            {winner && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center -top-12"
              >
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg border-2 border-red-400">
                  <p className="text-xl text-black mb-2">The result is...</p>
                  <h2 className="text-4xl font-bold text-red-400 break-all">
                    {winner}
                  </h2>
                  <button
                    onClick={() => setWinner(null)}
                    className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={handleSpin}
            disabled={isSpinning || options.length < 2}
            className="w-fit px-4 z-10 bg-red-500 text-white font-bold text-xl py-4 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 flex items-center justify-center gap-2"
          >
            {isSpinning ? "Spinning..." : "SPIN THE WHEEL"}
          </button>
        </div>
      </div>
      <div className="w-full flex flex-col gap-4 items-center mt-5">
        <span className="text-lg font-semibold">Tilføj Valgmulighed:</span>
        <form onSubmit={handleAddOption} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder="Add new option"
            className="flex-grow bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Add
          </button>
        </form>
        <div className="flex flex-col gap-2 w-4/5 pr-2">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-700 p-2 rounded-lg"
            >
              <span className="truncate">{option}</span>
              <button
                onClick={() => handleRemoveOption(option)}
                disabled={options.length <= 2}
                className="text-red-400 hover:text-red-600 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
