import { useState } from "react";
import TextHeader from "../components/TextHeader";
import ForeclosureInput from "../components/ForeclosureInput"
import TnCourtsInput from "../components/TnCourtsInput"

const scripts = [
  { title: "Script 1", logs: "Ran Script 1", lastRun: "9-9-2023" },
  { title: "Script 2", logs: "Ran Script 2", lastRun: "10-9-2023" },
];

export default function Scripts() {
    
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
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
          <div className="bg-white shadow-2xl p-4 rounded-2xl flex items-center justify-center h-[85%] w-1/2">
            <div className="flex flex-col items-center justify-center space-y-2">
              {/* <ForeclosureInput /> */}
              <TnCourtsInput />
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
