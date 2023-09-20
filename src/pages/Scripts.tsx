import { useState } from "react";
import TextHeader from "../components/TextHeader";
import ForeclosureInput from "../components/ForeclosureInput"
import TnCourtsInput from "../components/TnCourtsInput"

const scripts = [
  { title: "Tnledger Foreclosure", logs: "Ran Script 1", lastRun: "9-9-2023" },
  { title: "Tnledger Courts", logs: "Ran Script 2", lastRun: "10-9-2023" },
  { title: "Tn Courts", logs: "Ran Script 3", lastRun: "10-9-2023" }
];

export default function Scripts() {
    
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const handleRunScriptClick = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  return (
    <div className="h-screen">
      <TextHeader title="Scripts" />
      <div className="relative overflow-x-auto my-8 w-10/12 mx-auto rounded-3xl shadow-2xl">
        <table className="w-full text-center text-primary border">
          <thead className="text-white uppercase bg-primary text-lg">
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
          <tbody className="">
            {scripts.map((script, index) => (
              <tr className="bg-white border-b" key={index}>
                <th scope="row" className="px-6 py-4 font-medium text-primary whitespace-nowrap">
                  {script.title}
                </th>
                <td className="px-6 py-4">{script.logs}</td>
                <td className="px-6 py-4">{script.lastRun}</td>
                <td className="px-6 py-4">
                  <button className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90" onClick={handleRunScriptClick}>
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
          <div className="relative w-11/12 lg:w-1/2 h-4/5">
            
            <div className="absolute top-4 right-4 md:top-4 md:right-4 xl:top-8 xl:right-12">
              <button onClick={handleRunScriptClick} className="w-8 h-8 bg-primary text-white rounded-full hover:opacity-75 flex items-center justify-center" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="bg-white shadow-2xl p-4 rounded-2xl flex items-center justify-center w-full h-full">
              <div className="w-full h-full overflow-y-auto">
                <div className="flex flex-col items-center justify-cente space-y-2 h-full w-full">
                  <TnCourtsInput />
                  {/* <ForeclosureInput /> */}
                </div>
              </div>
            </div>
          </div>
        </div>

      )}
    </div>
  );
}
