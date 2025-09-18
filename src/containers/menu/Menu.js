import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import css from "./Menu.module.css";

export const Menu = ({ player, totalTickets, failedTickets, completedTickets, stage }) => {
  // Flash color state for score
  const [scoreFlash, setScoreFlash] = React.useState(null);
  const prevScoreRef = React.useRef(totalTickets);

  React.useEffect(() => {
    if (stage !== "helpdesk") return; // Only during gameplay
    const prevScore = prevScoreRef.current;
    if (totalTickets > prevScore) {
      setScoreFlash('green');
      setTimeout(() => setScoreFlash(null), 500);
    } else if (totalTickets < prevScore) {
      setScoreFlash('red');
      setTimeout(() => setScoreFlash(null), 500);
    }
    prevScoreRef.current = totalTickets;
  }, [totalTickets, stage]);
  const { username, manager, skills } = player;
  const totalAttempts = completedTickets + failedTickets;
  const successfulPercent = totalAttempts > 0 ? Math.round((completedTickets / totalAttempts) * 100) : 0;
  const failedPercent = totalAttempts > 0 ? Math.round((failedTickets / totalAttempts) * 100) : 0;
  return (
    <nav className={css.Menu} tabIndex="0">
      <div className={css.MenuBar}>
        <div className={css.MenuButton}>
          <FontAwesomeIcon icon={faBars} />
        </div>
      </div>
      <header className={css.Header}>
        <div className={css.Avatar}>
          <FontAwesomeIcon icon={faUser} />
        </div>
        <h2>{username}</h2>
      </header>
      <ul>
        {stage === "helpdesk" && <>
          <li className={css.TotalTicketScore}>
            Total Ticket Score: <span style={{ transition: 'color 0.2s', color: scoreFlash === 'green' ? 'limegreen' : scoreFlash === 'red' ? 'red' : undefined }}>{totalTickets}</span>
          </li>
          <li>Manager: {manager}</li>
          <li>Failed Tickets: {failedPercent}%</li>
          <li>Successful Tickets: {successfulPercent}%</li>
          <li>Completed Tickets: {completedTickets}</li>
        </>}
      </ul>
    </nav>
  );
};

Menu.propTypes = {
  player: PropTypes.shape({
    username: PropTypes.string,
    manager: PropTypes.string,
    skills: PropTypes.object.isRequired,
  }).isRequired,
  totalTickets: PropTypes.number,
  failedTickets: PropTypes.number,
  completedTickets: PropTypes.number,
  stage: PropTypes.string,
};

export const mapStateToProps = (state) => {
  const totalTickets = state.game.yearData.experience;
  const failedTickets = state.game.failedTickets.length;
  const completedTickets = state.game.closedTickets.length + state.game.failedTickets.length;
  const stage = state.game.stage;
  return {
    player: state.player,
    totalTickets,
    failedTickets,
    completedTickets,
    stage,
  };
};

export default connect(mapStateToProps)(Menu);
