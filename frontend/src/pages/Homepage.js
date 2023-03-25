import { useEffect } from 'react';
import { useLayoutDispatch, useLayoutState } from '../contexts/LayoutContext';
import { Plus, Box } from 'react-feather';
import { useUser, useTasks } from '../hooks/swr';
import { useTaskDispatch, useTaskState } from '../contexts/TaskContext';
import { getRemainingDays } from '../services/utils';
import Task from '../components/Task';
import AddTask from '../components/AddTask';
import GoogleSheetsIntegration from '../components/GoogleSheetsIntegration';

const Homepage = () => {
  const layoutDispatch = useLayoutDispatch();
  const taskDispatch = useTaskDispatch();
  const { tasks } = useTaskState();
  const { isAuth } = useLayoutState();
  const { data: fetchedTasks } = useTasks();
  const { data: user } = useUser();

  async function initializeApp() {
    if (user?.id) {
      layoutDispatch({ type: 'LOGGED_IN' });
    }
  }

  async function initializeTasks() {
    taskDispatch({ type: 'UPDATE_TASKS', value: fetchedTasks });
  }

  useEffect(() => {
    initializeApp();
  }, [user]);

  useEffect(() => {
    if (isAuth && fetchedTasks?.length) {
      initializeTasks();
    }
  }, [isAuth, fetchedTasks]);

return (
    <div className="m-5 space-y-5">
      {isAuth && (
        <div className="flex justify-end">
          <button className="btn btn-ghost btn-outline mr-2" onClick={() => layoutDispatch({ type: 'SHOW_INTEGRATION' })}>
            <Box />
            <span className="pl-2">Integration</span>
          </button>
          <button className="btn btn-ghost btn-outline" onClick={() => layoutDispatch({ type: 'SHOW_ADD_TASK' })}>
            <Plus />
            <span className="pl-2">Add</span>
          </button>
        </div>
      )}
      {/* Content */}
      <div className="flex flex-wrap gap-5">
        {tasks.sort((task1, task2) => {
          return getRemainingDays(task1) - getRemainingDays(task2);
        }).map((task) => (
          <Task key={task._id} task={task} />
        ))}
      </div>
      {/* Modals */}
      <AddTask />
      <GoogleSheetsIntegration />
    </div>
  )
}

export default Homepage