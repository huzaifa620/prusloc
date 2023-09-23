import TextHeader from "../components/TextHeader";
import { useEffect, useState } from 'react';

function LiveLog() {
  const [logData, setLogData] = useState('');

  useEffect(() => {
    const eventSource = new EventSource(`${import.meta.env.VITE_API_FLASK_BASE_URL}/api/live-log`);

    eventSource.onmessage = (event) => {
      setLogData((prevData) => prevData + event.data + '\n');
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="app flex flex-col h-full">
      <TextHeader title="Live Logs"/>
      <div className="flex flex-col p-4 space-y-4">
        <h1>Live Log:</h1>
        <textarea
          className="w-full h-[90%] p-4 rounded-2xl border shadow-2xl text-justify"
          value={logData}
          rows={30}
          readOnly
          style={{ whiteSpace: 'pre-wrap' }}
        />
      </div>
    </div>
  );
}

export default LiveLog;