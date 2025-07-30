import { fetchWithApiKey } from "@/api/fetchWithApiKey";
import Chart from "@/components/Chart/Chart";
import dayjs from "dayjs";

interface IForecast {
  hourly: {
    dt: number;
    temp: number;
  }[];
  current: {
    sunrise: number;
    sunset: number;
    clouds: number;
    pressure: number;
  };
}

interface CityDetailProps {
  params: { name: string };
  searchParams: { lat?: string; lon?: string };
}

export default async function CityDetail({
  params,
  searchParams,
}: CityDetailProps) {
  const name = decodeURIComponent(params.name ?? "");
  const lat = searchParams.lat;
  const lon = searchParams.lon;

  if (!lat || !lon) {
    return <div>Latitude and longitude are required</div>;
  }

  let forecast: IForecast | null = null;

  try {
    forecast = await fetchWithApiKey(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric`,
    );
  } catch {
    return <div>Error while loading the weather</div>;
  }

  const chartData = forecast?.hourly?.slice(0, 12).map((hour) => ({
    x: hour.dt * 1000,
    y: hour.temp,
  }));

  return (
    <div>
      <h2>Weather in the city: {name}</h2>
      <p>Clouds: {forecast?.current?.clouds}</p>
      <p>
        Sunrise:{" "}
        {forecast?.current?.sunrise
          ? dayjs(forecast.current.sunrise * 1000).format("HH:mm")
          : "—"}
      </p>
      <p>
        Sunset:{" "}
        {forecast?.current?.sunset
          ? dayjs(forecast.current.sunset * 1000).format("HH:mm")
          : "—"}
      </p>
      <p>Pressure: {forecast?.current?.pressure}</p>

      <div style={{ width: "100%", height: 400 }}>
        <Chart data={chartData} />
      </div>
    </div>
  );
}
