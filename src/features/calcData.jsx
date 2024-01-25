export const ranking = (test) => {
  const data = filterByYearMonth(test, 2023, 12);

  const entranceCounts = {};

  for (const entry of data) {
    const studentId = entry["学籍番号"];
    const entryTime = new Date(entry["日時"]);

    if (entryTime) {
      const monthKey = entryTime.toISOString().slice(0, 7);
      if (!entranceCounts[studentId]) {
        entranceCounts[studentId] = {};
      }
      if (!entranceCounts[studentId][monthKey]) {
        entranceCounts[studentId][monthKey] = new Set();
      }
      entranceCounts[studentId][monthKey].add(
        entryTime.toISOString().slice(8, 10),
      );
    }
  }

  const studentLookup = Object.fromEntries(
    data.map((student) => [student["学籍番号"], student["氏名"]]),
  );

  return Object.entries(entranceCounts)
    .map(([studentId, entranceCounts]) => {
      const totalDays = Object.values(entranceCounts).reduce(
        (acc, daySet) => acc + daySet.size,
        0,
      );

      const studentName = studentLookup[studentId] || "Unknown";
      return { studentId, studentName, totalDays };
    })
    .sort((a, b) => b.totalDays - a.totalDays);
};

export const timeSpentRanking = (test) => {
  const data = filterByYearMonth(test, 2023, 12);

  const roomTimeData = {};

  data.forEach((entry) => {
    const studentId = entry["学籍番号"];
    const studentName = entry["氏名"];
    const entryTime = new Date(entry["日時"]);
    const isEntrance = entry["入退出状態"] === "入室状態";

    if (isEntrance) {
      if (!roomTimeData[studentId]) {
        roomTimeData[studentId] = {
          studentName,
          totalTimeSpent: 0,
          days: {},
        };
      }
      roomTimeData[studentId].entranceTime = entryTime;
    } else {
      if (roomTimeData[studentId] && roomTimeData[studentId].entranceTime) {
        const exitTime = entryTime;
        const timeSpent = exitTime - roomTimeData[studentId].entranceTime;

        const dayKey = entryTime.toISOString().slice(0, 10);
        roomTimeData[studentId].days[dayKey] =
          (roomTimeData[studentId].days[dayKey] || 0) + timeSpent;
        roomTimeData[studentId].totalTimeSpent += timeSpent;

        roomTimeData[studentId].entranceTime = null;
      }
    }
  });

  return Object.entries(roomTimeData)
    .map(([studentId, data]) => {
      const totalTimeSpent = Object.entries(data.days)
        .filter(([dayKey]) => dayKey.startsWith(`2023-12`))
        .reduce((acc, [, dayTotalTime]) => acc + dayTotalTime, 0);

      const studentName = data.studentName || "Unknown";
      const entranceMonth = new Date(data.entranceTime).getMonth() + 1;

      const monthData = Object.entries(data.days)
        .filter(([dayKey]) => dayKey.startsWith(`2023-${entranceMonth}`))
        .reduce((acc, [dayKey, dayTotalTime]) => {
          acc[dayKey] = dayTotalTime;
          return acc;
        }, {});

      return {
        studentId,
        studentName,
        totalTimeSpent,
        month: 12,
        days: monthData,
      };
    })
    .sort((a, b) => b.totalTimeSpent - a.totalTimeSpent);
};

// TEST_DATAから、年月のフィルターをかける
function filterByYearMonth(data, year, month) {
  return data.filter((entry) => {
    const entryTime = new Date(entry["日時"]);
    return (
      entryTime.getFullYear() === year && entryTime.getMonth() + 1 === month
    );
  });
}
