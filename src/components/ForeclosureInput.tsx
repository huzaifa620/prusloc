import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function isPastFriday(date: Date) {
    return date.getDay() === 5 && date < new Date();
}

export default function ForeclosureInput() {

    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() + 2) % 7)));
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form Data:', selectedDate);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/script/tnledger_foreclosures`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date: new Date(selectedDate || '').toLocaleDateString('en-US') }),
            });

            if (response.ok) {
                // Request was successful
                console.log('POST request successful');
            } else {
                // Request failed
                console.error('POST request failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center space-y-8 w-full'>
            <h2 className="text-xl font-semibold">Select a Date</h2>
            <DatePicker
                onChange={(date) => setSelectedDate(date)}
                selected={selectedDate}
                dateFormat="MM/dd/yyyy"
                isClearable
                calendarClassName="bg-white shadow-2xl border border-black"
                locale="en-GB"
                required
                filterDate={isPastFriday}
                className="border border-black rounded-xl py-2 px-4 shadow-lg w-[240px]"
            />
            {selectedDate && (
                <p className="mt-4">
                Selected Date: {selectedDate.toLocaleDateString()}
                </p>
            )}
            <p className="text-sm tracking-widest font-bold text-red-500">
                *Note: Only Fridays are allowed
            </p>
            <div className="flex flex-col space-y-2 pt-4 shadow-xl rounded-3xl w-1/2 justify-center">
                <button type='submit' className="px-4 py-2 bg-primary text-white hover:bg-opacity-90 rounded">
                    Confirm
                </button>
            </div>
        </form>
    )
}