import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";

const DateRangePicker = ({ setMonth }) => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const handleFromDateChange = (date) => {
    setFromDate(date);
    if (toDate) {
      setMonth(`${date.toISOString()} ${toDate.toISOString()}`);
    }
  };

  const handleToDateChange = (date) => {
    setToDate(date);
    if (fromDate) {
      setMonth(`${fromDate.toISOString()} ${date.toISOString()}`);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker", "DatePicker"]}>
          <DatePicker
            label="From"
            value={fromDate}
            onChange={handleFromDateChange}
            required
          />
          <DatePicker label="To" value={toDate} onChange={handleToDateChange} />
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
};

export default DateRangePicker;
