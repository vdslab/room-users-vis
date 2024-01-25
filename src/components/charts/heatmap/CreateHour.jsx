export const CreateHourlyTimeStringArray = (startTime, endTime) => {
  const result = [];
  let currentHour = new Date(startTime);

  while (currentHour <= endTime) {
    const formattedHour = currentHour.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
    });

    result.push(formattedHour);
    currentHour.setHours(currentHour.getHours() + 1);
  }

  return result;
};

// // 使用例
// const startTime = new Date('2023-01-01T00:00:00');
// const endTime = new Date('2023-01-01T23:00:00');
// const hourlyTimeStringArray = generateHourlyTimeStringArray(startTime, endTime);

// console.log(hourlyTimeStringArray);
