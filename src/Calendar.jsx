// ✅ Calendar.jsx
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import supabase from './supabaseClient';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [todos, setTodos] = useState({});
  const [newTodo, setNewTodo] = useState('');

  // Load todos from Supabase
  useEffect(() => {
    const loadTodos = async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading todos:', error);
        return;
      }

      const grouped = {};
      data.forEach((item) => {
        if (!grouped[item.date]) grouped[item.date] = [];
        grouped[item.date].push(item.task);
      });
      setTodos(grouped);
    };

    loadTodos();
  }, []);

  const startOfMonth = currentMonth.startOf('month');
  const firstDayOfCalendar = startOfMonth.startOf('week').add(1, 'day');
  const endOfMonth = currentMonth.endOf('month');
  const lastDayOfCalendar = endOfMonth.endOf('week').add(1, 'day');

  const days = [];
  let cursor = firstDayOfCalendar;
  while (cursor.isBefore(lastDayOfCalendar, 'day')) {
    days.push(
      Array(7)
        .fill(0)
        .map(() => {
          const tmp = cursor;
          cursor = cursor.add(1, 'day');
          return tmp;
        })
    );
  }

  const goToPreviousMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));
  const goToNextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));

  const openModal = (day) => {
    if (day.isSame(currentMonth, 'month') || todos[day.format('YYYY-MM-DD')]) {
      setSelectedDate(day);
    }
  };

  const closeModal = () => {
    setSelectedDate(null);
    setNewTodo('');
  };

  const saveTodo = async () => {
    const key = selectedDate.format('YYYY-MM-DD');
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { error } = await supabase.from('todos').insert({
      user_id: user.id,
      date: key,
      task: newTodo.trim(),
    });

    if (error) {
      alert('Error saving todo: ' + error.message);
      return;
    }

    setTodos((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), newTodo.trim()],
    }));
    closeModal();
  };

  const isSaved = (day) => !!todos[day.format('YYYY-MM-DD')];
  const isSameMonth = (day) => day.isSame(currentMonth, 'month');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-green-200 flex items-center justify-center p-10">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg">
        <div className="flex justify-between items-center mb-8">
          <button onClick={goToPreviousMonth} className="text-gray-500 hover:text-gray-800 text-lg px-2">
            ‹
          </button>
          <h2 className="text-3xl font-semibold text-gray-800">{currentMonth.format('MMMM YYYY')}</h2>
          <button onClick={goToNextMonth} className="text-gray-500 hover:text-gray-800 text-lg px-2">
            ›
          </button>
        </div>

        <table className="w-full table-fixed border-separate border-spacing-y-2 text-center">
          <thead>
            <tr className="text-gray-700">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <th key={d} className="py-3 border-b border-gray-200 font-medium">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((week, wi) => (
              <tr key={wi}>
                {week.map((day, di) => (
                  <td
                    key={di}
                    onClick={() => openModal(day)}
                    className={classNames(
                      'h-16 border border-gray-200 align-top cursor-pointer',
                      'hover:bg-gray-100 transition-colors duration-150',
                      {
                        'text-gray-300': !isSameMonth(day),
                        'bg-green-100 text-green-800': isSaved(day),
                      }
                    )}
                  >
                    {isSameMonth(day) ? (
                      <div className="mt-1 text-lg">{day.date()}</div>
                    ) : (
                      <div className="mt-1 text-lg">&nbsp;</div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-6 text-green-600 text-sm">Dates in green have saved plans.</p>

        {selectedDate && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-3xl shadow-xl w-80">
              <h3 className="text-xl font-semibold mb-4">
                Add To-Do for {selectedDate.format('MMMM D, YYYY')}
              </h3>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <button onClick={closeModal} className="px-3 py-1 text-gray-500 hover:text-black">
                  Cancel
                </button>
                <button
                  onClick={saveTodo}
                  className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  disabled={!newTodo.trim()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
