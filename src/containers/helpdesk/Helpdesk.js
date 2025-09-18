import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import css from "./Helpdesk.module.css";
import * as actions from "../../store/actions";
import { useOpenTicket, useOptions } from "../../hooks";
import { STAGES, DAY_LENGTH } from "../../shared/config";
import { IssueTray } from "../../components";

export const Helpdesk = (props) => {



  const {
    skills,
    charisma,
    chanceDisaster,
    openTickets,
    selectedTicket,
    message,
    onAddExperience,
    onSelectTicket,
    onCloseTicket,
    onFailTicket,
    onDisaster,
    onFailAllOpen,
    onEndDay,
  } = props;

  // Ticket queue state
  const [usedTicketIds, setUsedTicketIds] = React.useState([]);
  const [queue, setQueue] = React.useState([]);
  // Removed timeLeft and gameEnded state

  // Load all tickets
  const { TICKETS } = require("../../store/data/tickets.js");

  // Add a new ticket every 5 seconds or after completion
  useEffect(() => {
    if (usedTicketIds.length >= TICKETS.length) return;
    const interval = setInterval(() => {
      addNextTicket();
    }, 10000);
    return () => clearInterval(interval);
  }, [usedTicketIds]);

  // Removed game end and timer logic

  // Add next unused ticket to queue
  const addNextTicket = () => {
    if (usedTicketIds.length >= TICKETS.length) return;
    const unused = TICKETS.filter((t) => !usedTicketIds.includes(t.id));
    if (unused.length === 0) return;
    const next = unused[0];
    setQueue((q) => [...q, next]);
    setUsedTicketIds((ids) => [...ids, next.id]);
  };

  // When a ticket is completed, add next ticket immediately
  useEffect(() => {
    if (queue.length === 0 && usedTicketIds.length < TICKETS.length) {
      addNextTicket();
    }
  }, [queue, usedTicketIds]);

  // Option buttons logic
  let optionBtns = null;
  if (selectedTicket) {
    const skill = skills[selectedTicket.issueType];
    optionBtns = (
      <div className={css.OptionBtns}>
        {selectedTicket.answers.map((opt, index) => (
          <button
            key={index}
            onClick={() => {
              if (opt.correct) {
                onAddExperience(selectedTicket.experience);
                onCloseTicket(selectedTicket);
                setQueue((q) => q.filter((t) => t.id !== selectedTicket.id));
              } else {
                const halfExp = Math.floor(selectedTicket.experience / 2);
                onAddExperience(halfExp);
                onFailTicket(selectedTicket, charisma);
                setQueue((q) => q.filter((t) => t.id !== selectedTicket.id));
              }
            }}
          >
            {opt.text}
          </button>
        ))}
      </div>
    );
  }

  // Render
  return (
    <>
      <IssueTray
        tickets={queue}
        isEnabled
        selectedTicket={selectedTicket}
        onClick={onSelectTicket}
      />
      <section className={css.Controls}>
        <h3>Options</h3>
        {optionBtns ? optionBtns : message && <p>{message}</p>}
      </section>
    </>
  );
};

Helpdesk.propTypes = {
  skills: PropTypes.object.isRequired,
  charisma: PropTypes.number.isRequired,
  chanceDisaster: PropTypes.number.isRequired,
  openTickets: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.number.isRequired,
      customer: PropTypes.string.isRequired,
      issueType: PropTypes.string.isRequired,
      issue: PropTypes.string.isRequired,
      experience: PropTypes.number.isRequired,
  // patience removed
    })
  ).isRequired,
  selectedTicket: PropTypes.exact({
    id: PropTypes.number.isRequired,
    customer: PropTypes.string.isRequired,
    issueType: PropTypes.string.isRequired,
    issue: PropTypes.string.isRequired,
    experience: PropTypes.number.isRequired,
  // patience removed
  }),
  message: PropTypes.string,
  onAddExperience: PropTypes.func.isRequired,
  onSelectTicket: PropTypes.func.isRequired,
  onCloseTicket: PropTypes.func.isRequired,
  onFailTicket: PropTypes.func.isRequired,
  onDisaster: PropTypes.func.isRequired,
  onFailAllOpen: PropTypes.func.isRequired,
  onEndDay: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => {
  return {
    skills: state.player.skills,
    charisma: state.player.charisma,
    chanceDisaster: state.player.chanceDisaster,
    openTickets: state.game.openTickets,
    selectedTicket: state.game.selectedTicket,
    message: state.game.message,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    onAddExperience: (experience) =>
      dispatch(actions.addExperience(experience)),
    onSelectTicket: (ticket) => dispatch(actions.setSelectedTicket(ticket)),
    onCloseTicket: (ticket) => dispatch(actions.closeTicket(ticket)),
    onFailTicket: (ticket, charisma) =>
      dispatch(actions.failTicket(ticket, charisma)),
    onDisaster: (ticket) => dispatch(actions.disasterTicket(ticket)),
    onFailAllOpen: () => dispatch(actions.failAllOpenTickets()),
    onEndDay: () => dispatch(actions.setStage(STAGES.review)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Helpdesk);
