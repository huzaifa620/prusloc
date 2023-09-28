import { useEffect, useState, useRef } from 'react';
import TextHeader from '../components/TextHeader';

function LiveLog() {
  const [logData, setLogData] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  
  const tabs = [
    { label: 'TN COURTS', endpoint: 'tn_courts' },
    { label: 'TNLEDGER FORECLOSURES', endpoint: 'tnledger_foreclosures' },
    { label: 'TNLEDGER COURTS', endpoint: 'tnledger_courts' },
    // { label: 'TN PUBLIC NOTICE PROBATE NOTICE', endpoint: 'tn_public_notice_probate_notice' },
  ];

  const fetchLogForTab = async (tabIndex: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_FLASK_BASE_URL}/api/log/full/${tabs[tabIndex].endpoint}`);
      if (response.ok) {
        const logContent = await response.text();
        setLogData(logContent);
        scrollToBottom(); // Scroll to the bottom when new content is added
      } else {
        setLogData('Nothing to show!')
      }
    } catch (error) {
      setLogData('Nothing to show!');
    }
  };

  // Function to scroll the textarea to the bottom
  const scrollToBottom = () => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Fetch the initial log content for the active tab
    fetchLogForTab(activeTab);

    // Establish SSE connection for live updates
    const eventSource = new EventSource(`${import.meta.env.VITE_API_FLASK_BASE_URL}/api/live-log/${tabs[activeTab].endpoint}`);

    eventSource.onmessage = (event) => {
      setLogData((prevData) => prevData + event.data + '\n');
      scrollToBottom(); // Scroll to the bottom when new content is added
    };

    // Cleanup the SSE connection when unmounting
    return () => {
      eventSource.close();
    };
  }, [activeTab]);

  const handleTabClick = (tabIndex: number) => {
    // Fetch log content for the clicked tab
    setLogData('');
    fetchLogForTab(tabIndex);
    setActiveTab(tabIndex);
  };

  const updateTextareaRows = () => {
    if (textareaRef.current) {
      const screenWidth = window.innerWidth;
      const rows = screenWidth < 1440 ? (screenWidth < 500 ? 12 : 20) : 30;
      textareaRef.current.rows = rows;
    }
  };

  useEffect(() => {
    // Call the update function initially
    updateTextareaRows();

    // Attach the event listener
    window.addEventListener('resize', updateTextareaRows);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', updateTextareaRows);
    };
  }, [])

  return (
    <div className="app flex flex-col">
      <TextHeader title="Live Logs" />
      <div className="flex flex-col p-4 space-y-4">
        <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4">
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
          ref={textareaRef}
          className="w-full py-4 px-8 rounded-2xl border text-justify shadow-2xl overflow-y-scroll"
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
