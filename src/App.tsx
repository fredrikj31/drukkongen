import { Tab } from "./components/Tab";
import DiceIcon from "./assets/images/dice.svg";
import CoinFlipIcon from "./assets/images/coinflip.svg";
import WheelIcon from "./assets/images/wheel.svg";

const App = () => {
  return (
    <>
      <div className="flex justify-center items-center my-7">
        <h1 className="text-4xl font-bold">Druk Kongen</h1>
      </div>
      <div className="flex flex-col gap-10">
        <div className="flex flex-row justify-center gap-10">
          <Tab icon={DiceIcon} text="Terninger" url="/dices" />
          <Tab icon={CoinFlipIcon} text="Coin Flip" url="/coinflip" />
        </div>
        <div className="flex flex-row justify-center gap-10">
          <Tab icon={WheelIcon} text="Eget Hjul" url="/wheel" />
        </div>
      </div>
    </>
  );
};

export default App;
