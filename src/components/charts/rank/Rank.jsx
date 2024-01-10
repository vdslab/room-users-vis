import { RankBar } from "./RankBar";

export const Rank = (props) => {

  const { data } = props
  console.log(props)

  const limitedData = data.slice(0, 5);
  const maxData = data.slice(0, 1);

  return (
    <>
      {limitedData.map((item, index) =>
        <RankBar maxTotal={maxData[0].totalDays} data={item} index={index} key={index}/>
      )}
    </>
  );
};
