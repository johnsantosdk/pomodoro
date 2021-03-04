import React, { useEffect, useState, useCallback } from "react";
import { useInterval } from "./../hooks/use-interval";
import { secondsToTime } from "../utils";
import { Button } from "./button";
import { Timer } from "./timer";
// Audio files
import soundGunStart from "../sounds/43562523_gun-cocking-and-firing-02.mp3";
import soundGunFinish from "../sounds/39572342_shotgun-empty-bullet-shell-falling-01.mp3";

const audioStartWorking = new Audio(soundGunStart);
const audioStoptWorking = new Audio(soundGunFinish);

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.pomodoroTime);
  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesQtdManager, setCyclesQtdManager] = useState(
    new Array(props.cycles - 1).fill(true)
  );
  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setFullWorkingTime] = useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

  useEffect(() => {
    if (working) document.body.classList.add("working");
    if (resting) document.body.classList.remove("working");

    if (mainTime > 0) return;

    if (working && cyclesQtdManager.length > 0) {
      configureRest(false);
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length <= 0) {
      configureRest(true);
      setCyclesQtdManager(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
    if (resting) configureWork();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.cycles,
    working,
    resting,
    mainTime,
    cyclesQtdManager,
    setCyclesQtdManager,
    completedCycles,
    numberOfPomodoros,
  ]);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (working) setFullWorkingTime(fullWorkingTime + 1)
    },
    timeCounting ? 1000 : null
  );

  const configureWork = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTime);
    audioStartWorking.play();
  }, [
    props.pomodoroTime,
    setTimeCounting,
    setWorking,
    setResting,
    setMainTime,
  ]);

  const configureRest = useCallback(
    (long: boolean) => {
      setTimeCounting(true);
      setWorking(false);
      setResting(true);

      if (long) {
        setMainTime(props.longRestTime);
      } else {
        setMainTime(props.shortRestTime);
      }
      audioStoptWorking.play();
    },
    [
      props.longRestTime,
      props.shortRestTime,
      setTimeCounting,
      setWorking,
      setResting,
      setMainTime,
    ]
  );

  return (
    <div className="pomodoro">
      <h2>You are <strong>{ working ? 'Working' : 'Resting' }</strong></h2>
      <Timer mainTime={mainTime} />
      <div className="btn-group controls">
        <Button
          text="Start"
          onClick={() => configureWork()}
          className="btn btn-primary"
        />
        <Button
          text="Rest"
          onClick={() => configureRest(false)}
          className="btn btn-warning"
        />
        <Button
          text={timeCounting ? "Pause" : "Play"}
          onClick={() => setTimeCounting(!timeCounting)}
          className={!working && !resting ? "hidden" : "btn btn-secondary"}
        />
      </div>
      <div className="details">
        <p>Completed Cycles: {completedCycles}</p>
        <p>Time worked: {secondsToTime(fullWorkingTime)}</p>
        <p>Completed pomodors: {numberOfPomodoros}</p>
      </div>
    </div>
  );
}
