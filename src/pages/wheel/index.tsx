import { useMemo, useState } from "react";
import { Header } from "../../components/Header";
import { Wheel } from "../../components/Wheel";

export const WheelPage = () => {
  const [winner, setWinner] = useState<string>();
  const [inputText, setInputText] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);

  const formattedOptions = useMemo(() => {
    return options
      .map((option) => {
        if (option) {
          return {
            color: "#FF0000",
            label: option,
          };
        }
      })
      .filter((item): item is { color: string; label: string } => !!item);
  }, [options]);

  const addOption = () => {
    setOptions((prev) => [...prev, inputText]);

    setInputText("");
  };

  const wheel = useMemo(() => {
    if (formattedOptions.length === 0) {
      return (
        <div className="w-[440px] h-[440px] flex justify-center items-center">
          <span>No options yet</span>
        </div>
      );
    }
    return (
      <Wheel
        options={formattedOptions}
        onWinnerSelected={(winner) => {
          setWinner(winner);
        }}
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
