import React, { useState } from 'react';

interface FormData {
  county: string;
  mode: string;
  from: string;
  to: string;
  username: string;
  password: string;
}

export default function TnCourtsInput() {
  const [formData, setFormData] = useState<FormData>({
    county: 'Montgomery',
    mode: 'General Session',
    from: '',
    to: '',
    username: '',
    password: '',
  });

  const handleCountyChange = (county: string) => {
    setFormData({ ...formData, county });
  };

  const handleModeChange = (mode: string) => {
    setFormData({ ...formData, mode });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate the form data here

    // If valid, perform the necessary actions
    console.log('Form Data:', formData);
  };

  return (
    <div className="p-10">
      <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center space-y-6'>
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
            <div className="flex items-center justify-center">
                <p className='w-[40%]'>Starting Date</p>
                <input
                    type="text"
                    name="from"
                    value={formData.from}
                    onChange={handleDateChange}
                    className="border border-gray-300 rounded p-2 w-[60%]"
                />
            </div>
            <div className="flex items-center justify-center">
                <p className='w-[40%]'>Ending Date</p>
                <input
                    type="text"
                    name="to"
                    value={formData.to}
                    onChange={handleDateChange}
                    className="border border-gray-300 rounded p-2 w-[60%]"
                />
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2 border p-4 shadow-xl rounded-2xl w-full">
          <label className="block font-bold">Login Credentials</label>
          <div className="flex flex-col items-center justify-between space-y-2">
            <div className="flex space-x-2 items-center justify-center">
              <p className='w-[30%]'>Username</p>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleLoginChange}
                className="border border-gray-300 rounded p-2 w-[70%]"
              />
            </div>
            <div className="flex items-center justify-center space-x-2">
              <p className='w-[30%]'>Password</p>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleLoginChange}
                className="border border-gray-300 rounded p-2 w-[70%]"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

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
