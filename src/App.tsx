import React, {
  useState,
  useReducer,
  useCallback,
  createContext,
  useContext,
  Dispatch,
} from "react";
import "./App.css";

interface State {
  count: number;
  type: "increment" | "decrement";
  todos: Todo[];
}

interface Action {
  type: "add_todo" | "complete_task";
  dispatch: Dispatch<Action>;
  payload: any;
}

interface Todo {
  id: number;
  task: string;
}

const initialState = { todos: [] };
const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "add_todo":
      const newTodos = [...state.todos];
      newTodos.push({ id: state.todos.length + 1, task: action.payload });
      return {
        ...state,
        todos: newTodos,
      };
    case "complete_task":
      const filteredTodos = [...state.todos];
      filteredTodos.splice(action.payload, 1);
      return {
        ...state,
        todos: filteredTodos,
      };
    default:
      throw new Error();
  }
};

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
    </>
  );
};

const Todo = () => {
  // テキストインプット用のローカルステート
  const [input, updateInput] = useState("");
  // Reducerを呼び出す
  const [state, dispatch] = useReducer<any>(reducer, initialState);

  // テキストインプットを監視するHooks
  const onChangeInput = useCallback(
    (event) => {
      updateInput(event.target.value);
    },
    [updateInput]
  );

  // チェックボックスのイベント更新を監視するHooks
  const onCheckListItem = useCallback(
    (event) => {
      dispatch({ type: "complete_task", payload: event.target.name });
    },
    [dispatch]
  );

  // ローカルステートとDispatch関数を監視するHooks
  const addTodo = useCallback(() => {
    dispatch({ type: "add_todo", payload: input });
    updateInput("");
  }, [input, dispatch]);

  return (
    <>
      <input type="text" onChange={onChangeInput} value={input} />
      <button onClick={addTodo}>追加</button>
      <ul>
        {state.todos.map((todo: Todo, index: any) => (
          <li key={todo.id}>
            <input type="checkbox" onChange={onCheckListItem} name={index} />
            {todo.task}
          </li>
        ))}
      </ul>
    </>
  );
};

const UserContext = createContext({
  username: "guest",
  completedTask: 0,
  handleUpdateCompletedTask: () => {},
});

const App = () => {
  const [username, updateUsername] = useState("guest");

  const [completedTask, updateCompletedTask] = useState(0);

  const handleUpdateUsername = useCallback(
    (event) => {
      updateUsername(event.target.value);
    },
    [updateUsername]
  );

  const handleUpdateCompletedTask = useCallback(() => {
    updateCompletedTask(completedTask + 1);
  }, [completedTask, updateCompletedTask]);

  return (
    <UserContext.Provider
      value={{ username, completedTask, handleUpdateCompletedTask }}
    >
      <div>
        <span>username:</span>
        <input type="text" onChange={handleUpdateUsername} />
      </div>
      <Counter />
      <CompleteTaskView />
    </UserContext.Provider>
  );
};

const CompleteTaskView = () => {
  const { username, completedTask } = useContext(UserContext);
  return (
    <div>
      {username}さんは{completedTask}個タスクを完了しました
    </div>
  );
};

export default App;
