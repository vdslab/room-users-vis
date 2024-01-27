export const createFriedShipRank = (data) => {
  return data.map(([studentId, totalTime]) => {
    return {
      studentId: studentId,
      studentName: studentId,
      totalTime: totalTime,
    };
  });
};

export const convertData = (userData) => {
  const weeklyData = Array.from({ length: 10 }, () => Array(7).fill(0));

  userData.forEach(({ check_in, check_out }) => {
    const checkInDate = new Date(check_in);
    const dayOfWeek = checkInDate.getDay(); // 0 (Sunday) to 6 (Saturday)

    let initMonth = 0;
    if (checkInDate.getMonth() + 1 === 12) {
      initMonth = checkInDate.getDate() + 3;
    } else {
      initMonth = checkInDate.getDate();
    }
    let weekOfMonth = Math.floor(initMonth / 7);
    if (checkInDate.getMonth() + 1 === 1) {
      weekOfMonth += 5;
    }

    weeklyData[weekOfMonth][dayOfWeek] += new Date(check_out) - checkInDate;
  });

  return weeklyData;
};
