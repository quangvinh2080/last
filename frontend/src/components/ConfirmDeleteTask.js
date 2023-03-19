import { useState } from 'react';
import { Modal, Button, ButtonGroup } from 'react-daisyui';
import { useTaskDispatch } from '../contexts/TaskContext';
import { deleteTask } from '../services/api';

const ConfirmDeleteTask = ({ task, open, onClose }) => {
  const [errMsg, setErrMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const taskDispatch = useTaskDispatch();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const { status } = await deleteTask(task._id);
      if (status === 204) {
        taskDispatch({ type: 'REMOVE_TASK', value: task });
        onClose();
      } else {
        setErrMsg('Something wrong, please try again later');
      }
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setErrMsg('Internal server error, please try again later');
      setIsLoading(false);
    }
  };
  return (
    <Modal className="text-black space-y-5" open={open}>
      <Modal.Header className="font-bold mb-4">
        <h3 className="font-semibold text-2xl text-gray-800">Delete {task.name}</h3>
        <p className="text-gray-500">Are you sure to delete the task {task.name} ?</p>
        <label className="btn btn-outline btn-sm btn-circle absolute right-5 top-5" onClick={() => onClose()}>✕</label>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-5">
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
          <div className="space-y-2 text-right">
            <ButtonGroup>
              <Button className="w-20" type="submit" active onClick={() => handleDelete()} loading={isLoading} disabled={isLoading}>
                Yes
              </Button>
              <Button className="w-20" type="submit" onClick={() => onClose()} disabled={isLoading}>
                No
              </Button>
            </ButtonGroup>
            
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ConfirmDeleteTask