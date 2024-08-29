"use client";

import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';

interface Progress {
  [key: string]: string;
}

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [progress, setProgress] = useState<Progress>({
    '2024-06-01': 'Audio title Completed'
  });

  const renderHeader = () => {
    const dateFormat = 'MMMM yyyy';

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="font-bold text-purple-heavy" onClick={prevMonth}>
            &lt; 이전
          </div>
        </div>
        <div className="flex center items-center justify-center">
          <span className='text-[18px] font-bold text-purple-heavy'>{format(currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={nextMonth}>
          <div className="font-bold text-purple-heavy">
            다음 &gt;
          </div>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEEE';
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const dateKey = format(day, 'yyyy-MM-dd');
        days.push(
          <div
            className={`col cell ${
              !isSameMonth(day, monthStart)
                ? 'disabled'
                : isSameDay(day, selectedDate)
                ? 'selected'
                : ''
            }`}
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="number">{formattedDate}</span>
            <div className="progress ">{progress[dateKey] || ''}</div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  const onDateClick = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const newProgress = prompt('Enter study progress:', progress[dateKey] || '');
    if (newProgress !== null) {
      setProgress({ ...progress, [dateKey]: newProgress });
    }
    setSelectedDate(day);
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return (
    <div className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
