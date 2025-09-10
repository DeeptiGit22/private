// actions/counter.actions.js
export const incrementAiReport = () => ({ type: "INCREMENT_AI_REPORT" });
export const incrementApiInteraction = () => ({ type: "INCREMENT_API_INTERACTION" });



import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { incrementAiReport, incrementApiInteraction } from "../actions/counter.actions";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { counterAiReport, counterApiInteraction } = useSelector(
    (state) => state.counterState
  );

  return (
    <div>
      <h2>AI Reports: {counterAiReport}</h2>
      <h2>API Interactions: {counterApiInteraction}</h2>

      <button onClick={() => dispatch(incrementAiReport())}>+ AI Report</button>
      <button onClick={() => dispatch(incrementApiInteraction())}>
        + API Interaction
      </button>
    </div>
  );
};

export default Dashboard;
