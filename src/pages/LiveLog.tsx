import { useEffect, useState } from 'react';

function LiveLog() {
  const [logData, setLogData] = useState('');

  useEffect(() => {
    // Function to fetch the entire log file on mount
    const fetchLogFile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_FLASK_BASE_URL}/api/live-log/full`);
        if (response.ok) {
          const logContent = await response.text();
          setLogData(logContent);
        } else {
          console.error('Failed to fetch log file');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Establish SSE connection for live updates
    const eventSource = new EventSource(`${import.meta.env.VITE_API_FLASK_BASE_URL}/api/live-log`);

    eventSource.onmessage = (event) => {
      setLogData((prevData) => prevData + event.data + '\n');
    };

    fetchLogFile();

    // Cleanup the SSE connection when unmounting
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="app flex flex-col">
      <div className="flex flex-col p-4 space-y-4">
        <h1>Live Log:</h1>
        <textarea
          className="w-full p-4 rounded-2xl border"
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
