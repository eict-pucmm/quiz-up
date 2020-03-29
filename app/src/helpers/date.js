export default function(date) {
  const fullDate = new Date(date);
  let dd = fullDate.getDate();

  let mm = fullDate.getMonth() + 1;
  const yyyy = fullDate.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }

  if (mm < 10) {
    mm = `0${mm}`;
  }

  return `${dd}/${mm}/${yyyy}`;
}
