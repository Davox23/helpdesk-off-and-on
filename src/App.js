import React, { useState } from "react";

import css from "./App.module.css";
import { Menu, Game, Start } from "./containers";

const App = () => {
  const [isStart, setIsStart] = useState(true);

  return (
    <>
      {!isStart && <Menu />}
      <main className={isStart ? css.MainFull : css.Main}>
        {isStart ? <Start onStart={() => setIsStart(false)} /> : <Game />}
      </main>
    </>
  );
};

export default App;
