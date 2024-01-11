import { RankBar } from "./RankBar";

export const Rank = (props) => {

  const { data, timeUnit } = props
  console.log(props)

  const limitedData = data.slice(0, 5);
  const maxData = data.slice(0, 1);

  let maxTotal;
  if(timeUnit === '日数'){
    maxTotal = maxData[0].totalDays;
  } else {
    maxTotal = Math.floor(maxData[0].totalTimeSpent/(1000*60*60));
  }

  return (
    <>
      {limitedData.map((item, index) =>
        <RankBar
          maxTotal={maxTotal}
          name={item.studentName}
          total={ timeUnit==='日数'? item.totalDays : Math.floor(item.totalTimeSpent/(1000*60*60))}
          timeUnit={timeUnit}
          index={index}
          key={index}/>
      )}
    </>
  );
};
