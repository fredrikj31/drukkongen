import { Link } from "react-router-dom";

export const DicesPage = () => {
  return (
    <>
      <h1>Dices :)</h1>
      <Link to={"/"} className="bg-red-500">
        Home
      </Link>
    </>
  );
};
