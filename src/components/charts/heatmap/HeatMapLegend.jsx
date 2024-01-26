import * as d3 from "d3";

export const HeatmapLegend = (props) => {
  const { colorScale, width, height, transStyle, lessStyle, moreStyle } = props;

  const legendScale = d3
    .scaleLinear()
    .domain(colorScale.domain())
    .range([0, width]);

  const legendRects = colorScale
    .ticks(5)
    .map((value, index) => (
      <rect
        key={index}
        x={legendScale(value)}
        y={0}
        width={width / 5}
        height={height}
        fill={colorScale(value)}
      />
    ));

  // const legendLabels = colorScale.ticks(5).map((value, index) => (
  //   <text
  //     key={index}
  //     x={legendScale(value) + width / 5 / 2}
  //     y={height + 20}
  //     textAnchor="middle"
  //     dominantBaseline="middle"
  //     fontSize={10}
  //   >
  //     {value.toFixed(2)}
  //   </text>
  // ));

  return (
    <g transform={transStyle}>
      <text transform={moreStyle}>more</text>
      {legendRects}
      <text transform={lessStyle}>less</text>
    </g>
  );
};
