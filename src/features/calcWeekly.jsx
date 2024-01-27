// 滞在時間を計算する関数
const calculateTotalTime = (checkIn, checkOut) => {
  const checkInTime = new Date(checkIn).getTime();
  const checkOutTime = new Date(checkOut).getTime();
  const totalTime = checkOutTime - checkInTime;

  return totalTime;
};

// ランキングデータを計算する関数
export const CalculateTotalRanking = (data) => {
  const totalRank = data.reduce((acc, entry) => {
    const studentId = entry.user_id;
    const totalTime = calculateTotalTime(entry.check_in, entry.check_out);

    acc[studentId] = (acc[studentId] || 0) + totalTime;
    return acc;
  }, {});

  return Object.entries(totalRank)
    .map(([studentId, totalTime]) => ({
      studentId,
      studentName: studentId,
      totalTime,
    }))
    .sort((a, b) => b.totalTime - a.totalTime);
};
