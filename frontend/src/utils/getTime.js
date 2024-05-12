const getTime = (dateString) => {
  const date = new Date(dateString);
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Add leading zero if needed
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return hours + ":" + minutes;
};

export function formatDate(dateString) {
  if (dateString === null || dateString === undefined) dateString = new Date();
  const date = new Date(dateString);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = daysOfWeek[date.getDay()];

  let day = date.getDate();
  let month = date.getMonth() + 1; // Month is zero-indexed, so add 1
  let year = date.getFullYear() % 100; // Get last two digits of the year

  // Add leading zero if needed
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  year = year < 10 ? "0" + year : year;

  return dayOfWeek + ", " + day + "/" + month + "/" + year;
}
export default getTime;
