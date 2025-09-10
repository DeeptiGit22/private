// counter.reducer.js
const initialState = {
  counterAiReport: parseInt(localStorage.getItem("counterAiReport")) || 0,
  counterApiInteraction: parseInt(localStorage.getItem("counterApiInteraction")) || 0,
};

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "INCREMENT_AI_REPORT": {
      const newValue = state.counterAiReport + 1;
      localStorage.setItem("counterAiReport", newValue);
      return { ...state, counterAiReport: newValue };
    }

    case "INCREMENT_API_INTERACTION": {
      const newValue = state.counterApiInteraction + 1;
      localStorage.setItem("counterApiInteraction", newValue);
      return { ...state, counterApiInteraction: newValue };
    }

    default:
      return state;
  }
};


// store.js
import { createStore, combineReducers } from "redux";
import filterReducer from "../reducers/filter.reducer";
import FilteraTwoReducer from "../reducers/filterTwo.reducer";
import ThemeReducer from "../reducers/theme.reducer";
import counterReducer from "../reducers/counter.reducer";

const rootReducer = combineReducers({
  calender: filterReducer,
  filterTwo: FilteraTwoReducer,
  themeState: ThemeReducer,
  counterState: counterReducer, // ✅ added here
});

export const store = createStore(rootReducer);



export default counterReducer;
