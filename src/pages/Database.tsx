import { useLayoutEffect, useState } from 'react';
import TextHeader from '../components/TextHeader';
import DatabaseTable from '../components/DatabaseTable';

export default function Database() {
  const [data, setData] = useState([]);
  const [tableName, _] = useState('tnledger_foreclosures')

  useLayoutEffect(() => {
    fetch(`${import.meta.env.VITE_API_NODE_WEBHOOK_URL}/api/data/${tableName}`)
    .then((response) => response.json())
    .then((data) => {
      setData(data)
    })
    .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="flex flex-col h-screen app">
      <TextHeader title="Database" />
      <div className="p-4 h-full">
        <DatabaseTable data={data} tableName={tableName} />
      </div>
    </div>
  );
}