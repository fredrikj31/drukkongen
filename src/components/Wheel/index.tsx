import { useCallback, useEffect, useRef } from "react";

interface WheelProps {
  options: { color: string; label: string }[];
  onWinnerSelected: (winner: string) => void;
}
export const Wheel = ({ options, onWinnerSelected }: WheelProps) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const size = 200;
  const dimension = (size + 20) * 2;
  const timerDelay = 3;
  const maxSpeed = 0.075;
  const upTime = 700;
  const downTime = 7000;
  const centerX = size + 20;
  const centerY = size + 20;

  let currentSegment = "";
  let isStarted = false;
  let timerHandle = 0;
  let spinStart = 0;
  let angleCurrent = 0;
  let angleDelta = 0;

  const spin = () => {
    isStarted = true;
    if (timerHandle === 0) {
      spinStart = new Date().getTime();
      timerHandle = setInterval(onTimerTick, timerDelay);
    }
  };

  const onTimerTick = () => {
    draw();
    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false;
    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else {
      progress = duration / downTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      if (progress >= 1) finished = true;
    }

    angleCurrent += angleDelta;
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;
    if (finished) {
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
      onWinnerSelected(currentSegment);
    }
  };

  const draw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const drawSegment = useCallback(
    (key: number, lastAngle: number, angle: number) => {
      const canvas = canvasRef.current!.getContext("2d");
      if (!canvas) {
        return false;
      }
      const value = options[key].label;
      canvas.save();
      canvas.beginPath();
      canvas.moveTo(centerX, centerY);
      canvas.arc(centerX, centerY, size, lastAngle, angle, false);
      canvas.lineTo(centerX, centerY);
      canvas.closePath();
      canvas.fillStyle = options[key].color;
      canvas.fill();
      canvas.stroke();
      canvas.save();
      canvas.translate(centerX, centerY);
      canvas.rotate((lastAngle + angle) / 2);
      canvas.fillStyle = "#000000";
      canvas.font = "1em " + "Arial";
      canvas.fillText(value.substring(0, 21), size / 2 + 20, 0);
      canvas.restore();
    },
    [centerX, centerY, options]
  );

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current!.getContext("2d");
    if (!canvas) {
      return false;
    }
    let lastAngle = angleCurrent;
    const len = options.length;
    const PI2 = Math.PI * 2;
    canvas.lineWidth = 1;
    canvas.strokeStyle = "#000000";
    canvas.textBaseline = "middle";
    canvas.textAlign = "center";
    canvas.font = "1em " + "Arial";
    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrent;
      drawSegment(i - 1, lastAngle, angle);
      lastAngle = angle;
    }

    // Draw a center circle
    canvas.beginPath();
    canvas.arc(centerX, centerY, 50, 0, PI2, false);
    canvas.closePath();
    canvas.fillStyle = "#000000";
    canvas.lineWidth = 10;
    canvas.strokeStyle = "#FFFFFF";
    canvas.fill();
    canvas.font = "bold 1em " + "Arial";
    canvas.fillStyle = "#FFFFFF";
    canvas.textAlign = "center";
    canvas.fillText("Spin", centerX, centerY + 3);
    canvas.stroke();

    // Draw outer circle
    canvas.beginPath();
    canvas.arc(centerX, centerY, size, 0, PI2, false);
    canvas.closePath();
  }, [angleCurrent, centerX, centerY, drawSegment, options]);

  const drawNeedle = useCallback(() => {
    const canvas = canvasRef.current!.getContext("2d");
    if (!canvas) {
      return false;
    }
    canvas.lineWidth = 1;
    canvas.strokeStyle = "#FFFFFF";
    canvas.fillStyle = "#FFFFFF";
    canvas.beginPath();
    canvas.moveTo(centerX + 20, centerY - 50);
    canvas.lineTo(centerX - 20, centerY - 50);
    canvas.lineTo(centerX, centerY - 70);
    canvas.closePath();
    canvas.fill();
    const change = angleCurrent + Math.PI / 2;
    let i = options.length - Math.floor((change / (Math.PI * 2)) * options.length) - 1;
    if (i < 0) i = i + options.length;
    canvas.textAlign = "center";
    canvas.textBaseline = "middle";
    canvas.fillStyle = "#000000";
    canvas.font = "bold 1.5em " + "Arial";
    currentSegment = options[i].label;
    isStarted && canvas.fillText(currentSegment, centerX + 10, centerY + size + 50);
  }, [options]);

  const clear = useCallback(() => {
    const canvas = canvasRef.current!.getContext("2d");
    if (!canvas) {
      return false;
    }
    canvas.clearRect(0, 0, dimension, dimension);
  }, [dimension]);

  const wheelDraw = useCallback(() => {
    clear();
    drawWheel();
    drawNeedle();
  }, [clear, drawWheel, drawNeedle]);

  useEffect(() => {
    wheelDraw();
  }, [wheelDraw]);

  return (
    <>
      <div ref={wheelRef}>
        <canvas ref={canvasRef} width={dimension} height={dimension} />
      </div>
      <button onClick={spin}>Click Me</button>
    </>
  );
};
