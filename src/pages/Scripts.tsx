import { useState, useLayoutEffect, useEffect, useContext } from "react";
import TextHeader from "../components/TextHeader";
// import ForeclosureInput from "../components/ForeclosureInput"
import TnCourtsInput from "../components/TnCourtsInput"
import  { ScriptContext } from "../contexts/Context";

interface ScriptsStatus {
  completion_date_and_time: string;
  error?: string | null;
  inputs: Record<string, any>;
  script: string;
  status: string;
}

export default function Scripts() {

  const [scriptsStatus, setScriptsStatus] = useState<ScriptsStatus[]>([]);
  const [status, setStatus] = useState<boolean>(false);

  useLayoutEffect(() => {
    fetch(`${import.meta.env.VITE_API_NODE_WEBHOOK_URL}/api/data/scripts_status`)
      .then((response) => response.json())
      .then((data) => {
        setScriptsStatus(data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [])

  useEffect(() => {
    const eventSource = new EventSource(`${import.meta.env.VITE_API_NODE_WEBHOOK_URL}/status-updates`);
  
    eventSource.addEventListener('message', (event) => {
      const eventData = JSON.parse(event.data);
      if (eventData.script === 'tn_courts') {
        setStatus(false);
  
        // Fetch the latest script status data when an update is received
        fetch(`${import.meta.env.VITE_API_NODE_WEBHOOK_URL}/api/data/scripts_status`)
          .then((response) => response.json())
          .then((data) => {
            setScriptsStatus(data);
          })
          .catch((error) => console.error('Error fetching data:', error));
      }
    });
  
    eventSource.addEventListener('error', (error) => {
      console.error('SSE error:', error);
      eventSource.close();
    });
  
    return () => {
      eventSource.close();
    };
  }, []);
  
  const { isInput, setIsInput } = useContext(ScriptContext)

  return (
    <div className="app">
      <TextHeader title="Scripts" />
      <div className="relative overflow-x-auto my-8 w-10/12 mx-auto rounded-3xl shadow-2xl">
        <table className="w-full text-center text-primary border">
          <thead className="text-white uppercase bg-primary text-lg">
            <tr>
              <th scope="col" className="px-6 py-3">
                Script
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Last Run
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="">
            {scriptsStatus.map((script, index) => (
              <tr className="bg-white border-b" key={index}>
                <th scope="row" className="px-6 py-4 font-medium text-primary whitespace-nowrap uppercase">
                  {script.script.replace('_', ' ')}
                </th>
                <td className="px-6 py-4">{script.status}</td>
                <td className="px-6 py-4">{script.completion_date_and_time.split('T')[0]}</td>
                <td className="px-6 py-4">
                  <button
                    disabled={script.status === 'running'}
                    className={`px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 ${(script.status === 'running' || status) && 'opacity-70 cursor-not-allowed'}`}
                    onClick={() => setIsInput(!isInput)}
                  >
                    {(script.status === 'running' || status) ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin"></div>
                        <span>Running...</span>
                      </div>
                    ) : (
                      'Run Script'
                    )}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isInput && (

        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="relative w-11/12 lg:w-1/2 h-4/5">
            
            <div className="absolute top-4 right-4 md:top-4 md:right-4 xl:top-8 xl:right-12">
              <button onClick={() => setIsInput(!isInput)} className="w-8 h-8 bg-primary text-white rounded-full hover:opacity-75 flex items-center justify-center" aria-label="Close">
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
