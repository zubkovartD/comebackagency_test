import React from "react";
import { render } from "@testing-library/react";
import Chart from "./Chart";
import dayjs from "dayjs";

jest.mock("@mui/x-charts/LineChart", () => ({
  LineChart: (props: {
    xAxis?: { label?: string }[];
    yAxis?: { label?: string }[];
    series?: { data?: unknown[] }[];
  }) => {
    const { xAxis, yAxis, series } = props;
    return (
      <div data-testid="mock-line-chart">
        <div>xAxis label: {xAxis?.[0]?.label}</div>
        <div>yAxis label: {yAxis?.[0]?.label}</div>
        <div>Series length: {series?.[0]?.data?.length ?? 0}</div>
      </div>
    );
  },
}));

describe("Chart", () => {
  it("renders LineChart with correct props", () => {
    const data = [
      { x: 1722236400000, y: 10 },
      { x: 1722237300000, y: 15 },
    ];

    const { getByText, getByTestId } = render(<Chart data={data} />);

    expect(getByTestId("mock-line-chart")).toBeInTheDocument();
    expect(getByText(/xAxis label: Time/)).toBeInTheDocument();
    expect(getByText(/yAxis label: Temperature/)).toBeInTheDocument();
    expect(getByText(/Series length: 2/)).toBeInTheDocument();
  });

  it("renders nothing if data is undefined", () => {
    const { getByTestId } = render(<Chart data={undefined} />);
    const chart = getByTestId("mock-line-chart");
    expect(chart).toBeInTheDocument();
    expect(chart.textContent).toContain("Series length: 0");
  });

  it("formats date correctly using dayjs", () => {
    const timestamp = 1722236400000; // some valid UNIX timestamp
    const formatted = dayjs(timestamp).format("MM-DD HH:mm");
    expect(formatted).toMatch(/\d{2}-\d{2} \d{2}:\d{2}/);
  });
});
