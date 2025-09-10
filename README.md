const initialState = {
  theme: "",
  showNav: false,
};

const ThemeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "THEME_CHANGE": {
      return {
        ...state,
        theme: action.themeValue,
      };
    }
    case "Nav_CHANGE": {
      return {
        ...state,
        showNav: action.navValue,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

export default ThemeReducer;


import { createStore, combineReducers } from "redux";
import filterReducer from "../reducers/filter.reducer";
import FilteraTwoReducer from "../reducers/filterTwo.reducer";
import ThemeReducer from "../reducers/theme.reducer";

const rootReducer = combineReducers({
  calender: filterReducer,
  filterTwo: FilteraTwoReducer,
  themeState: ThemeReducer,
});
export const store = createStore(rootReducer);
