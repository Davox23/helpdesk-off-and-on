import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utilities";

import { DISASTERS } from "../data";
import { STAGES } from "../../shared/config";

const initialState = {
  stage: STAGES.setup,
  day: 1,
  maxId: 0,
  closedTickets: [],
  failedTickets: [],
  openTickets: [],
  selectedTicket: null,
  message: null,
  yearData: {
    experience: 0,
    closedTickets: 0,
    failedTickets: 0,
    openTickets: 0,
  },
};

const closeTicket = (state, action) => {
  const ticket = action.ticket;
  const openTickets = state.openTickets.filter((t) => t.id !== ticket.id);
  const closedTickets = [...state.closedTickets, ticket];

  const selectedTicket =
    state.selectedTicket.id === ticket.id ? null : state.selectedTicket;
  const message = `Success! You gained ${ticket.experience} experience points.`;

  const yearData = updateObject(state.yearData, {
    experience: state.yearData.experience + ticket.experience,
    closedTickets: state.yearData.closedTickets + 1,
  });
  return updateObject(state, {
    openTickets,
    closedTickets,
    selectedTicket,
    message,
    yearData,
  });
};

const openTicket = (state, action) => {
  const maxId = state.maxId + 1;
  const ticket = { ...action.ticket, id: maxId };
  const openTickets = [...state.openTickets, ticket];

  const yearData = updateObject(state.yearData, {
    openTickets: state.yearData.openTickets + 1,
  });
  return updateObject(state, { openTickets, maxId, yearData });
};

const failTicket = (state, action) => {
  // Patience logic removed. Always fail ticket and award half experience.
  const openTickets = state.openTickets.filter((t) => t.id !== action.ticket.id);
  const failedTickets = [...state.failedTickets, action.ticket];
  const halfExp = Math.floor(action.ticket.experience / 2);
  const message = `Failed to solve ${action.ticket.issueType} issue. You gained ${halfExp} experience points. ${action.ticket.customer} lost patience.`;
  const yearData = updateObject(state.yearData, {
    experience: state.yearData.experience + halfExp,
    failedTickets: state.yearData.failedTickets + 1,
  });
  return updateObject(state, {
    openTickets,
    failedTickets,
    selectedTicket: null,
    message,
    yearData,
  });
};

const disaster = (state, action) => {
  const ticket = action.ticket;
  const openTickets = state.openTickets.filter((t) => t.id !== ticket.id);
  const failedTickets = [...state.failedTickets, ticket];
  const selectedTicket =
    state.selectedTicket.id === ticket.id ? null : state.selectedTicket;

  const relevantDisasters = DISASTERS[ticket.issueType];
  const disaster =
    relevantDisasters[Math.floor(Math.random() * relevantDisasters.length)];

  const message = `Disaster! You ${disaster}! ${ticket.customer} left in despair.`;

  return updateObject(state, {
    openTickets,
    failedTickets,
    selectedTicket,
    message,
  });
};

const failAllOpen = (state) => {
  const failedTickets = [...state.failedTickets, ...state.openTickets];
  const yearData = updateObject(state.yearData, {
    failedTickets: state.yearData.failedTickets + state.openTickets.length,
  });
  return updateObject(state, { failedTickets, openTickets: [], yearData });
};

const reset = (state) => {
  return updateObject(state, {
    maxId: 0,
    closedTickets: [],
    failedTickets: [],
    openTickets: [],
    selectedTicket: null,
    message: null,
    yearData: {
      experience: 0,
      closedTickets: 0,
      failedTickets: 0,
      openTickets: 0,
    },
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RESET_GAME:
      return initialState;
    case actionTypes.LOAD_GAME:
      return updateObject(state, {
        day: action.day,
        stage: action.stage,
        yearData: action.yearData,
      });
    case actionTypes.SET_STAGE:
      return updateObject(state, { stage: action.stage });
    case actionTypes.NEXT_DAY:
      return updateObject(state, { day: state.day + 1 });
    case actionTypes.SET_SELECTED_TICKET:
      return updateObject(state, { selectedTicket: action.ticket });
    case actionTypes.CLOSE_TICKET:
      return closeTicket(state, action);
    case actionTypes.OPEN_TICKET:
      return openTicket(state, action);
    case actionTypes.FAIL_TICKET:
      return failTicket(state, action);
    case actionTypes.DISASTER:
      return disaster(state, action);
    case actionTypes.FAIL_ALL_OPEN:
      return failAllOpen(state);
    case actionTypes.RESET_TICKETS:
      return reset(state);
    default:
      return state;
  }
};

export default reducer;
