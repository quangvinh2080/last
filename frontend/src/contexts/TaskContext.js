import { createContext, useContext, useReducer } from 'react';
import _ from 'lodash';

const TaskStateContext = createContext();
const TaskDispatchContext = createContext();

const initialState = {
  tasks: [],
};

function taskReducer(state, action) {
  switch (action.type) {
    case 'REMOVE_TASK':
      return {
        ...state,
        tasks: _.filter(state.tasks, task => task._id !== action.value._id),
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: _.map(state.tasks, task => {
          if (task._id === action.value._id) {
            task = action.value;
          }
          return task;
        }),
      };
    case 'UPDATE_TASKS':
      return {
        ...state,
        tasks: action.value,
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.value],
      };
    default:
      return state;
  }
}


function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  return (
    <TaskStateContext.Provider value={state}>
      <TaskDispatchContext.Provider value={dispatch}>
        {children}
      </TaskDispatchContext.Provider>
    </TaskStateContext.Provider>
  );
}

function useTaskState() {
  const context = useContext(TaskStateContext);
  if (context === undefined) {
    throw new Error('useTaskState must be used within a TaskProvider');
  }
  return context;
}

function useTaskDispatch() {
  const context = useContext(TaskDispatchContext);
  if (context === undefined) {
    throw new Error('useTaskDispatch must be used within a TaskProvider');
  }
  return context;
}

export {
  TaskProvider,
  useTaskState,
  useTaskDispatch,
};
