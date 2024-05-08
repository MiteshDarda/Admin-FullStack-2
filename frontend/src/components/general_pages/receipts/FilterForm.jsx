import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"; // Ensure this is the correct import path

const DateRangePicker = ({ setMonth }) => {
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());

  useEffect(() => {
    setMonth(`${fromDate.toISOString()} ${toDate.toISOString()}`);
  }, [fromDate, toDate]);

  const handleFromDateChange = (newFromDate) => {
    if (newFromDate.isAfter(toDate)) {
      setToDate(newFromDate); // Set "To" date to the new "From" date if it's later
    }
    setFromDate(newFromDate);
  };

  const handleToDateChange = (newToDate) => {
    if (newToDate.isBefore(fromDate)) {
      setFromDate(newToDate); // Set "From" date to the new "To" date if it's earlier
    }
    setToDate(newToDate);
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
            shouldDisableDate={(date) => date.isAfter(toDate)}
          />
          <DatePicker
            label="To"
            value={toDate}
            onChange={handleToDateChange}
            shouldDisableDate={(date) => date.isBefore(fromDate)}
          />
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
};

export default DateRangePicker;
