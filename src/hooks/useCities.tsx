import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWithApiKey } from "@/api/fetchWithApiKey";
import { useCitiesStore } from "@/store/useCitiesStore";

export function useCities() {
    const [city, setCity] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { cityWeathers, addCity, removeCity, updateCityWeather } = useCitiesStore();

    const { refetch } = useQuery({
        queryKey: ["city", city],
        queryFn: () =>
            fetchWithApiKey(
                `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5`,
            ),
        enabled: false,
    });

    const onAddCity = async () => {
        setErrorMessage("");
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
    };

    const handleRemoveCity = (name: string) => {
        removeCity(name);
    };

    const handleRefreshWeather = async (name: string, lat: number, lon: number) => {
        try {
            const weather = await fetchWithApiKey(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
            );
            updateCityWeather(name, weather);
        } catch {
            setErrorMessage("Failed to refresh weather data. Try again.");
        }
    };

    return {
        city,
        setCity,
        errorMessage,
        cityWeathers,
        onAddCity,
        handleRemoveCity,
        handleRefreshWeather,
    };
}
