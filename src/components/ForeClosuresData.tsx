import { useState, useEffect } from "react";
import Papa from "papaparse";
import { Icon, Table, TableRow, TableCell, TableHead, TableHeaderCell, TableBody, Title, Flex, Select, SelectItem, MultiSelect, MultiSelectItem } from "@tremor/react";
import { InformationCircleIcon, ArrowCircleDownIcon, TrashIcon } from "@heroicons/react/solid";

export type Foreclosure = {
  date_ran: string;
  tdn_no: string;
  url: string;
  borrower: string;
  address: string;
  original_trustee: string;
  auction_date: string;
  occurrence: number;
};

type Props = {
  data: Foreclosure[];
  tableName: string;
};

export default function ForeClosuresData({ data, tableName }: Props) {
  const [tableHeader, setTableHeader] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedTdnNo, setSelectedTdnNo] = useState<string[]>([]);
  const [selectedOccurrence, setSelectedOccurrence] = useState<number>(0);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    const username = localStorage.getItem("username");
    setUserName(username || '');
  }, [userName])

  useEffect(() => {
    if (data && data.length > 0) {
      setTableHeader(Object.keys(data[0]));
    }
  }, [data]);

  const isForeclosureSelected = (foreclosure: Foreclosure) => {
    const isDateSelected =
      selectedDate === "all" || foreclosure.date_ran.split("T")[0] === selectedDate;
    const isTdnNoSelected =
      selectedTdnNo.length === 0 || selectedTdnNo.includes(foreclosure.tdn_no);
    const isOccurrenceSelected =
      selectedOccurrence === 0 || foreclosure.occurrence === selectedOccurrence;

    return isDateSelected && isTdnNoSelected && isOccurrenceSelected;
  };

  const exportToCSV = () => {
    // Filter the data based on the selected filters
    const filteredData = data.filter((item) => isForeclosureSelected(item));

    // Create a CSV string from the filtered data
    const csvData = Papa.unparse(filteredData);

    // Create a Blob object containing the CSV data
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

    // Create a temporary URL for downloading the Blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link element for initiating the download
    const filename = `${tableName}_${selectedDate}_${selectedOccurrence}_filtered_data.csv`;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);

    // Trigger a click event to download the CSV file
    link.click();

    // Release the temporary URL and link
    window.URL.revokeObjectURL(url);
  };

  const handleRowSelection = (tdn_no: string) => {
    setSelectedRows((prevSelectedRows) => ({
      ...prevSelectedRows,
      [tdn_no]: !prevSelectedRows[tdn_no],
    }));
  };

  const handleDelete = async () => {

    const recordsToDelete = Object.keys(selectedRows)
    .filter((tdn_no) => selectedRows[tdn_no])
    .map((tdn_no) => data.find((item) => item.tdn_no === tdn_no))
    .map((val) => val?.tdn_no)
    .filter(Boolean);

    let confirmationMessage = "";
    let deletionData = {};

    if (recordsToDelete.length === 0 && selectedDate === 'all') return

    if (recordsToDelete.length === 0 && selectedDate !== 'all') {
      confirmationMessage = `Are you sure you want to delete all listings with date ${selectedDate} ?`;
      deletionData = { tableName, selectedDate, userName };
    } else {
      confirmationMessage = `Are you sure you want to delete the selected (${recordsToDelete.length}) listings ?`;
      deletionData = { tableName, recordsToDelete, userName };
    }

    const isConfirmed = window.confirm(confirmationMessage);
    if (!isConfirmed) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_NODE_WEBHOOK_URL}/api/delete-listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deletionData),
      });
      if (response.ok) {
        window.location.reload()
      } else if (response.status === 401) {
        alert("Unauthorized action: Only admin can perform deletions!")
      }
       else {
        alert("Error deleting records");
      }
    } catch (error) {
      alert("Error deleting records");
    }
    
  };

  return (
    <div className="bg-white p-8 h-full rounded-3xl border shadow-2xl">
      <div>
        <Flex className="space-x-0.5" justifyContent="start" alignItems="center">
          <Title className="uppercase"> {tableName.replace("_", " ")} </Title>
          <Icon icon={InformationCircleIcon} variant="simple" tooltip={`Items in ${tableName} table`} />
        </Flex>
      </div>

      <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 mt-2 items-center justify-between w-full">
        <div className="flex flex-col items-center justify-center lg:justify-start lg:flex-row w-full lg:w-4/5 space-y-2 lg:space-y-0 lg:space-x-2 mt-2">
          <MultiSelect
            className="max-w-full sm:max-w-xs"
            onValueChange={setSelectedTdnNo}
            placeholder="Select TDN No..."
          >
            {data.map((item) => (
              <MultiSelectItem key={item.tdn_no} value={item.tdn_no.toString()}>
                {item.tdn_no}
              </MultiSelectItem>
            ))}
          </MultiSelect>

          <Select
            className="max-w-full sm:max-w-xs"
            onValueChange={(value) => setSelectedDate(value)}
            placeholder="Select Date..."
          >
            {["all", ...new Set(data.map((item) => item.date_ran.split("T")[0]))].map((date) => (
              <SelectItem key={date} value={date}>
                {date}
              </SelectItem>
            ))}
          </Select>

          <Select
            className="max-w-full sm:max-w-xs"
            onValueChange={(value) => {
              const selectedValue = value === "all" ? 0 : parseInt(value);
              setSelectedOccurrence(selectedValue);
            }}
            placeholder="Select Occurrence..."
          >
            {["all", ...new Set(data.map((item) => item.occurrence))]
              .map((occurrence) => (occurrence === "all" ? 0 : parseInt(occurrence.toString())))
              .sort((a, b) => a - b)
              .map((occurrence) => (
                <SelectItem key={occurrence} value={occurrence.toString()}>
                  {occurrence === 0 ? "all" : occurrence}
                </SelectItem>
              ))}
          </Select>
        </div>

        <button
          className="mt-4 bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 hover-bg-opacity-90 flex items-center justify-center space-x-2 group lg:w-[18%]"
          onClick={handleDelete}
        >
          <p>Delete Selected</p>
          <TrashIcon className="h-8 w-8 transform group-hover:animate-ping" />
        </button>

        <button
          className="mt-4 bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-dark hover-bg-opacity-90 flex items-center justify-center space-x-2 group lg:w-[15%]"
          onClick={exportToCSV}
        >
          <p>Export CSV</p>
          <ArrowCircleDownIcon className="h-8 w-8 transform group-hover:animate-bounce" />
        </button>
      </div>

      <Table className="mt-4 h-[55%] sm:h-[80%] 2xl:h-[87%] border rounded-xl">
        <TableHead className="bg-primary">
          <TableRow>
            <TableHeaderCell key="empty" className="text-center"></TableHeaderCell>
            {tableHeader.map((item, index) => (
              <TableHeaderCell key={index} className={`uppercase text-white text-center ${index === 0 ? "" : ""}`}>
                {item.replace("_", " ")}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody className="font-semibold text-tremor-content-emphasis">
          {data.filter((item) => isForeclosureSelected(item)).map((item) => (
            <TableRow key={item.tdn_no}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedRows[item.tdn_no] || false}
                  onChange={() => handleRowSelection(item.tdn_no)}
                />
              </TableCell>
              <TableCell>{item.date_ran.split("T")[0]}</TableCell>
              <TableCell className="text-center">{item.tdn_no}</TableCell>
              <TableCell className="text-center">{item.url}</TableCell>
              <TableCell className="text-center">{item.borrower}</TableCell>
              <TableCell className="text-center">{item.address}</TableCell>
              <TableCell className="text-center">{item.original_trustee}</TableCell>
              <TableCell className="text-center">{item.auction_date.split("T")[0]}</TableCell>
              <TableCell className="text-center">{item.occurrence}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
