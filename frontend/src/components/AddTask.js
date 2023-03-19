import { useState, useEffect } from 'react';
import { Modal, Input, Button, Tooltip } from 'react-daisyui';
import { Info } from 'react-feather';
import { useLayoutState, useLayoutDispatch } from '../contexts/LayoutContext';
import { useTaskDispatch } from '../contexts/TaskContext';
import { addTask } from '../services/api';
import Datepicker from "react-tailwindcss-datepicker"; 
import dayjs from 'dayjs';

const AddTask = () => {
  const defaultLatestDate = { 
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  };

  const [errMsg, setErrMsg] = useState();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [expectDays, setExpectDays] = useState('');
  const [latestDate, setLatestDate] = useState(defaultLatestDate);
  const [isLoading, setIsLoading] = useState(false);

  const { isShowAddTaskModal } = useLayoutState();
  const layoutDispatch = useLayoutDispatch();
  const taskDispatch = useTaskDispatch();

  const handleAddTask = async () => {
    try {
      setIsLoading(true);
      const { data: task, status } = await addTask({ name, description, expected_days: expectDays, latest_date: latestDate.startDate });
      if (status === 201) {
        taskDispatch({ 
          type: 'ADD_TASK', 
          value: task
        });
      } else {
        setErrMsg('Something wrong, please try again later');
      }
      setIsLoading(false);
      layoutDispatch({ type: 'HIDE_ADD_LAST_ITEM' });
    } catch (err) {
      console.error(err);
      setErrMsg('Internal server error, please try again later');
      setIsLoading(false);
    }
  };

  const handleLastestDateChange = (newLastestDate) => {
    setLatestDate(newLastestDate); 
  };

  useEffect(() => {
    if (!isShowAddTaskModal) {
      setName('');
      setDescription('');
      setExpectDays('');
      setLatestDate(defaultLatestDate);
      setErrMsg('');
      setIsLoading(false);
    }
  }, [isShowAddTaskModal]);

  return (
    <Modal className="text-black space-y-5 overflow-visible" open={isShowAddTaskModal}>
      <Modal.Header className="font-bold mb-4">
        <h3 className="font-semibold text-2xl text-gray-800">Add new item</h3>
        <p className="text-gray-400 text-sm">Create a job with the last time you did it, I will help to you measure it</p>
        <label className="btn btn-outline btn-sm btn-circle absolute right-5 top-5" onClick={() => layoutDispatch({ type: 'HIDE_ADD_LAST_ITEM' })}>✕</label>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 tracking-wide flex items-center">Task name <Tooltip message="Name your task, task is whatever you already did and you want me to remind you about that task after expected days" position="right"><Info className="ml-2" size={16} /></Tooltip></label> 
            <Input color="ghost" bordered className="w-full content-center text-base px-4 py-2 rounded-lg" placeholder="Enter item name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 tracking-wide flex items-center">Task description <Tooltip message="You can add more information about your task" position="right"><Info className="ml-2" size={16} /></Tooltip></label> 
            <Input color="ghost" bordered className="w-full content-center text-base px-4 py-2 rounded-lg" placeholder="Enter item name" value={description} onChange={(e) => setDescription(e.target.value)} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 tracking-wide  flex items-center">Expected days <Tooltip message="After expected days has passed, I will remind you" position="right"><Info className="ml-2" size={16} /></Tooltip></label>
            <Input color="ghost" bordered className="w-full content-center text-base px-4 py-2 rounded-lg" placeholder="Enter expect days" value={expectDays} onChange={(e) => setExpectDays(e.target.value)} disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 tracking-wide  flex items-center">Latest date <Tooltip message="The day that is the last time you did it" position="right"><Info className="ml-2" size={16} /></Tooltip></label>
            {/* <Input color="ghost" bordered className="w-full content-center text-base px-4 py-2 rounded-lg" placeholder="Enter expect days" value={expectDays} onChange={(e) => setExpectDays(e.target.value)} /> */}
            <Datepicker
              inputClassName="input w-full content-center text-base px-4 py-2 rounded-lg input-ghost focus:outline-offset-0 input-bordered"
              asSingle={true} 
              value={latestDate}
              disabled={isLoading}
              onChange={handleLastestDateChange} 
            /> 
          </div>
          {errMsg && (<div className="space-y-2">
            <div className="text-error">
              <div className="flex">
                <div className="py-1"><svg className="fill-current h-4 w-4 text-error mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                <div>
                  <p className="text-md">{errMsg}</p>
                </div>
              </div>
            </div>
          </div>)}
          <div className="space-y-2">
            <Button color="primary" type="submit" shape="circle" fullWidth onClick={() => handleAddTask()} loading={isLoading} disabled={isLoading}>
              Add
            </Button>
          </div>
        </div>
        
      </Modal.Body>
    </Modal>
  )
}

export default AddTask