import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import css from "./Setup.module.css";
import * as actions from "../../store/actions";
import { STAGES } from "../../shared/config";
import Contract from "./contract/Contract";
import Text from "./text/Text";

export const Setup = ({ username, manager, onSetStage }) => {
  const [step, setStep] = useState(0);
  let content = null;
  switch (step) {
    case 0:
      content = (
        <>
          <p className={css.Speaker}>HR: Ashley</p>
          <p>Welcome to your first day at ITI!</p>
          <p>You will be reporting to Robert. He might seem tough, but he is really sweet as a gumdrop. Also really obsessed with Soap Operas and someone named Gary who was on it.</p>
          <Contract css={css} onSuccess={() => onSetStage(STAGES.tutorial)} />
        </>
      );
      break;
    case 1:
      content = (
        <>
          <p className={css.Speaker}>{manager}:</p>
          <Text {...{ step, username, manager }} />
          <button onClick={() => onSetStage(STAGES.tutorial)}>Training</button>
          <button onClick={() => setStep(2)}>Quick Start</button>
        </>
      );
      break;
    case 2:
      content = (
        <>
          <p className={css.Speaker}>{manager}:</p>
          <Text {...{ step, username, manager }} />
          <button onClick={() => onSetStage(STAGES.helpdesk)}>Let's Go!</button>
        </>
      );
      break;
    default:
      break;
  }
  return (
    <section className={css.Setup}>
      <h1>ITI Technician Helpdesk Ticket Simulator</h1>
      {content}
    </section>
  );
};

Setup.propTypes = {
  username: PropTypes.string,
  manager: PropTypes.string,
  onSetStage: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  username: state.player.username,
  manager: state.player.manager,
});

export const mapDispatchToProps = (dispatch) => ({
  onSetStage: (stage) => dispatch(actions.setStage(stage)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Setup);
