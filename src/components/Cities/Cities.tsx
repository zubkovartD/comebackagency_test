import React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWithApiKey } from "@/api/fetchWithApiKey";
import { useCitiesStore } from "@/store/useCitiesStore";
import { useRouter } from "next/navigation";
import { CityCard } from "@/components/CityCard/CityCard";
import sharedStyles from "@/shared/sharedStyles.module.scss";
import styles from "./Cities.module.scss";

export default function Cities() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [city, setCity] = useState("");
  const { cityWeathers, addCity, removeCity, updateCityWeather } =
    useCitiesStore();

  const { refetch } = useQuery({
    queryKey: ["city", city],
    queryFn: () =>
      fetchWithApiKey(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5`,
      ),
    enabled: false,
  });

  async function onAddCity() {
    setErrorMessage("")
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    const exists = cityWeathers.some(
      (item) => item.name.toLowerCase() === trimmedCity.toLowerCase(),
    );
    if (exists) return;

    try {
      const result = await refetch();
      const locations = result.data;
      if (!locations || locations.length === 0) return;

      const { name, lat, lon } = locations[0];
      const weather = await fetchWithApiKey(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
      );

      addCity({ name, lat, lon, weather });
      setCity("");
    } catch {
      setErrorMessage("Failed to add city. Try again.");
    }
  }

  const handleRemoveCity = (name: string) => {
    removeCity(name);
  };

  const handleRefreshWeather = async (
    name: string,
    lat: number,
    lon: number,
  ) => {
    try {
      const weather = await fetchWithApiKey(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
      );
      updateCityWeather(name, weather);
    } catch {
      setErrorMessage("Failed to refresh weather data. Try again.");
    }
  };

  return (
    <div className={styles.container}>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      <input
        placeholder="Add city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className={styles.input}
      />
      <button
        className={sharedStyles.primaryButton}
        onClick={onAddCity}
        disabled={!city}
        style={{ marginTop: "12px" }}
      >
        Add city
      </button>

      <div style={{ marginTop: "20px" }}>
        {cityWeathers.map((entry) => (
          <div style={{ marginTop: "20px" }} key={entry.name}>
            <CityCard
              name={entry.name}
              lat={entry.lat}
              lon={entry.lon}
              weather={entry.weather}
              onView={() =>
                router.push(
                  `/city/${entry.name}?lat=${entry.lat}&lon=${entry.lon}`,
                )
              }
              onRemove={() => handleRemoveCity(entry.name)}
              onRefresh={() =>
                handleRefreshWeather(entry.name, entry.lat, entry.lon)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
