import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import  { ScriptContext } from "../contexts/Context";
import { SearchSelect, SearchSelectItem } from "@tremor/react";

interface FormData {
  county: string;
  from: Date | null;
  to: Date | null;
}

export default function TnPublicNoticeInput() {

    const { isInput, setIsInput } = useContext(ScriptContext)
    const [selectedCounty, setSelectedCounty] = useState<string>('')
    
    const [formData, setFormData] = useState<FormData>({
        county: selectedCounty,
        from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    });

    useEffect(() => {
        setFormData({ ...formData, county: selectedCounty });
    }, [selectedCounty])

    const handleDateChange = (fieldName: 'from' | 'to', date: Date | null) => {
        setFormData({ ...formData, [fieldName]: date });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form Data:', {...formData, from: formData.from?.toLocaleDateString('en-US'), to: formData.to?.toLocaleDateString('en-US')});
        try {
            const response = await fetch(`${import.meta.env.VITE_API_FLASK_BASE_URL}/script/tn_public_notice`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({...formData, from: formData.from?.toLocaleDateString('en-US'), to: formData.to?.toLocaleDateString('en-US')}),
            });

            if (response.ok) {
                console.log('POST request successful');
                setFormData({ ...formData, county: '' }); // to persuade user to make multiple requests 
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

    return (
        <div className="p-10">
        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center space-y-6">
            <div className="flex flex-col space-y-2 border shadow-xl p-4 rounded-2xl w-full">
                <label className="block font-bold">Select County</label>
                <div className="flex flex-col justify-center space-y-2">
                    <SearchSelect value={selectedCounty} onValueChange={setSelectedCounty}>

                        {Object.entries(court_names).map(([_, countyName]) => (
                            <SearchSelectItem value={countyName} className="mr-2">
                                {countyName}
                            </SearchSelectItem>
                        ))}
                    </SearchSelect>
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
                        className="border border-black rounded-lg py-2 px-4 w-full shadow-lg"
                        required
                    />
                    </div>
                </div>
            </div>
            <div className="flex flex-col space-y-2 pt-4 shadow-xl rounded-3xl w-1/2 justify-center">
                <button type='submit' disabled={formData.county==''} className={`px-4 py-2 bg-primary text-white hover:bg-opacity-90 rounded ${formData.county=='' ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                    Confirm
                </button>
            </div>
        </form>
        </div>
    );
}
