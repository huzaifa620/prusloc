import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import  { ScriptContext } from "../contexts/Context";

interface FormData {
  county: string[];
  mode: string;
  from: Date | null;
  to: Date | null;
  username: string;
  password: string;
}

export default function TnCourtsInput() {

  const { isInput, setIsInput } = useContext(ScriptContext)
  
  const [formData, setFormData] = useState<FormData>({
    county: [],
    mode: 'General Session',
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    username: '',
    password: '',
  });

  const handleCountyChange = (countyName: string) => {
    const updatedCounties = formData.county.includes(countyName)
      ? formData.county.filter((county) => county !== countyName)
      : [...formData.county, countyName];

    setFormData({ ...formData, county: updatedCounties });
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form Data:', {...formData, from: formData.from?.toLocaleDateString('en-US'), to: formData.to?.toLocaleDateString('en-US')});
    try {
        const response = await fetch(`${import.meta.env.VITE_API_FLASK_BASE_URL}/script/tn_courts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({...formData, from: formData.from?.toLocaleDateString('en-US'), to: formData.to?.toLocaleDateString('en-US')}),
        });

        if (response.ok) {
            console.log('POST request successful');
            setFormData({ ...formData, county: [] }); // to persuade user to make multiple requests 
            const updateScriptStatus = async (scriptName: string) => {
              try {
                const response = await fetch(`${import.meta.env.VITE_API_NODE_WEBHOOK_URL}/api/status/${scriptName}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({}),
                });
                
                if (response.ok) {
                  console.log(`Successfully updated status for ${scriptName}`);
                  setIsInput(!isInput)
                  //
                } else {
                  console.error(`Failed to update status for ${scriptName}`);
                }
              } catch (error) {
                console.error('Error:', error);
              }
            };
            
            updateScriptStatus('tn_courts');            
            
        } else {
            console.error('POST request failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
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
    cir: 'Circuit Court',
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
                  type="checkbox"
                  name="county"
                  value={countyName}
                  checked={formData.county.includes(countyName)}
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
                  required
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
                maxDate={new Date()}
                className="border border-black rounded-lg py-2 px-4 w-full shadow-lg"
                required
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
                maxDate={new Date()}
                className="border border-black rounded-lg py-2 px-4 w-full shadow-lg"
                required
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
        <div className="flex flex-col space-y-2 pt-4 shadow-xl rounded-3xl w-1/2 justify-center">
          <button type='submit' disabled={formData.county.length==0} className={`px-4 py-2 bg-primary text-white hover:bg-opacity-90 rounded ${formData.county.length==0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}
