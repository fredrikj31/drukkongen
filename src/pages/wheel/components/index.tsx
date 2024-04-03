import React, { useCallback, useEffect, useRef } from "react";

interface WheelProps {
  segments: string[];
  segColors: string[];
  onFinished: (segment: string) => void;
  primaryColor?: string;
  contrastColor?: string;
  size?: number;
  upDuration?: number;
  downDuration?: number;
  width?: number;
  height?: number;
}

export const WheelComponent: React.FC<WheelProps> = ({
  segments,
  segColors,
  onFinished,
  primaryColor,
  contrastColor,
  size = 290,
  upDuration = 1000,
  downDuration = 100,
  width = 100,
  height = 100,
}) => {
  const currentSegment = useRef<string>("");
  const isStarted = useRef<boolean>(false);
  const timerHandle = useRef<number | null>(null);
  const timerDelay = useRef<number>(segments.length);
  const angleCurrent = useRef<number>(0);
  const angleDelta = useRef<number>(0);
  const canvasContext = useRef<HTMLCanvasElement | null>(null);
  const maxSpeed = useRef<number>(Math.PI / segments.length);
  const upTime = useRef<number>(segments.length * upDuration);
  const downTime = useRef<number>(segments.length * downDuration);
  const spinStart = useRef<number>(0);
  const centerX = useRef<number>(width / 2);
  const centerY = useRef<number>(height / 2);

  const drawSegment = useCallback(
    (key: number, lastAngle: number, angle: number) => {
      const ctx = canvasContext.current?.getContext("2d");
      const value = segments[key];
      ctx?.save();
      ctx?.beginPath();
      ctx?.moveTo(centerX.current, centerY.current);
      ctx?.arc(centerX.current, centerY.current, size, lastAngle, angle, false);
      ctx?.lineTo(centerX.current, centerY.current);
      ctx?.closePath();
      ctx!.fillStyle = segColors[key];
      ctx?.fill();
      ctx?.save();
      ctx?.translate(centerX.current, centerY.current);
      ctx?.rotate((lastAngle + angle) / 2);
      ctx!.fillStyle = contrastColor || "white";
      ctx!.font = "bold 1em arial";
      ctx?.fillText(value.substring(0, 21), size / 2 + 20, 0);
      ctx?.restore();
    },
    [centerX, centerY, contrastColor, segColors, segments, size]
  );

  const drawWheel = useCallback(() => {
    const ctx = canvasContext.current?.getContext("2d");
    let lastAngle = angleCurrent.current;
    const PI2 = Math.PI * 2;
    ctx!.textBaseline = "middle";
    ctx!.textAlign = "center";
    ctx!.font = "1em arial";
    for (let i = 1; i <= segments.length; i++) {
      const angle = PI2 * (i / segments.length) + angleCurrent.current;
      drawSegment(i - 1, lastAngle, angle);
      lastAngle = angle;
    }
    // Draw a center circle
    ctx?.beginPath();
    ctx?.arc(centerX.current, centerY.current, 40, 0, PI2, false);
    ctx?.closePath();
    ctx!.fillStyle = primaryColor || "black";
    ctx!.lineWidth = 5;
    ctx!.strokeStyle = contrastColor || "white";
    ctx?.fill();
    ctx!.font = "bold 1.25em arial";
    ctx!.fillStyle = contrastColor || "white";
    ctx!.textAlign = "center";
    ctx?.fillText("Spin", centerX.current, centerY.current);
    ctx?.stroke();

    // Draw outer circle
    ctx?.beginPath();
    ctx?.arc(centerX.current, centerY.current, size, 0, PI2, false);
    ctx?.closePath();
  }, [angleCurrent, centerX, centerY, contrastColor, drawSegment, primaryColor, segments, size]);

  const drawNeedle = useCallback(() => {
    const ctx = canvasContext.current?.getContext("2d");
    ctx!.lineWidth = 1;
    ctx!.strokeStyle = contrastColor || "white";
    ctx!.fillStyle = contrastColor || "white";
    ctx?.beginPath();
    ctx?.moveTo(centerX.current + 10, centerY.current - 40);
    ctx?.lineTo(centerX.current - 10, centerY.current - 40);
    ctx?.lineTo(centerX.current, centerY.current - 60);
    ctx?.closePath();
    ctx?.fill();
    const change = angleCurrent.current + Math.PI / 2;
    let i = segments.length - Math.floor((change / (Math.PI * 2)) * segments.length) - 1;
    if (i < 0) i = i + segments.length;
    ctx!.textAlign = "center";
    ctx!.textBaseline = "middle";
    ctx!.fillStyle = "transparent";
    ctx!.font = "bold 1.5em arial";
    currentSegment.current = segments[i];
    isStarted && ctx?.fillText(currentSegment.current, centerX.current + 10, centerY.current + size + 50);
  }, [angleCurrent, centerX, centerY, contrastColor, isStarted, segments, size]);

  const clear = useCallback(() => {
    const ctx = canvasContext.current?.getContext("2d");
    ctx?.clearRect(0, 0, width, height);
  }, [width, height]);

  const draw = useCallback(() => {
    clear();
    drawWheel();
    drawNeedle();
  }, [clear, drawWheel, drawNeedle]);

  const onTimerTick = useCallback(() => {
    draw();
    const duration = new Date().getTime() - spinStart.current;
    let progress = 0;
    let finished = false;
    if (duration < upTime.current) {
      progress = duration / upTime.current;
      angleDelta.current = maxSpeed.current * Math.sin((progress * Math.PI) / 2);
    } else {
      progress = duration / downTime.current;
      if (progress >= 0.8) {
        angleDelta.current = (maxSpeed.current / 1.2) * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      } else if (progress >= 0.98) {
        angleDelta.current = (maxSpeed.current / 2) * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      } else angleDelta.current = maxSpeed.current * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      if (progress >= 1) finished = true;
    }

    angleCurrent.current += angleDelta.current;
    while (angleCurrent.current >= Math.PI * 2) angleCurrent.current -= Math.PI * 2;
    if (finished) {
      onFinished(currentSegment.current);
      clearInterval(timerHandle.current || 0);
      timerHandle.current = null;
      angleDelta.current = 0;
    }
  }, [downTime, upTime, onFinished, draw]);

  const spin = useCallback(() => {
    isStarted.current = true;
    if (!timerHandle.current) {
      spinStart.current = new Date().getTime();
      maxSpeed.current = Math.PI / segments.length;
      timerHandle.current = window.setInterval(onTimerTick, timerDelay.current);
    }
  }, [onTimerTick, segments, timerDelay]);

  const initCanvas = useCallback(() => {
    canvasContext.current?.addEventListener("click", spin);
  }, [spin]);

  const wheelInit = useCallback(() => {
    initCanvas();
    clear();
    drawWheel();
    drawNeedle();
  }, [initCanvas, clear, drawWheel, drawNeedle]);

  useEffect(() => {
    wheelInit();
  }, [wheelInit]);

  return <canvas ref={canvasContext} width={width} height={height} style={{ cursor: "pointer" }} />;
};
