import React, { useState } from "react";
import ReactDOM from "react-dom";
import $ from 'jquery';
import { interval, Subject, fromEvent } from "rxjs";
import { takeUntil, repeatWhen, share, filter } from "rxjs/operators";
import './index.css'

const action$ = new Subject();
const stop$ = action$.pipe(filter(action => action === 'stop'));
const reset$ = action$.pipe(filter(action => action === 'reset'));

const observable$ = interval(1000)
  .pipe(share())
  .pipe(
  takeUntil(stop$),
  repeatWhen(() => reset$)
);

const App = () => {
  const [time, setTime] = useState(0);
  const [timeOn, setTimeOn] = useState(true);
 
  const startTime = () => {
    const start = $('#start');
    const startTime$ = fromEvent(start, 'click');

    startTime$.subscribe(() => observable$.subscribe(setTime));
  }

  const stop = () => {
    setTimeOn(true);
    setTime(0);
    action$.next('stop')
  };

  const reset = () => {
    setTimeOn(true);
    setTime(0);
    action$.next('stop')
    action$.next('reset')
  };

  const wait = () => {
    setTimeOn(!timeOn);
    if (!timeOn) {
      action$.next('stop')
    } 
  };

  return (
    <div className='container'>
      <div className='stopwatch'>
        <span>{('0' + Math.floor((time / 3600) % 60)).slice(-2)}</span>:
        <span>{('0' + Math.floor((time / 60) % 60)).slice(-2)}</span>:
        <span>{('0' + (time % 60)).slice(-2)}</span>
      </div>
      <div className='btns'>
        <button id='start' onClick={startTime}>Start</button>
        <button onClick={stop}>Stop</button>
        <button onClick={reset}>Reset</button>
        <button onClick={wait}>Wait</button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
