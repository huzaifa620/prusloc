import { useState, useEffect } from "react";
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
import { InformationCircleIcon } from "@heroicons/react/solid";

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
  }, [data, selectedDate, selectedTdnNo, selectedOccurrence]);

  const isForeclosureSelected = (foreclosures: Foreclosure) => {
    const isDateSelected =
      selectedDate === "all" || foreclosures.date_ran.split("T")[0] === selectedDate;
  
    const isTdnNoSelected =
      selectedTdnNo.length === 0 || selectedTdnNo.includes(foreclosures.tdn_no);
  
    const isOccurrenceSelected =
      selectedOccurrence === 0 || foreclosures.occurrence === selectedOccurrence;
  
    return isDateSelected && isTdnNoSelected && isOccurrenceSelected;
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
      <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 mt-2">
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
