import React, { useState, ChangeEvent } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import enGB from 'date-fns/locale/en-GB';

// Register the en-GB locale for date-fns
registerLocale('en-GB', enGB);

const MyDatePicker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-4 text-xl font-semibold">Select a Date</h2>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MM/dd/yyyy"
        isClearable
        wrapperClassName="relative inline-block"
        calendarClassName="bg-white border rounded-lg shadow-md p-4 mt-2"
        locale="en-GB" // Set the locale to en-GB
      />
    </div>
  );
};

export default MyDatePicker;
