import React from "react";
import { useRouter } from "next/navigation";
import { CityCard } from "@/components/CityCard/CityCard";
import { useCities } from "@/hooks/useCities";
import sharedStyles from "@/shared/sharedStyles.module.scss";
import styles from "./Cities.module.scss";

export default function Cities() {
  const router = useRouter();
  const {
    city,
    setCity,
    errorMessage,
    cityWeathers,
    onAddCity,
    handleRemoveCity,
    handleRefreshWeather,
  } = useCities();

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
                        router.push(`/city/${entry.name}?lat=${entry.lat}&lon=${entry.lon}`)
                    }
                    onRemove={() => handleRemoveCity(entry.name)}
                    onRefresh={() => handleRefreshWeather(entry.name, entry.lat, entry.lon)}
                />
              </div>
          ))}
        </div>
      </div>
  );
}
