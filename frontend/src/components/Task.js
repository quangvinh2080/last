import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Card, Button, Countdown } from 'react-daisyui';
import ConfirmDeleteTask from '../components/ConfirmDeleteTask';
import ConfirmRenewTask from '../components/ConfirmRenewTask';
import UpdateTask from '../components/UpdateTask';

const Task = ({ task }) => {
  const dayjsLatestDate = dayjs(task.latest_date, 'YYYY-MM-DD');
  const dayjsExpectedDate = (dayjsLatestDate.add(task.expected_days, 'day'));
  const duration = dayjs.duration(dayjsExpectedDate.diff(dayjs()));

  const [years, setYears] = useState(duration.years());
  const [months, setMonths] = useState(duration.months());
  const [days, setDays] = useState(duration.days());
  const [hours, setHours] = useState(duration.hours());
  const [mins, setMins] = useState(duration.minutes());
  const [secs, setSecs] = useState(duration.seconds());
  const [isShowConfirmDeleteTask, setIsShowConfirmDeleteTask] = useState(false);
  const [isShowConfirmRenewTask, setIsShowConfirmRenewTask] = useState(false);
  const [isShowConfirmUpdateTask, setIsShowConfirmUpdateTask] = useState(false);

  const setDuration = (dayjsExpectedDate) => {
    const duration = dayjs.duration(dayjsExpectedDate.diff(dayjs()));
    setYears(duration.years() > 0 ? duration.years() : undefined);
    setMonths(duration.months());
    setDays(duration.days());
    setHours(duration.hours());
    setMins(duration.minutes());
    setSecs(duration.seconds());
  };

  useEffect(() => {
    setDuration(dayjsExpectedDate);
    const interval = setInterval(() => {
      setDuration(dayjsExpectedDate);
    }, 1000)
    return () => {
      clearInterval(interval);
    };
  }, [task.expected_days, task.latest_date]);

  return (
    <>
      <Card className="shadow-xl">
        <Card.Body className="text-left">
          <Card.Title tag="h2">{task.name}</Card.Title>
          <p>{task.description}</p>
          <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
            {years !== undefined ? (<div className="flex flex-col">
              <Countdown className="font-mono sm:text-xl md:text-4xl" value={years} />
              years
            </div>) : null}
            {months || years ? (<div className="flex flex-col">
              <Countdown className="font-mono sm:text-xl md:text-4xl" value={months} />
              months
            </div>) : null}
            <div className="flex flex-col">
              <Countdown className="font-mono sm:text-xl md:text-4xl" value={days} />
              days
            </div>
            <div className="flex flex-col">
              <Countdown className="font-mono sm:text-xl md:text-4xl" value={hours} />
              hours
            </div>
            <div className="flex flex-col">
              <Countdown className="font-mono sm:text-xl md:text-4xl" value={mins} />
              min
            </div>
            {years === undefined ? (<div className="flex flex-col">
              <Countdown className="font-mono sm:text-xl md:text-4xl" value={secs} />
              sec
            </div>) : null}
          </div>
          <Card.Actions>
            <Button color="primary" onClick={() => setIsShowConfirmRenewTask(true)}>Renew</Button>
            <Button color="info" onClick={() => setIsShowConfirmUpdateTask(true)}>Update</Button>
            <Button color="error" onClick={() => setIsShowConfirmDeleteTask(true)}>Delete</Button>
          </Card.Actions>
        </Card.Body>
      </Card>
      {/* Modals */}
      <ConfirmDeleteTask task={task} open={isShowConfirmDeleteTask} onClose={()  => setIsShowConfirmDeleteTask(false)} />
      <ConfirmRenewTask task={task} open={isShowConfirmRenewTask} onClose={()  => setIsShowConfirmRenewTask(false)} />
      <UpdateTask task={task} open={isShowConfirmUpdateTask} onClose={()  => setIsShowConfirmUpdateTask(false)} />
    </>
  )
}

export default Task