"use client";

import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import dayjs from "dayjs";
import styles from "./Chart.module.scss";

interface ChartProps {
  data?: { x: number; y: number }[];
}

export default function Chart({ data }: ChartProps) {
  const xAxisData = data ? data.map((point) => point.x) : [];
  const seriesData = data ? data.map((point) => point.y) : [];

  return (
    <div className={styles.container}>
      <LineChart
        xAxis={[
          {
            data: xAxisData,
            valueFormatter: (value: number) =>
              dayjs(value).format("MM-DD HH:mm"),
            label: "Time (local time)",
          },
        ]}
        yAxis={[
          {
            label: "Temperature (°C)",
          },
        ]}
        series={[
          {
            data: seriesData,
            area: true,
          },
        ]}
        height={300}
      />
    </div>
  );
}
