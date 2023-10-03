"use client";

import { Icon,Table,TableRow, TableCell, TableHead, TableHeaderCell,TableBody, Title, Flex, Select, SelectItem, MultiSelect, MultiSelectItem } from "@tremor/react";
import { InformationCircleIcon, ArrowCircleDownIcon } from "@heroicons/react/solid";
import { useState, useEffect } from "react";
import Papa from "papaparse";

export type TnCourts = {
    date_ran: string;
    case_type: string;
    case_name: string;
    case_style: string;
    filing_date: string;
    filing_type: string;
    address: string;
    details: string;
    url: string
};

type Props = {
    data: TnCourts[];
    tableName: String;
}

export default function TnCourtsData( { data, tableName }: Props ) {

    const [tableHeader, setTableHeader] = useState<string[]>([])
    const [selectedDate, setSelectedDate] = useState("all");
    const [selectedCaseType, setSelectedCaseType] = useState<string[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setTableHeader(Object.keys(data[0]));
    }
  }, [data]);
  
    const isTnCourtsSelected = (tncourts: TnCourts) =>
      (tncourts.date_ran === selectedDate || selectedDate === "all") &&
      (selectedCaseType.includes(tncourts.case_type) || selectedCaseType.length === 0);

    const exportToCSV = () => {
      // Filter the data based on the selected filters
      const filteredData = data.filter((item) => isTnCourtsSelected(item));
    
      // Create a CSV string from the filtered data
      const csvData = Papa.unparse(filteredData);
    
      // Create a Blob object containing the CSV data
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    
      // Create a temporary URL for downloading the Blob
      const url = window.URL.createObjectURL(blob);
    
      // Create a temporary link element for initiating the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${tableName}_${selectedDate}_${selectedCaseType}_filtered_data.csv`);
    
      // Trigger a click event to download the CSV file
      link.click();
    
      // Release the temporary URL and link
      window.URL.revokeObjectURL(url);
    };

  return (
    <div className="bg-white p-8 h-full rounded-3xl border shadow-2xl">

      <div>
        <Flex className="space-x-0.5" justifyContent="start" alignItems="center">
          <Title className="uppercase"> { tableName.replace('_', ' ') } </Title>
          <Icon
            icon={InformationCircleIcon}
            variant="simple"
            tooltip={`Items in ${tableName} table`}
          />
        </Flex>
      </div>

      <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 mt-2 items-center justify-between w-full">

        <div className="flex flex-col items-center justify-center lg:justify-start lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 mt-2 w-full lg:w-4/5">
          <MultiSelect
            className="w-full lg:w-1/2"
            onValueChange={setSelectedCaseType}
            placeholder="Select Case Type..."
            >
            {[...new Set(data.map((item) => item.case_type))].map((caseType) => (
                <MultiSelectItem key={caseType} value={caseType}>
                {caseType}
                </MultiSelectItem>
            ))}
          </MultiSelect>

          
          <Select className="max-w-full sm:max-w-xs" onValueChange={setSelectedDate} placeholder="Select Date...">
              {[...new Set(data.map((item) => item.date_ran))].map((date) => (
                  <SelectItem key={date} value={date}>
                      {date}
                  </SelectItem>
              ))}
          </Select>

        </div>

        <button className="mt-4 bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-dark hover:bg-opacity-90 flex items-center justify-center space-x-2 group" onClick={exportToCSV}>
          <p>Export CSV</p>
          <ArrowCircleDownIcon className="h-8 w-8 transform group-hover:animate-bounce" />
        </button>

      </div>

      <Table className="mt-4 h-[65%] sm:h-[80%] 2xl:h-[87%] border rounded-xl">

        <TableHead className="bg-primary">
            <TableRow>
                {tableHeader.map((item, index) => (
                    <TableHeaderCell key={index} className={`uppercase text-white text-center ${index === 0 ? '' : ''}`}>
                        {item.replace('_', ' ')}
                    </TableHeaderCell>
                ))}
            </TableRow>
        </TableHead>

        <TableBody className="font-semibold text-tremor-content-emphasis">
          {data
            .filter((item) => isTnCourtsSelected(item))
            .map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.date_ran}</TableCell>
                <TableCell className="text-center">{item.case_type}</TableCell>
                <TableCell className="text-center">{item.case_name}</TableCell>
                <TableCell className="text-center">{item.case_style}</TableCell>
                <TableCell className="text-center">{item.filing_date}</TableCell>
                <TableCell className="text-center">{item.filing_type.replace(/ \|\|/g, ',')}</TableCell>
                <TableCell className="text-center">{item.address}</TableCell>
                <TableCell className="text-center">{item.details}</TableCell>
                <TableCell className="text-center">{item.url}</TableCell>
              </TableRow>
            ))}
        </TableBody>
        
      </Table>

    </div>
  );
}