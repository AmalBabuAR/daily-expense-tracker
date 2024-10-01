import { data } from "autoprefixer";

export const getCurrentDateTime = () => {
  const current = new Date();
  const year = current.getFullYear();
  const month = String(current.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const day = String(current.getDate()).padStart(2, "0");
  const hours = String(current.getHours()).padStart(2, "0");
  const minutes = String(current.getMinutes()).padStart(2, "0");
  const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
  return currentDateTime;
};

const today = new Date();
const startOfWeek = new Date(today);
startOfWeek.setDate(startOfWeek.getDate() - 1);

const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(endOfWeek.getDate() - 6);

const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

export const filteredByToday = (data) => {
  const response = data
    .filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.toDateString() === today.toDateString();
    })
    .map((transaction) => {
      const transactionDate = new Date(transaction.date);
      // Format the date to show only time (HH:MM)
      const time = transactionDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      return { ...transaction, date: time }; // Add formatted time to the response
    });
  return response;
};

const normalizedDateCon = (date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
};

export const filteredByWeek = (data) => {
  const response = data
    .filter((transaction) => {
      const transactionDate = new Date(transaction.date);

      // Normalize times to start of the day (midnight) by setting hours, minutes, and seconds to 0
      const normalizedTransactionDate = normalizedDateCon(transactionDate);

      const normalizedStartOfWeek = normalizedDateCon(startOfWeek);

      const normalizedEndOfWeek = normalizedDateCon(endOfWeek);

      return (
        normalizedTransactionDate <= normalizedStartOfWeek &&
        normalizedTransactionDate >= normalizedEndOfWeek
      );
    })
    .map((transaction) => {
      const transactionDate = new Date(transaction.date);

      // Get the day of the week (e.g., "Monday")
      const dayOfWeek = transactionDate.toLocaleDateString("en-US", {
        weekday: "long", // "long" returns full day names like "Monday"
      });

      // Get the formatted date (e.g., "2024-09-30")
      // const formattedDate = transactionDate.toISOString().split("T")[0];

      // // Combine the day and date
      // const dayAndDate = `${dayOfWeek}, ${formattedDate}`;

      // Replace the 'date' field with the combined string
      return { ...transaction, date: dayOfWeek, transactionDate }; // Add original date for sorting
    })
    .sort((a, b) => b.transactionDate - a.transactionDate);
  return response;
};

export const filteredByMonth = (data) => {
  const today = new Date(); // Ensure today is defined

  const response = data
    .filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate.getFullYear() === today.getFullYear();
    })
    .map((record) => {
      const recordDate = new Date(record.date);

      // Get the month name and year (e.g., "September 2024")
      const monthName = recordDate.toLocaleDateString("en-US", {
        month: "long",
      });
      const year = recordDate.getFullYear();
      const day = recordDate.getDate();

      // Combine month name, year, and day (e.g., "30 September 2024")
      const monthYear = `${day} ${monthName} ${year}`;

      // Return the record with the new date field
      return { ...record, date: monthYear, originalDate: recordDate }; // Add originalDate for sorting
    })
    .sort((a, b) => {
      // Compare the original date objects for accurate sorting
      return b.originalDate - a.originalDate; // Sort by date in descending order
    })
    .map((record) => {
      // Clean up the record by removing the original date if not needed
      const { originalDate, ...cleanedRecord } = record;
      return cleanedRecord;
    });

  return response;
};



export const checkingDate = (date) => {
  const checkingDate = new Date(date);

  const normalizedDateChecking = normalizedDateCon(checkingDate);
  const normalizedStartOfWeek = normalizedDateCon(startOfWeek);
  const normalizedEndOfWeek = normalizedDateCon(endOfWeek);

  if (checkingDate === today) {
    return "today";
  } else if (
    normalizedDateChecking <= normalizedStartOfWeek &&
    normalizedDateChecking >= normalizedEndOfWeek
  ) {
    return "week";
  } else {
    return "month";
  }
};
