import React, { useEffect, useState } from "react";
import styles from "./index.scss";

const quarterOptions = [
  {
    id: "q1",
    text: "January 1 - March 31",
    value: 1,
  },
  {
    id: "q2",
    text: "April 1 - June 30",
    value: 2,
  },
  {
    id: "q3",
    text: "July 1 - September 30",
    value: 3,
  },
  {
    id: "q4",
    text: "October 1 - December 31",
    value: 4,
  },
];

const QuarterPickerComponent = ({ changeCallback }) => {
  const getCurrentQuarter = () => {
    const month = new Date().getMonth() + 1;

    switch (true) {
      case month <= 3:
        return quarterOptions[0];
      case month <= 6:
        return quarterOptions[1];
      case month <= 9:
        return quarterOptions[2];
      default:
        return quarterOptions[3];
    }
  };

  const [year, setYear] = React.useState<number>(new Date().getFullYear());
  const [quarter, setQuarter] = React.useState(getCurrentQuarter().value);
  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= currentYear - 19; year--) {
      setYearOptions((prev) => [
        ...prev,
        { value: year, label: year.toString() },
      ]);
    }
    updateDateRange(currentYear, getCurrentQuarter().value.toString());
  }, []);

  const handleYearChange = (e) => {
    setYear(e.target.value);
    updateDateRange(e.target.value, String(quarter));
  };

  const handleQuarterChange = (e) => {
    setQuarter(e.target.value);
    updateDateRange(year, e.target.value);
  };

  const updateDateRange = (year: number, quarter: string) => {
    let startDate, endDate;
    switch (parseInt(quarter)) {
      case 1:
        startDate = `${year}-01-01`;
        endDate = `${year}-03-31`;
        break;
      case 2:
        startDate = `${year}-04-01`;
        endDate = `${year}-06-30`;
        break;
      case 3:
        startDate = `${year}-07-01`;
        endDate = `${year}-09-30`;
        break;
      case 4:
        startDate = `${year}-10-01`;
        endDate = `${year}-12-31`;
        break;
      default:
        startDate = "";
        endDate = "";
    }
    changeCallback({ start: startDate, end: endDate });
  };

  return (
    <div className={styles.quarterPickerParent}>
      <select onChange={handleYearChange} value={year} name="Year" id="year">
        {yearOptions.map((option, index) => (
          <option key={index} {...option}>
            {option.label}
          </option>
        ))}
        <option />
      </select>
      <select
        onChange={handleQuarterChange}
        value={quarter}
        name="quarter"
        id="quarter"
      >
        {quarterOptions.map((option, index) => (
          <option key={index} {...option}>
            {option.text}
          </option>
        ))}
        <option />
      </select>
    </div>
  );
};

export default QuarterPickerComponent;
