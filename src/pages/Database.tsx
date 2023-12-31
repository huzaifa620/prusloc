import { useEffect, useState } from 'react';
import TextHeader from '../components/TextHeader';
import ForeClosuresData from '../components/ForeClosuresData';
import TnCourtsData from '../components/TnCourtsData';
import TnledgerCourtsData from '../components/TnledgerCourtsData';
import TnPublicNoticeData from '../components/TnPublicNoticeData';

interface ScriptsStatus {
  completion_date_and_time: string;
  error?: string | null;
  inputs: Record<string, any>;
  script: string;
  status: string;
}

export default function Database() {
  const [data, setData] = useState([]);
  const [tableName, setTableName] = useState('')
  const [scriptsStatus, setScriptsStatus] = useState<ScriptsStatus[]>([]);
  const [mainView, setMainView] = useState(0)

  const fetchScriptStatusData = () => {
    fetch(`${import.meta.env.VITE_API_NODE_WEBHOOK_URL}/api/data/scripts_status`)
      .then((response) => response.json())
      .then((data) => {
        setScriptsStatus(data);
      })
      .catch((error) => console.log('Error fetching data:', error));
  };
  
  useEffect(() => {
    fetchScriptStatusData()
  }, [])

  useEffect(() => {

    if (tableName!=='') {
      fetch(`${import.meta.env.VITE_API_NODE_WEBHOOK_URL}/api/data/${tableName}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data)
      })
      .catch((error) => console.log('Error fetching data:', error));
    }
  }, [tableName]);

  return (
    <div className="flex flex-col h-screen app">
      <div className='flex ml-16 lg:ml-0'>
        <TextHeader title="Database" />
        {
          mainView !== 0 && (
            <>
              <h2 className="font-bold text-xl ml-4 text-[#30415b] flex gap-4 items-center"> {` > `}</h2>
              <h2 className="font-bold lg:text-xl ml-4 text-[#30415b] flex gap-4 items-center cursor-pointer hover:underline underline-offset-4" onClick={() => {
                setMainView(0)
                setData([])
              }}>Back to Menu</h2>
            </>
          )
        }
      </div>

      { mainView === 0 ?
        (
          <div className="grid grid-cols-2 gap-8 w-full mt-8 text-primary">
            {scriptsStatus.map((table, ind)=>(
              <div key={ind} className="relative border shadow-lg from-white via-red-50 to-cyan-100 bg-gradient-to-br w-full lg:w-3/4 h-56 lg:h-64 justify-self-center flex justify-center items-center rounded-md  col-span-1 px-4 py-2 group">
                <span className="absolute top-0 left-0 py-1 px-2 bg-primary text-white rounded-tl-md rounded-br-md font-medium text-xs lg:text-base">{table.script.replace(/_/g, ' ').toUpperCase()}</span>
                <div className="text-3xl bg-primary text-white w-16 h-16 rounded-full flex justify-center items-center group-hover:animate-bounce">{ind+1}</div>
                <div className="w-full text-center absolute bottom-0 py-1.5 px-2 bg-primary text-white rounded-br-md rounded-bl-md font-medium opacity-0 group-hover:opacity-100 duration-500 cursor-pointer" onClick={() => {
                  setTableName(table.script)
                  setMainView(ind+1)
                }}
                >View</div>
              </div>
            ))}
          </div>
        )
        :
        (
          
          mainView === 1 ? (
            <div className="lg:p-4 h-full">
              <TnCourtsData data={data} tableName={tableName} />
            </div>
          )
          :
          (
            mainView === 2 ? (
              <div className="lg:p-4 h-full">
                <TnPublicNoticeData data={data} tableName={tableName} />
              </div>
            )
            :
            (
              mainView === 3 ? (
                <div className="lg:p-4 h-full">
                  <TnledgerCourtsData data={data} tableName={tableName} />
                </div>
              )
              :
              (
                mainView === 4 ? (
                  <div className="lg:p-4 h-full">
                    <ForeClosuresData data={data} tableName={tableName} />
                  </div>
                )
                :
                (
                  <></>
                )
              )
            )
          )
          
        )
      }

    </div>
  );
}