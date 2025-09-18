import React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import css from "./Start.module.css";
import { resetPlayer, resetGame } from "../../store/actions";
import { useLoadGame } from "../../hooks";

const Start = ({ onStart }) => {
  const dispatch = useDispatch();
  const hasSaveData = useLoadGame();
  const newGame = () => {
    dispatch(resetPlayer());
    dispatch(resetGame());
    onStart();
  };
  return (
    <section className={css.Start}>
      <div className={css.CenteredContent}>
        <div className={css.Title}>ITI Technician Helpdesk Ticket Simulator: Turn It Off and On Again</div>
        <div className={css.Controls}>
          <button className={css.StartButton} onClick={newGame}>Start</button>
          {hasSaveData && <button className={css.LoadButton} onClick={() => onStart()}>Load Game</button>}
        </div>
      </div>
    </section>
  );
};

Start.propTypes = {
  onStart: PropTypes.func.isRequired,
};

export default Start;
