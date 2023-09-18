import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FormData {
  county: string;
  mode: string;
  from: Date | null;
  to: Date | null;
  username: string;
  password: string;
}

export default function TnCourtsInput() {
    const [formData, setFormData] = useState<FormData>({
        county: 'Montgomery',
        mode: 'General Session',
        from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
        username: '',
        password: '',
      });
      

    const handleCountyChange = (county: string) => {
        setFormData({ ...formData, county });
    };

    const handleModeChange = (mode: string) => {
        setFormData({ ...formData, mode });
    };

    const handleDateChange = (fieldName: 'from' | 'to', date: Date | null) => {
        setFormData({ ...formData, [fieldName]: date });
    };

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form Data:', formData);
    };

    const court_names = {
        mon: 'Montgomery',
        rut: 'Rutherford',
        rob: 'Robertson',
        sum: 'Sumner',
        will: 'Williamson',
        wil: 'Wilson',
    };

    const mode_names = {
        gen: 'General Session',
        cir: 'Circuit Courts',
    };

  return (
    <div className="p-10">
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center space-y-6">
        <div className="flex flex-col space-y-2 border shadow-xl p-4 rounded-2xl w-full">
          <label className="block font-bold">Select County</label>
          <div className="flex flex-col justify-center space-y-2">
            {Object.entries(court_names).map(([key, countyName]) => (
              <label key={key} className="inline-flex items-center">
                <input
                  type="radio"
                  name="county"
                  value={countyName}
                  checked={formData.county === countyName}
                  onChange={() => handleCountyChange(countyName)}
                  className="mr-2"
                />
                {countyName}
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col space-y-2 border shadow-xl p-4 rounded-2xl w-full">
          <label className="block font-bold">Select Mode</label>
          <div className="flex items-center space-x-4">
            {Object.entries(mode_names).map(([key, modeName]) => (
              <label key={key} className="inline-flex items-center">
                <input
                  type="radio"
                  name="mode"
                  value={modeName}
                  checked={formData.mode === modeName}
                  onChange={() => handleModeChange(modeName)}
                  className="mr-2"
                />
                {modeName}
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col space-y-2 border shadow-xl p-4 rounded-2xl w-full">
          <label className="block font-bold">Select Date Range</label>
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center justify-between w-full">
              <h2 className="w-[40%]">Starting Date</h2>
              <DatePicker
                onChange={(date) => handleDateChange('from', date)}
                selected={formData.from}
                dateFormat="MM/dd/yyyy"
                isClearable
                locale="en-GB"
                className="border border-black rounded-lg py-2 px-4 w-full shadow-lg"
              />
            </div>
            <div className="flex items-center justify-between w-full">
              <h2 className="w-[40%]">Ending Date</h2>
              <DatePicker
                onChange={(date) => handleDateChange('to', date)}
                selected={formData.to}
                dateFormat="MM/dd/yyyy"
                isClearable
                locale="en-GB"
                className="border border-black rounded-lg py-2 px-4 w-full shadow-lg"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2 border p-4 shadow-xl rounded-2xl w-full">
          <label className="block font-bold">Login Credentials</label>
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center justify-between w-full">
              <h2 className="w-[30%]">Username</h2>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleLoginChange}
                className="border border-gray-300 rounded p-2 w-[70%] shadow-lg"
              />
            </div>
            <div className="flex items-center justify-between w-full">
              <h2 className="w-[30%]">Password</h2>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleLoginChange}
                className="border border-gray-300 rounded p-2 w-[70%] shadow-lg"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
