import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const fetchCamps = async (date) => {
  try {
    const response = await axios.post('http://localhost:8000/admin/camp_on_weeknd', { date });
    console.log(date);
    return response.data.camps;
  } catch (error) {
    console.error('Error fetching camps:', error);
    return [];
  }
};



const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [camps, setCamps] = useState({});
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const WeekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  useEffect(() => {
    const fetchCampsForMonth = async () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      const newCamps = {};
  
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        if (date.getDay() === 6) { // Saturday
          const weekendDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const campsList = await fetchCamps(weekendDate);
          newCamps[weekendDate] = campsList;
        }
      }
  
      setCamps(newCamps);
    };
  
    fetchCampsForMonth();
  }, [currentDate]);
  
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      
      if (dayOfWeek === 6) {
        const sundayDate = new Date(year, month, day + 1);
        const weekendDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const weekendCamps = camps[weekendDate] || [];
        
        days.push(
          <Link
            key={`weekend-${day}`}
            to={`/date/${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`}
            className="h-24 col-span-2 border border-gray-200 rounded-lg flex flex-col items-center justify-center bg-green-100 hover:bg-green-200 transition-colors duration-200"
          >
            <span className="text-sm font-medium text-red-500">
              {String(day).padStart(2, '0')}-{String(sundayDate.getDate()).padStart(2, '0')} Weekend
            </span>
            {weekendCamps.map((camp, index) => (
              <span key={index} className="text-xs text-gray-600">{camp.name}</span>
            ))}
          </Link>
        );
        day++;
      } else {
        days.push(
          <div
            key={day}
            className="h-24 border border-gray-200 rounded-lg flex items-center justify-center"
          >
            <span className="text-lg font-medium text-gray-700">{day}</span>
          </div>
        );
      }
    }
    
    return days;
  };
  
  const changeMonth = (increment) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-gray-100">
          <button onClick={() => changeMonth(-1)} className="text-gray-600 hover:text-gray-800">
            &lt; Prev
          </button>
          <h2 className="text-xl font-bold text-gray-800">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={() => changeMonth(1)} className="text-gray-600 hover:text-gray-800">
            Next &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 p-4">
          {WeekDays.map(day => (
            <div key={day} className="text-center font-semibold text-gray-600">
              {day}
            </div>
          ))}
          {generateCalendarDays()}
        </div>
      </div>
    </div>
  );
};

export default Calendar;