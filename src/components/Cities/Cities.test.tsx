import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Cities from "./Cities";
import { useCitiesStore } from "@/store/useCitiesStore";
import { useRouter } from "next/navigation";
import { fetchWithApiKey } from "@/api/fetchWithApiKey";
import { useQuery } from "@tanstack/react-query";

jest.mock("@/store/useCitiesStore");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/api/fetchWithApiKey");
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

describe("Cities component", () => {
  const mockAddCity = jest.fn();
  const mockRemoveCity = jest.fn();
  const mockUpdateCityWeather = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    (useCitiesStore as unknown as jest.Mock).mockReturnValue({
      cityWeathers: [],
      addCity: mockAddCity,
      removeCity: mockRemoveCity,
      updateCityWeather: mockUpdateCityWeather,
    });

    (useQuery as jest.Mock).mockReturnValue({
      refetch: jest.fn().mockResolvedValue({
        data: [{ name: "Paris", lat: 48.8566, lon: 2.3522 }],
      }),
    });

    (fetchWithApiKey as jest.Mock).mockResolvedValue({
      main: { temp: 300 },
      weather: [{ main: "Sunny" }],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders input and button", () => {
    render(<Cities />);
    expect(screen.getByPlaceholderText("Add city")).toBeInTheDocument();
    expect(screen.getByText("Add city")).toBeDisabled();
  });

  it("enables button when input has value", () => {
    render(<Cities />);
    fireEvent.change(screen.getByPlaceholderText("Add city"), {
      target: { value: "Paris" },
    });
    expect(screen.getByText("Add city")).not.toBeDisabled();
  });

  it("calls addCity after adding a new city", async () => {
    render(<Cities />);
    const input = screen.getByPlaceholderText("Add city");
    const button = screen.getByText("Add city");

    fireEvent.change(input, { target: { value: "Paris" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAddCity).toHaveBeenCalledWith({
        name: "Paris",
        lat: 48.8566,
        lon: 2.3522,
        weather: {
          main: { temp: 300 },
          weather: [{ main: "Sunny" }],
        },
      });
    });
  });
});
