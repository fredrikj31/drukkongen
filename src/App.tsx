import { Link } from "react-router-dom";
import DiceIcon from "./assets/images/dice.svg";

const App = () => {
  return (
    <>
      <div className="flex justify-center items-center my-7">
        <h1 className="text-4xl font-bold">Druk Kongen</h1>
      </div>
      <div className="flex flex-col gap-10">
        <div className="flex flex-row justify-center gap-10">
          <Link to={"/dices"} className="inline-block">
            <div className="bg-red-500 rounded w-32 h-32 flex flex-col justify-center items-center">
              <img src={DiceIcon} height={75} width={75} />
              <span className="text-xl text-white">Terninger</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default App;
