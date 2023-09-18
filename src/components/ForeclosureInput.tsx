import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function isPastFriday(date: Date) {
    return date.getDay() === 5 && date < new Date();
}

export default function ForeclosureInput() {

    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() + 2) % 7)));

    return (
        <>
            <h2 className="text-xl font-semibold">Select a Date</h2>
            <DatePicker
                onChange={(date) => setSelectedDate(date)}
                selected={selectedDate}
                dateFormat="MM/dd/yyyy"
                isClearable
                wrapperClassName="relative inline-block"
                calendarClassName="bg-white border rounded-lg shadow-md p-4 mt-2"
                locale="en-GB"
                filterDate={isPastFriday}
                className="border border-black rounded-lg py-2 px-4 w-full shadow-lg"
            />
            {selectedDate && (
                <p className="mt-4">
                Selected Date: {selectedDate.toLocaleDateString()}
                </p>
            )}
            <p className="text-sm tracking-widest font-bold text-red-500">
                *Note: Only Fridays are allowed
            </p>
        </>
    )
}