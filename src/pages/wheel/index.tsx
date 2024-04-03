import { useMemo, useState } from "react";
import { Header } from "../../components/Header";
import { WheelComponent } from "./components";

export const WheelPage = () => {
  const [winner, setWinner] = useState<string>();
  const [inputText, setInputText] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);

  const colors = useMemo(
    () => ["#ef4444", "#f59e0b", "#84cc16", "#10b981", "#06b6d4", "#3b82f6", "#8b5cf6", "#d946ef", "#f43f5e"],
    []
  );

  const formattedOptions = useMemo(() => {
    return options
      .map((option, index) => {
        if (option) {
          return {
            color: colors[index % colors.length],
            label: option,
          };
        }
      })
      .filter((item): item is { color: string; label: string } => !!item);
  }, [colors, options]);

  const addOption = () => {
    setOptions((prev) => [...prev, inputText]);

    setInputText("");
  };

  const wheel = useMemo(() => {
    if (formattedOptions.length === 0) {
      return (
        <div
          className="bg-red-500 rounded-full flex justify-center items-center"
          style={{
            width: window.innerWidth - 20 * 2,
            height: window.innerWidth - 20 * 2,
          }}
        >
          <span>No options yet</span>
        </div>
      );
    }
    return (
      <WheelComponent
        segments={formattedOptions.map((option) => option.label)}
        segColors={formattedOptions.map((option) => option.color)}
        onFinished={(winner) => {
          console.log({ formattedOptions });
          setWinner(winner);
        }}
        primaryColor="black"
        contrastColor="white"
        size={(window.innerWidth - 20 * 2) / 2 - 10}
        width={window.innerWidth - 20 * 2} // 20px padding on each side
        height={window.innerWidth - 20 * 2}
        upDuration={50}
        downDuration={2000}
      />
    );
  }, [formattedOptions]);

  return (
    <>
      <Header text="Eget Hjul" />
      <div className="flex flex-col justify-center items-center">
        {wheel}
        <p>Resultat: {winner}</p>
        <input className="border" value={inputText} onChange={(e) => setInputText(e.currentTarget.value)} />
        <button onClick={addOption}>Add option</button>
      </div>
    </>
  );
};
