import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WeatherData {
  base: string;
  clouds: {
    all: number;
  };
  cod: number;
  coord: {
    lat: number;
    lon: number;
  };
  dt: number;
  id: number;
  main: {
    feels_like: number;
    grnd_level: number;
    humidity: number;
    pressure: number;
    sea_level: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  name: string;
  sys: {
    country: string;
    id: number;
    sunrise: number;
    sunset: number;
    type: number;
  };
  timezone: number;
  visibility: number;
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
}

interface CityWeather {
  name: string;
  lat: number;
  lon: number;
  weather: WeatherData;
}

interface CitiesStore {
  cityWeathers: CityWeather[];
  addCity: (city: CityWeather) => void;
  removeCity: (name: string) => void;
  updateCityWeather: (name: string, weather: WeatherData) => void;
}

export const useCitiesStore = create<CitiesStore>()(
  persist(
    (set, get) => ({
      cityWeathers: [],
      addCity: (city) => {
        const exists = get().cityWeathers.some(
          (c) => c.name.toLowerCase() === city.name.toLowerCase(),
        );
        if (!exists) {
          set((state) => ({
            cityWeathers: [...state.cityWeathers, city],
          }));
        }
      },
      removeCity: (name) => {
        set((state) => ({
          cityWeathers: state.cityWeathers.filter(
            (city) => city.name.toLowerCase() !== name.toLowerCase(),
          ),
        }));
      },
      updateCityWeather: (name, weather) => {
        set((state) => ({
          cityWeathers: state.cityWeathers.map((city) =>
            city.name.toLowerCase() === name.toLowerCase()
              ? { ...city, weather }
              : city,
          ),
        }));
      },
    }),
    {
      name: "city-weather-store",
    },
  ),
);
