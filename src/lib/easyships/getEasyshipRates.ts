/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export async function getEasyshipRates(postalCode: string) {
  const res = await axios.post("/api/easyship/rates", {
    postalCode,
  });

  const data = res.data;

  if (!data?.rates || data.rates.length === 0) {
    throw new Error("No shipping rates available");
  }

  const sortedRates = [...data.rates].sort(
    (a: any, b: any) => a.total_charge - b.total_charge,
  );

  return sortedRates; // ✅ найдешевший варіант
}
