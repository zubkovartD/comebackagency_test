import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CityCard } from "./CityCard";

describe("CityCard", () => {
  const mockProps = {
    name: "Kyiv",
    lat: 50.45,
    lon: 30.52,
    weather: {
      main: { temp: 293.15 },
      weather: [{ main: "Clear" }],
    },
    onView: jest.fn(),
    onRemove: jest.fn(),
    onRefresh: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders city name, temperature and weather", () => {
    render(<CityCard {...mockProps} />);

    expect(screen.getByText(/Kyiv/i)).toBeInTheDocument();
    expect(screen.getByText(/Temp: 293.15°K/)).toBeInTheDocument();
    expect(screen.getByText(/Weather: Clear/)).toBeInTheDocument();
  });

  it('calls onView when "View this city" button is clicked', () => {
    render(<CityCard {...mockProps} />);
    fireEvent.click(screen.getByText(/View this city/i));
    expect(mockProps.onView).toHaveBeenCalledTimes(1);
  });

  it("calls onRemove when close icon is clicked", () => {
    render(<CityCard {...mockProps} />);
    const closeBtn = screen.getByLabelText("delete");
    fireEvent.click(closeBtn);
    expect(mockProps.onRemove).toHaveBeenCalledTimes(1);
  });

  it("calls onRefresh when refresh icon is clicked", () => {
    render(<CityCard {...mockProps} />);
    const refreshBtn = screen.getByLabelText("refresh");
    fireEvent.click(refreshBtn);
    expect(mockProps.onRefresh).toHaveBeenCalledTimes(1);
  });
});
