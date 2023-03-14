import { useEffect } from 'react';
import { useLayoutDispatch, useLayoutState } from '../contexts/LayoutContext';
import { Plus, Box } from 'react-feather';
import { getTasks, info } from '../services/api';
import AddTask from '../components/AddTask';
import { useTaskDispatch, useTaskState } from '../contexts/TaskContext';
import Task from '../components/Task';

const Homepage = () => {
  const layoutDispatch = useLayoutDispatch();
  const taskDispatch = useTaskDispatch();
  const { tasks } = useTaskState();
  const { isAuth } = useLayoutState();
  
  async function initializeApp() {
    const { data: user } = await info();
    if (user.id) {
      layoutDispatch({ type: 'LOGGED_IN' });
    }
  }

  async function initializeTasks() {
    const { data: initialTasks } = await getTasks();
    taskDispatch({ type: 'UPDATE_TASKS', value: initialTasks });
  }

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (isAuth) {
      initializeTasks();
    }
  }, [isAuth]);

  return (
    <div className="m-5 space-y-5">
      <div className="flex justify-end">
        <button className="btn btn-ghost btn-outline mr-2">
          <Box />
          <span className="pl-2">Integration</span>
        </button>
        <button className="btn btn-ghost btn-outline" onClick={() => layoutDispatch({ type: 'SHOW_ADD_TASK' })}>
          <Plus />
          <span className="pl-2">Add</span>
        </button>
      </div>
      {/* Content */}
      <div className="flex flex-wrap gap-5">
        {tasks.map((task) => (
          <Task key={task._id} task={task} />
        ))}
      </div>
      {/* Modals */}
      <AddTask />
    </div>
  )
}

export default Homepage