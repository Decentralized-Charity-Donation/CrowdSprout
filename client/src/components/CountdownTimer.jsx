import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ deadlineTimestamp }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeDifference = deadlineTimestamp - currentTime;

      if (timeDifference <= 0) {
        clearInterval(countdownInterval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(timeDifference / (60 * 60 * 24));
        const hours = Math.floor((timeDifference % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((timeDifference % (60 * 60)) / 60);
        const seconds = timeDifference % 60;

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [deadlineTimestamp]);

  return (
    <div className="flex justify-between items-center">
      <p className="text-sm">Time Left</p>
      <div className="flex space-x-0.5 pl-10">
        <div className="bg-white text-purple-600 px-1 py-0.5 rounded text-center">
          <div className="text-xs">Days</div>
          <div className="text-xs">{timeLeft.days}</div>
        </div>
        <div className="bg-white text-purple-600 px-1 py-0.5 rounded text-center">
          <div className="text-xs">Hours</div>
          <div className="text-xs">{timeLeft.hours}</div>
        </div>
        <div className="bg-white text-purple-600 px-1 py-0.5 rounded text-center">
          <div className="text-xs">Minutes</div>
          <div className="text-xs">{timeLeft.minutes}</div>
        </div>
        <div className="bg-white text-purple-600 px-1 py-0.5 rounded text-center">
          <div className="text-xs">Seconds</div>
          <div className="text-xs">{timeLeft.seconds}</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
