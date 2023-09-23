import { useEffect, useState } from 'react';
import TextHeader from '../components/TextHeader';

function LiveLog() {
  const [logData, setLogData] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'TN COURTS', endpoint: 'tn_courts' },
    { label: 'TNLEGDER FORECLOSURES', endpoint: 'tnledger_foreclosures' },
    { label: 'TNLEDGER COURTS', endpoint: 'tnledger_courts' },
    { label: 'TN PUBLIC NOTICE PROBATE NOTICE', endpoint: 'tn_public_notice_probate_notice' },
  ];

  const fetchLogForTab = async (tabIndex: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_FLASK_BASE_URL}/api/log/full/${tabs[tabIndex].endpoint}`);
      if (response.ok) {
        const logContent = await response.text();
        setLogData(logContent);
      } else {
        setLogData('Nothing to show!')
      }
    } catch (error) {
      setLogData('Nothing to show!');
    }
  };

  useEffect(() => {
    // Fetch the initial log content for the active tab
    fetchLogForTab(activeTab);

    // Establish SSE connection for live updates
    const eventSource = new EventSource(`${import.meta.env.VITE_API_FLASK_BASE_URL}/api/live-log/${tabs[activeTab].endpoint}`);

    eventSource.onmessage = (event) => {
      setLogData((prevData) => prevData + event.data + '\n');
    };

    // Cleanup the SSE connection when unmounting
    return () => {
      eventSource.close();
    };
  }, [activeTab]);

  const handleTabClick = (tabIndex: number) => {
    // Fetch log content for the clicked tab
    setLogData('')
    fetchLogForTab(tabIndex);
    setActiveTab(tabIndex);
  };

  return (
    <div className="app flex flex-col">
      <TextHeader title="Live Logs" />
      <div className="flex flex-col p-4 space-y-4">
        <div className="flex space-x-4">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`py-2 px-4 border rounded-md ${activeTab === index ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => handleTabClick(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <textarea
          className="w-full py-4 px-8 rounded-2xl border text-justify"
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
