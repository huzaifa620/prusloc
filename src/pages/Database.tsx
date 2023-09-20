import { useEffect, useState } from 'react';
import TextHeader from '../components/TextHeader';
import DatabaseTable from '../components/DatabaseTable';

export default function Database() {
  const [data, setData] = useState([]);
  const [tableName, setTableName] = useState('tnledger_foreclosures')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_NODE_WEBHOOK_URL}/api/data/${tableName}`)
    .then((response) => response.json())
    .then((data) => {
      setData(data)
    })
    .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <TextHeader title="Database" />
      <div className="p-4 h-[93%]">
        <DatabaseTable data={data} tableName={tableName} />
      </div>
    </div>
  );
}