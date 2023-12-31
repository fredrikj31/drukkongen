import { Link } from "react-router-dom";
import rightArrow from "../assets/images/arrow.svg";

interface HeaderProps {
  text: string;
}

export const Header = ({ text }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex-1">
        <Link to={"/"} className="inline-block ml-5 my-5">
          <div className="flex justify-center items-center bg-red-500 rounded-full h-10 w-10">
            <img src={rightArrow} height={20} width={20} />
          </div>
        </Link>
      </div>
      <div className="text-4xl font-bold">{text}</div>
      <div className="flex-1"></div>
    </div>
  );
};
