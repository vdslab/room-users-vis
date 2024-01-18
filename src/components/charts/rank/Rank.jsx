import { RankBar } from "./RankBar";

export const Rank = (props) => {
  const { data, timeUnit } = props;

  if (data === null) {
    return (
      <div>
        <p>loading</p>
      </div>
    );
  }

  const limitedData = data;
  const maxData = data.slice(0, 1);

  let maxTotal;
  if (timeUnit === "日数") {
    maxTotal = maxData[0].totalDays;
  } else {
    maxTotal = Math.floor(maxData[0].totalTime / (1000 * 60 * 60));
  }

  return (
    <>
      {limitedData
        .filter((item) =>
          timeUnit === "日数" ? item.totalDays > 0 : item.totalTime > 0,
        )
        .map((item, index) => (
          <RankBar
            maxTotal={maxTotal}
            name={item.studentName}
            total={
              timeUnit === "日数"
                ? item.totalDays
                : (item.totalTime / (1000 * 60 * 60)).toFixed(2)
            }
            label={timeUnit === "日数" ? "日" : "h"}
            index={index}
            key={index}
          />
        ))}
    </>
  );
};
