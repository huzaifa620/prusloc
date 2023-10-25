import { useState, useEffect } from "react";
import Papa from "papaparse";
import { Icon, Table, TableRow, TableCell, TableHead, TableHeaderCell, TableBody, Title, Flex, Select, SelectItem, MultiSelect, MultiSelectItem } from "@tremor/react";
import { InformationCircleIcon, ArrowCircleDownIcon } from "@heroicons/react/solid";

export type TnPublicNotice = {
  date_ran: string;
  id: string;
  city: string;
  county: string;
  address: string;
  executors: string;
  publication_dates: string;
  attorney: string;
  previous_owner_name: string;
  other_interested_parties: string;
};

type Props = {
  data: TnPublicNotice[];
  tableName: String;
};

export default function ForeClosuresData({ data, tableName }: Props) {
  const [tableHeader, setTableHeader] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<string>("all")

  useEffect(() => {
    if (data && data.length > 0) {
      setTableHeader(Object.keys(data[0]));
    }
  }, [data]);

  const isTnledgerCourtsSelected = (tnPublicNotice: TnPublicNotice) => {
    const isDateSelected =
      selectedDate === "all" || tnPublicNotice.date_ran.split("T")[0] === selectedDate;
  
    const isTdnNoSelected =
      selectedId.length === 0 || selectedId.includes(tnPublicNotice.id);

    const isCountySelected = 
      selectedCounty === "all" || selectedCounty.includes(tnPublicNotice.county)
  
    return isDateSelected && isTdnNoSelected && isCountySelected
  };

  const exportToCSV = () => {
    // Filter the data based on the selected filters
    const filteredData = data.filter((item) => isTnledgerCourtsSelected(item));
  
    // Create a CSV string from the filtered data
    const csvData = Papa.unparse(filteredData);
  
    // Create a Blob object containing the CSV data
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  
    // Create a temporary URL for downloading the Blob
    const url = window.URL.createObjectURL(blob);
  
    // Create a temporary link element for initiating the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${tableName}_${selectedCounty}_${selectedDate}_filtered_data.csv`);
  
    // Trigger a click event to download the CSV file
    link.click();
  
    // Release the temporary URL and link
    window.URL.revokeObjectURL(url);
  };
  

  return (
    <div className="bg-white p-8 h-full rounded-3xl border shadow-2xl">

      <div>
        <Flex className="space-x-0.5" justifyContent="start" alignItems="center">
          <Title className="uppercase"> {tableName.replace(/_/g, " ")} </Title>
          <Icon
            icon={InformationCircleIcon}
            variant="simple"
            tooltip={`Items in ${tableName} table`}
          />
        </Flex>
      </div>

      <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 mt-2 items-center justify-between w-full">

        <div className="flex flex-col items-center justify-center lg:justify-start lg:flex-row w-full lg:w-4/5 space-y-2 lg:space-y-0 lg:space-x-2 mt-2">
          <MultiSelect
            className="max-w-full sm:max-w-xs"
            onValueChange={setSelectedId}
            placeholder="Select Id..."
          >
            {data.map((item) => (
              <MultiSelectItem key={item.id} value={item.id}>
                {item.id}
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
            onValueChange={(value) => setSelectedCounty(value)}
            placeholder="Select County..."
          >
            {["all", ...new Set(data.map((item) => item.county))].map((county) => (
              <SelectItem key={county} value={county}>
                {county}
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

      <Table className="mt-4 h-[65%] sm:h-[80%] 2xl:h-[87%] border rounded-xl">
        <TableHead className="bg-primary">
          <TableRow>
            {tableHeader.map((item, index) => (
              <TableHeaderCell key={index} className={`uppercase text-white text-center ${index === 0 ? "" : ""}`}>
                {item.replace(/_/g, " ")}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody className="font-semibold text-tremor-content-emphasis">
          {data
            .filter((item) => isTnledgerCourtsSelected(item))
            .map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.date_ran.split("T")[0]}</TableCell>
                <TableCell className="text-center">{item.county}</TableCell>
                <TableCell className="text-center">{item.id}</TableCell>
                <TableCell className="text-center">{item.city}</TableCell>
                <TableCell className="text-center">{item.address}</TableCell>
                <TableCell className="text-center">{item.previous_owner_name}</TableCell>
                <TableCell className="text-center">{item.executors}</TableCell>
                <TableCell className="text-center">{item.other_interested_parties}</TableCell>
                <TableCell className="text-center">{item.attorney}</TableCell>
                <TableCell className="text-center">{item.publication_dates}</TableCell>
              </TableRow>
            ))}
        </TableBody>
        
      </Table>
    </div>
  );
}
