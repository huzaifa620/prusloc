import { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  Icon,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  Title,
  Flex,
  Select,
  SelectItem,
  MultiSelect,
  MultiSelectItem,
} from "@tremor/react";
import { InformationCircleIcon, ArrowCircleDownIcon } from "@heroicons/react/solid";

export type Foreclosure = {
  date_ran: string;
  tdn_no: string;
  url: string;
  borrower: string;
  address: string;
  original_trustee: string;
  occurrence: number;
};

type Props = {
  data: Foreclosure[];
  tableName: String;
};

export default function ForeClosuresData({ data, tableName }: Props) {
  const [tableHeader, setTableHeader] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedTdnNo, setSelectedTdnNo] = useState<string[]>([]);
  const [selectedOccurrence, setSelectedOccurrence] = useState<number>(0);

  useEffect(() => {
    if (data && data.length > 0) {
      setTableHeader(Object.keys(data[0]));
    }
  }, [data]);

  const isForeclosureSelected = (foreclosures: Foreclosure) => {
    const isDateSelected =
      selectedDate === "all" || foreclosures.date_ran.split("T")[0] === selectedDate;
  
    const isTdnNoSelected =
      selectedTdnNo.length === 0 || selectedTdnNo.includes(foreclosures.tdn_no);
  
    const isOccurrenceSelected =
      selectedOccurrence === 0 || foreclosures.occurrence === selectedOccurrence;
  
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
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${tableName}_filtered_data.csv`);
  
    // Trigger a click event to download the CSV file
    link.click();
  
    // Release the temporary URL and link
    window.URL.revokeObjectURL(url);
  };
  

  return (
    <div className="bg-white p-8 h-full rounded-3xl border shadow-2xl">

      <div>
        <Flex className="space-x-0.5" justifyContent="start" alignItems="center">
          <Title className="uppercase"> {tableName.replace("_", " ")} </Title>
          <Icon
            icon={InformationCircleIcon}
            variant="simple"
            tooltip={`Items in ${tableName} table`}
          />
        </Flex>
      </div>

      <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 mt-2 items-center justify-between w-full">

        <div className="flex flex-col lg:flex-row w-1/2 space-y-2 lg:space-y-0 lg:space-x-2 mt-2">
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
            {[...new Set(data.map((item) => item.date_ran.split("T")[0]))].map((date) => (
              <SelectItem key={date} value={date}>
                {date}
              </SelectItem>
            ))}
          </Select>

          <Select
            className="max-w-full sm:max-w-xs"
            onValueChange={(value) => setSelectedOccurrence(parseInt(value))}
            placeholder="Select Occurrence..."
          >
            {[...new Set(data.map((item) => item.occurrence))].map((occurrence) => (
              <SelectItem key={occurrence} value={occurrence.toString()}>
                {occurrence}
              </SelectItem>
            ))}
          </Select>
        </div>

        <button
          className="mt-4 bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-dark hover:bg-opacity-90 flex items-center justify-center space-x-2 group"
          onClick={exportToCSV}
        >
          <p>Export CSV</p>
          <ArrowCircleDownIcon className="h-8 w-8 transform group-hover:animate-bounce" />
        </button>

        
      </div>

      <Table className="mt-4 h-[85%] 2xl:h-[90%] border rounded-xl">
        <TableHead className="bg-primary">
          <TableRow>
            {tableHeader.map((item, index) => (
              <TableHeaderCell key={index} className={`uppercase text-white text-center ${index === 0 ? "" : ""}`}>
                {item.replace("_", " ")}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody className="font-semibold text-tremor-content-emphasis">
          {data
            .filter((item) => isForeclosureSelected(item))
            .map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.date_ran.split("T")[0]}</TableCell>
                <TableCell className="text-center">{item.tdn_no}</TableCell>
                <TableCell className="text-center">{item.url}</TableCell>
                <TableCell className="text-center">{item.borrower}</TableCell>
                <TableCell className="text-center">{item.address}</TableCell>
                <TableCell className="text-center">{item.original_trustee}</TableCell>
                <TableCell className="text-center">{item.occurrence}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
