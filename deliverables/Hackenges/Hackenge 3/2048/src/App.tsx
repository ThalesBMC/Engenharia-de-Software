import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  useContext,
} from "react";
import { Button } from "./components/Button";
import { Game } from "./components/Game";
import {
  GameReducer,
  initialState,
} from "./components/Game/hooks/useGame/reducer";
import "./App.less";
import { RankingContext } from "./context/RankingContext";
import Cookies from "js-cookie";
export const App = () => {
  const { valor, setValueMax, valorMax, setValue } = useContext(RankingContext);
  const [date, setDate] = useState<Date>(new Date());
  const [state, dispatch] = useReducer(GameReducer, initialState);
  const handleRestart = () => {
    setValue(2);
    if (valor > valorMax) {
      setValueMax(valor);
    }

    setDate(new Date());
  };
  useEffect(() => {
    var cookiesInicial = Cookies.get("ranking");
    console.log(cookiesInicial);
  }, []);
  useEffect(() => {
    var cookiesValue = Cookies.get("ranking");
    if (cookiesValue) {
      console.log(JSON.parse(cookiesValue));
    }

    Cookies.set("ranking", JSON.stringify(valor), { expires: 365 });
  }, [valor]);
  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            color: "#303030",
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
          Pontuação Atual
        </div>
        <div
          style={{
            color: "#303030",
            fontSize: "30px",
            marginLeft: "20px",
            fontWeight: "bold",
          }}
        >
          {valor}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            color: "#303030",
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
          Pontuação Máxima
        </div>
        <div
          style={{
            color: "#303030",
            fontSize: "30px",
            marginLeft: "20px",
            fontWeight: "bold",
          }}
        >
          {valorMax}
        </div>
      </div>
      <Game key={date.toISOString()} />
      <div style={{ marginTop: "30px", marginLeft: "170px" }}>
        <Button onClick={handleRestart}>Restart</Button>
      </div>
    </div>
  );
};
