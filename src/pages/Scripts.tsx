import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TextHeader from "../components/TextHeader";

const scripts = [
  { title: "Script 1", logs: "Ran Script 1", lastRun: "9-9-2023" },
  { title: "Script 2", logs: "Ran Script 2", lastRun: "10-9-2023" },
];

function isPastFriday(date: Date) {
    return date.getDay() === 5 && date < new Date();
  }
export default function Scripts() {
    
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() + 2) % 7)));

  const handleRunScriptClick = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  return (
    <div>
      <TextHeader title="Scripts" />
      <div className="relative overflow-x-auto my-8 w-10/12 mx-auto shadow rounded-md">
        <table className="w-full text-sm text-left text-primary">
          <thead className="text-xs text-white uppercase bg-primary">
            <tr>
              <th scope="col" className="px-6 py-3">
                Script
              </th>
              <th scope="col" className="px-6 py-3">
                Logs
              </th>
              <th scope="col" className="px-6 py-3">
                Last Run
              </th>
              <th scope="col" className="px-6 py-3">
                Run Script
              </th>
            </tr>
          </thead>
          <tbody>
            {scripts.map((script, index) => (
              <tr className="bg-white border-b" key={index}>
                <th scope="row" className="px-6 py-4 font-medium text-primary whitespace-nowrap">
                  {script.title}
                </th>
                <td className="px-6 py-4">{script.logs}</td>
                <td className="px-6 py-4">{script.lastRun}</td>
                <td className="px-6 py-4">
                  <button className="px-4 py-2 bg-primary text-white rounded" onClick={handleRunScriptClick}>
                    Run Script
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isDatePickerOpen && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white shadow-2xl p-4 rounded-2xl flex items-center justify-center h-1/3 w-1/3">
            <div className="flex flex-col items-center justify-center space-y-6">
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
                <div className="flex space-x-4 items-center justify-center">
                    <button className="px-4 py-2 bg-primary text-white rounded">
                        Confirm
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded" onClick={handleRunScriptClick}>
                        Cancel
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
