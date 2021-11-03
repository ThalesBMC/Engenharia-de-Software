import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  useMemo,
} from "react";

export const RankingContext = createContext();
let teste = [];
let testeFinal = 0;
export const RankingContextProvider = ({ children }) => {
  const [valor, setValue] = useState(2);
  const [valorMax, setValueMax] = useState(0);

  return (
    <RankingContext.Provider
      value={{
        valor,
        setValue,
        valorMax,
        setValueMax,
      }}
    >
      {children}
    </RankingContext.Provider>
  );
};
