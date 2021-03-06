import React, { useState } from "react";
import ReactDOM from "react-dom";
import $ from 'jquery';
import { interval, Subject, fromEvent } from "rxjs";
import { takeUntil, repeatWhen, share, filter, buffer, debounceTime, map } from "rxjs/operators";
import './index.css'

const action$ = new Subject();
const stop$ = action$.pipe(filter(action => action === 'stop'));
const reset$ = action$.pipe(filter(action => action === 'reset'));

const observable$ = interval(1000)
  .pipe(
  takeUntil(stop$),
  repeatWhen(() => reset$)
).pipe(share());

const App = () => {
  const [time, setTime] = useState(0);
 
  const startTime = () => {
    const start = $('#start');
    const startTime$ = fromEvent(start, 'click');

    startTime$.subscribe(() => observable$.subscribe(setTime))
  }

  const stop = () => {
    setTime(0);
    action$.next('stop')
  };

  const reset = () => {
    setTime(0);
    action$.next('stop')
    action$.next('reset')
  };

  const wait = () => {
    const waitBtn = $('#wait');
    const click$ = fromEvent(waitBtn, 'click');

    click$.pipe(
      buffer(click$.pipe(debounceTime(300))),
      map(v => v.length),
      filter(x => x === 2)
    ).subscribe(() => action$.next('stop'))
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
        <button id='wait' onClick={wait}>Wait</button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
