import { useLayoutEffect, useState } from 'react';
import TextHeader from '../components/TextHeader';
import ForeClosuresData from '../components/ForeClosuresData';

interface ScriptsStatus {
  completion_date_and_time: string;
  error?: string | null;
  inputs: Record<string, any>;
  script: string;
  status: string;
}

export default function Database() {
  const [data, setData] = useState([]);
  const [tableName, _] = useState('tnledger_foreclosures')
  const [scriptsStatus, setScriptsStatus] = useState<ScriptsStatus[]>([]);
  const [mainView, setMainView] = useState(true)

  const fetchScriptStatusData = () => {
    fetch(`${import.meta.env.VITE_API_NODE_WEBHOOK_URL}/api/data/scripts_status`)
      .then((response) => response.json())
      .then((data) => {
        setScriptsStatus(data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  };
  
  useLayoutEffect(() => {

    fetchScriptStatusData()
    fetch(`${import.meta.env.VITE_API_NODE_WEBHOOK_URL}/api/data/${tableName}`)
    .then((response) => response.json())
    .then((data) => {
      setData(data)
    })
    .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="flex flex-col h-screen app">
      <div className='flex'>
        <TextHeader title="Database" />
        {
          !mainView && (
            <>
              <h2 className="font-bold text-xl ml-4 text-[#30415b] flex gap-4 items-center"> {` > `}</h2>
              <h2 className="font-bold text-xl ml-4 text-[#30415b] flex gap-4 items-center cursor-pointer hover:underline underline-offset-4" onClick={() => setMainView(!mainView)}>Back to Menu</h2>
            </>
          )
        }
      </div>

      { mainView ?
        (
          <div className="grid grid-cols-2 gap-8 w-full mt-8 text-primary">
            {scriptsStatus.map((table, ind)=>(
              <div className="relative border shadow-lg from-white via-red-50 to-cyan-100 bg-gradient-to-br w-3/4 h-64 justify-self-center flex justify-center items-center rounded-md  col-span-1 px-4 py-2 group">
                <span className="absolute top-0 left-0 py-1 px-2 bg-primary text-white rounded-tl-md rounded-br-md font-medium">{table.script.replace(/_/g, ' ').toUpperCase()}</span>
                <div className="text-3xl bg-primary text-white w-16 h-16 rounded-full flex justify-center items-center group-hover:animate-bounce">{ind+1}</div>
                <div className="w-full text-center absolute bottom-0 py-1.5 px-2 bg-primary text-white rounded-br-md rounded-bl-md font-medium opacity-0 group-hover:opacity-100 duration-500 cursor-pointer" onClick={() => setMainView(!mainView)}>View</div>
              </div>
            ))}
          </div>
        )
        :
        (

          <div className="p-4 h-full">
            <ForeClosuresData data={data} tableName={tableName} />
          </div>

        )
      }

    </div>
  );
}