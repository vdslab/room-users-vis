import { useMemo, useState } from "react";
import * as d3 from "d3";

import Tooltip from "./Tooltip";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Tokyo");
import ja from "dayjs/locale/ja";
import { HeatmapLegend } from "../HeatMapLegend";

const MARGIN = { top: 10, right: 10, bottom: 30, left: 30 };

export async function getUserName(id) {
  const response = await fetch(`/api/user/${id}`);
  const result = await response.json();
  return result.name;
}

export const Heatmap = (props) => {
  const { data } = props;

  const width = 800;
  const height = 300;

  const [info, setInfo] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState(null);

  if (!data) {
    return <div>loading</div>;
  }
  const days = [
    ...Object.keys(data)
      .sort()
      .map((d) => dayjs(d).tz()),
  ];

  // bounds = area inside the axis
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // groups
  const allYGroups = days.map((d) => d.format("ddd") + ".");
  const allXGroups = [...Array(24).keys()].map((d) => d.toString());

  // x and y scales
  const xScale = d3
    .scaleBand()
    .range([0, boundsWidth])
    .domain(allXGroups)
    .padding(0.01);

  const yScale = d3
    .scaleBand()
    .range([0, boundsHeight])
    .domain(allYGroups)
    .padding(0.01);

  const [min, max] = d3.extent(
    Object.values(data)
      .map((d) => Object.values(d).map((e) => e.length))
      .flat(),
  );

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
  const allRects = Object.entries(data).map(([day, h_data], i) => {
    return Object.entries(h_data).map(([hour, d], i) => {
      const datetime = dayjs(day + hour).tz();

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
          title: d.length + "人",
          info: (
            <>
              {datetime.locale(ja).format("YYYY/MM/DD（ddd）HH時")} <br />
              {d.map((id) => (
                <div key={id}>{getUserName(id)}</div>
              ))}
            </>
          ),
        });
      };

      const handleMouseLeave = (event) => {
        event.target.setAttribute("stroke", "white");
        event.target.setAttribute("stroke-width", 1);
        setInfo(null);
      };

      return (
        <rect
          key={datetime.format("YYYY-MM-DD-HH-mm")}
          id={datetime.format("YYYY-MM-DD-HH-mm")}
          r={4}
          x={xScale(datetime.format("H"))}
          y={yScale(dayjs(day).tz().format("ddd") + ".")}
          width={xScale.bandwidth()}
          height={yScale.bandwidth()}
          fill={colorScale(d.length)}
          opacity={1}
          rx={5}
          stroke={"white"}
          strokeWidth={1}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          // onClick={handleMouseClick}
        />
      );
    });
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
          width={250}
          height={40}
          transStyle={`translate(250, ${height + 50})`}
          moreStyle={`translate(330, 25)`}
          lessStyle={`translate(-50, 25)`}
        />
      </svg>
      <Tooltip pos={pos} info={info} />
    </div>
  );
};
