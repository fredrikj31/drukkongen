import { Link } from "react-router-dom";

const App = () => {
  return (
    <>
      <h1>Hello World</h1>
      <Link to={"/dices"} className="bg-red-500">
        Dices
      </Link>
    </>
  );
};

export default App;
