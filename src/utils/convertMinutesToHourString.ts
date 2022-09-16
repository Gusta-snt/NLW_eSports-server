function convertMinutesToHourString(minutes: number) {
  const integerPart = Math.trunc(minutes / 60)
  const hours = `${String(integerPart).padStart(2, "0")}:${String(minutes - (integerPart * 60)).padStart(2,"0")}` 
  return hours
}

export default convertMinutesToHourString;
