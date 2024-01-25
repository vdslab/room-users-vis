import { useMemo, useState } from "react";
import * as d3 from "d3";

import Tooltip from "./Tooltip";

const MARGIN = { top: 10, right: 10, bottom: 30, left: 30 };

const DataSet = (hourlyOccupancy) => {
  const nCol = 24;
  const nRow = 7;

  const week = ["Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat.", "Sun."];

  const hour = [];
  for (let i = 0; i <= 24; i++) {
    hour.push(i);
  }

  let data = [];

  for (let x = 0; x < nCol; x++) {
    for (let y = 0; y < nRow; y++) {
      const value = hourlyOccupancy ? hourlyOccupancy[y][x] + 10 : 0;
      data.push({
        x: hour[x],
        y: week[y],
        value: value,
      });
    }
  }

  return data;
};

export const Heatmap = (props) => {
  const { hourlyOccupancy } = props;

  const width = 800;
  const height = 300;

  const [info, setInfo] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const data = DataSet(hourlyOccupancy);

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
  }, [data, width]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([boundsHeight, 0])
      .domain(allYGroups)
      .padding(0.01);
  }, [data, height]);

  const [min, max] = d3.extent(data.map((d) => d.value));

  if (!min || !max) {
    return null;
  }

  // Color scale
  const colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateGreens)
    .domain([min, max]);

  const weekJa = {
    "Mon.": "月曜日",
    "Tue.": "火曜日",
    "Wed.": "水曜日",
    "Thu.": "木曜日",
    "Fri.": "金曜日",
    "Sat.": "土曜日",
    "Sun.": "日曜日",
  };

  // Build the rectangles
  const allRects = data.map((d, i) => {
    const handleMouseOver = (event) => {
      event.target.setAttribute("stroke", "black");
      event.target.setAttribute("stroke-width", 2);

      event.target.parentNode.appendChild(event.target);

      // Tooltip
      setPos({
        x: event.pageX,
        y: event.pageY,
      });
      setInfo({
        title: weekJa[d.y] + " " + d.x + "時",
        info: d.value + "人 （詳細はクリック）",
      });
    };

    const handleMouseLeave = (event) => {
      event.target.setAttribute("stroke", "white");
      event.target.setAttribute("stroke-width", 1);

      // Tooltip
      setInfo(null);
    };

    const handleMouseClick = (event) => {};

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
        strokeWidth={1}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        onClick={handleMouseClick}
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
        {name}
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
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {allRects}
          {xLabels}
          {yLabels}
        </g>
      </svg>
      <Tooltip pos={pos} info={info} />
    </div>
  );
};
