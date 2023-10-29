import { Link } from "react-router-dom";

interface TabProps {
  icon: string;
  text: string;
  url: string;
}

export const Tab = ({ icon, text, url }: TabProps) => {
  return (
    <Link to={url} className="inline-block">
      <div className="bg-red-500 rounded w-32 h-32 flex flex-col justify-center items-center">
        <img src={icon} height={75} width={75} />
        <span className="text-xl text-white">{text}</span>
      </div>
    </Link>
  );
};
