import React from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import styles from "./City.module.scss";
import sharedStyles from "@/shared/sharedStyles.module.scss";

interface CityCardProps {
  name: string;
  lat: number;
  lon: number;
  weather: {
    main: { temp: number };
    weather: { main: string }[];
  };
  onView: () => void;
  onRemove: () => void;
  onRefresh: () => void;
}

export function CityCard({
  name,
  weather,
  onView,
  onRemove,
  onRefresh,
}: CityCardProps) {
  return (
    <div className={styles.cityCard}>
      <button onClick={onView} className={sharedStyles.primaryButton}>
        View this city
      </button>

      <IconButton
        aria-label="delete"
        size="small"
        onClick={onRemove}
        style={{ position: "absolute", top: 4, right: 4 }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <IconButton
        aria-label="refresh"
        size="small"
        onClick={onRefresh}
        style={{ position: "absolute", top: 4, right: 32 }}
      >
        <RefreshIcon fontSize="small" />
      </IconButton>

      <h3>{name}</h3>
      <p>Temp: {weather?.main?.temp}°K</p>
      <p>Weather: {weather?.weather[0]?.main}</p>
    </div>
  );
}
