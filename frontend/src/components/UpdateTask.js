import { useState, useEffect } from 'react';
import Datepicker from "react-tailwindcss-datepicker"; 
import { Modal, Input, Button, Tooltip, InputGroup } from 'react-daisyui';
import { Info } from 'react-feather';
import { useForm } from "react-hook-form";
import { useTaskDispatch } from '../contexts/TaskContext';
import { updateTask } from '../services/api';
import { getFormDatepicker, getFormDatepickerWithExpectedDays, getDaysBetween } from '../services/utils';

const UpdateTask = ({ task, open, onClose }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: task.name,
      description: task.description,
      expected_days: task.expected_days,
      latest_date: task.latest_date,
    }
  });

  const expectedDays = watch("expected_days");

  const [errMsg, setErrMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [latestDate, setLatestDate] = useState(getFormDatepicker(task.latest_date));
  const [expectedDate, setExpectedDate] = useState(getFormDatepickerWithExpectedDays(latestDate.startDate, expectedDays));

  const taskDispatch = useTaskDispatch();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const { data: newTask, status } = await updateTask(task._id, data);
      if (status === 200) {
        taskDispatch({ 
          type: 'UPDATE_TASK', 
          value: newTask
        });
      } else {
        setErrMsg('Something wrong, please try again later');
      }
      
      onClose();
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setErrMsg('Internal server error, please try again later');
      setIsLoading(false);
    }
  };

  const handleLastestDateChange = (newLastestDate) => {
    setLatestDate(newLastestDate); 
  };

  const handleExpectDateChange = (newExpectedDate) => {
    setExpectedDate(newExpectedDate); 
  };

  useEffect(() => {
    setExpectedDate(getFormDatepickerWithExpectedDays(latestDate.startDate, expectedDays));
  }, [expectedDays]);

  useEffect(() => {
    const days = getDaysBetween(latestDate.startDate, expectedDate.startDate);
    if (+expectedDays !== +days) {
      setValue('expected_days', +days);
    }
  }, [expectedDate]);

  useEffect(() => {
    setValue('latest_date', latestDate.startDate);
    setExpectedDate(getFormDatepickerWithExpectedDays(latestDate.startDate, expectedDays));
  }, [latestDate]);

  return (
    <Modal className="text-black space-y-5 overflow-visible" open={open}>
      <Modal.Header className="font-bold mb-4">
        <h3 className="font-semibold text-2xl text-gray-800">Update task</h3>
        <p className="text-gray-400 text-sm">Update your task</p>
        <label className="btn btn-outline btn-sm btn-circle absolute right-5 top-5" onClick={() => onClose()}>✕</label>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 tracking-wide flex items-center">Task name <Tooltip message="Name your task, task is whatever you already did and you want me to remind you about that task after expected days" position="right"><Info className="ml-2" size={16} /></Tooltip></label> 
              <Input color="ghost" bordered className="w-full content-center text-base px-4 py-2 rounded-lg" placeholder="Enter item name" {...register("name", { required: { value: true, message: "This field is required" } })} disabled={isLoading} />
              {errors?.name && (<div><span className="text-error text-sm">{errors.name.message}</span></div>)}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 tracking-wide flex items-center">Task description <Tooltip message="You can add more information about your task" position="right"><Info className="ml-2" size={16} /></Tooltip></label> 
              <Input color="ghost" bordered className="w-full content-center text-base px-4 py-2 rounded-lg" placeholder="Enter item name" {...register("description")} disabled={isLoading} />
              {errors?.description && (<div><span className="text-error text-sm">{errors.description.message}</span></div>)}
            </div>
            <div className="space-y-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 tracking-wide flex items-center">Expected date<Tooltip message="By that date, I will remind you" position="right"><Info className="ml-2" size={16} /></Tooltip></label>
              <div className="flex">
                <div className="flex-1">
                  <InputGroup>
                    <Input color="ghost" type="number" bordered className="w-full content-center text-base px-4 py-2 rounded-lg" placeholder="Enter expect days" {...register("expected_days", { required: { value: true, message: "This field is required" }, min: 1 })} disabled={isLoading} />
                    <span>days</span>
                  </InputGroup>
                </div>
                <div className="flex items-center justify-center pl-2 pr-2">
                  or
                </div>
                <div className="flex flex-1">
                  <Datepicker
                    inputClassName="input w-full content-center text-base px-4 py-2 rounded-lg input-ghost focus:outline-offset-0 input-bordered"
                    asSingle={true} 
                    value={expectedDate}
                    disabled={isLoading} 
                    onChange={handleExpectDateChange} 
                  /> 
                </div>
              </div>
              {errors?.expected_days && (<div><span className="text-error text-sm">{errors.expected_days.message}</span></div>)}
            </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 tracking-wide  flex items-center">Latest date <Tooltip message="The day that is the last time you did it" position="right"><Info className="ml-2" size={16} /></Tooltip></label>
              <Datepicker
                inputClassName="input w-full content-center text-base px-4 py-2 rounded-lg input-ghost focus:outline-offset-0 input-bordered"
                asSingle={true} 
                value={latestDate}
                disabled={isLoading}
                onChange={handleLastestDateChange} 
              /> 
              <Input {...register('latest_date', { required: { value: true, message: 'This field is required' }})} className="hidden" />
              {errors?.latest_date && (<div><span className="text-error text-sm">{errors.latest_date.message}</span></div>)}
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
              <Button color="primary" type="submit" shape="circle" fullWidth disabled={isLoading} loading={isLoading}>
                Update
              </Button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default UpdateTask