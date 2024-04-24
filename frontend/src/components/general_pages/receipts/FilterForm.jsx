import React, { useState } from "react";

const MonthPicker = ({ setMonth }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setSelectedYear(newYear);
    // Update the month with the new year
    setMonth(`${newYear}-${selectedMonth.toString().padStart(2, "0")}`);
  };

  const handleMonthChange = (event) => {
    const newMonth = event.target.value;
    setSelectedMonth(newMonth);
    // Update the month with the new month
    setMonth(`${selectedYear}-${newMonth.toString().padStart(2, "0")}`);
  };

  // Generate options for years
  const yearOptions = Array.from(
    { length: 20 },
    (_, i) => new Date().getFullYear() - i,
  );

  // Generate options for months
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex items-center space-x-4">
      <select
        value={selectedYear}
        onChange={handleYearChange}
        className="border border-gray-300 rounded-md p-2"
      >
        {yearOptions.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <select
        value={selectedMonth}
        onChange={handleMonthChange}
        className="border border-gray-300 rounded-md p-2"
      >
        {monthOptions.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthPicker;
