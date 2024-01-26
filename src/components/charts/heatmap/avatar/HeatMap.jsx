import { useMemo, useState } from "react";
import * as d3 from "d3";
import { HeatmapLegend } from "./HeatmapLegend";

const MARGIN = { top: 10, right: 10, bottom: 30, left: 30 };

const DataSet = (avatarOccupancy) => {
  const week = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];
  const month = [
    "Dec",
    "Dec-1",
    "Dec-2",
    "Dec-3",
    "Dec-4",
    "Jan",
    "Jan-1",
    "Jan-2",
    "Jan-3",
    "Jan-4",
  ];

  const nCol = month.length;
  const nRow = week.length;

  let data = [];

  for (let x = 0; x < nCol; x++) {
    for (let y = 0; y < nRow; y++) {
      const value = avatarOccupancy ? avatarOccupancy[x][y] + 10 : 10;
      data.push({
        x: month[x],
        y: week[y],
        value: value,
      });
    }
  }

  console.log(data);

  return data;
};

export const AvatarHeatmap = (props) => {
  const { avatarOccupancy } = props;

  console.log(avatarOccupancy);

  if (!avatarOccupancy) {
    return null;
  }

  const width = 600;
  const height = 400;

  const data = DataSet(avatarOccupancy);

  // bounds = area inside the axis
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // groups
  const allYGroups = useMemo(() => [...new Set(data.map((d) => d.y))], [data]);
  const allXGroups = useMemo(() => [...new Set(data.map((d) => d.x))], [data]);

  // x and y scales
  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(allXGroups)
      .padding(0.01);
  }, [allXGroups, boundsWidth]); // Remove 'data' and 'width' from the dependency array

  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([boundsHeight, 0])
      .domain(allYGroups.reverse())
      .padding(0.01);
  }, [allYGroups, boundsHeight]);

  const [min, max] = d3.extent(data.map((d) => d.value));

  if (!min || !max) {
    return null;
  }

  // Color scale
  const colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateBlues)
    .domain([min, max]);

  // Build the rectangles
  const allRects = data.map((d, i) => {
    return (
      <rect
        key={i}
        id={d.y + d.x}
        r={4}
        x={xScale(d.x)}
        y={yScale(d.y)}
        width={xScale.bandwidth()}
        height={yScale.bandwidth()}
        opacity={1}
        fill={colorScale(d.value)}
        rx={5}
        stroke={"white"}
      />
    );
  });

  const xLabels = allXGroups.map((name, i) => {
    const xPos = xScale(name) ?? 0;
    return (
      <text
        key={i}
        x={xPos + xScale.bandwidth() / 2}
        y={boundsHeight + 10}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={10}
      >
        {i % 5 === 0 && name}
      </text>
    );
  });

  const yLabels = allYGroups.map((name, i) => {
    const yPos = yScale(name) ?? 0;
    return (
      <text
        key={i}
        x={-5}
        y={yPos + yScale.bandwidth() / 2}
        textAnchor="end"
        dominantBaseline="middle"
        fontSize={10}
      >
        {name}
      </text>
    );
  });

  return (
    <div>
      <svg width={width} height={height + 150}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {allRects}
          {xLabels}
          {yLabels}
        </g>
        <HeatmapLegend
          colorScale={colorScale}
          width={450}
          height={50}
          transStyle={`translate(50, ${height})`}
        />
      </svg>
    </div>
  );
};
