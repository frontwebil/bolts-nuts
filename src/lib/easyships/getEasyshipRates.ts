import axios from "axios";

export async function getEasyshipRates(postalCode: string) {
  const res = await axios.post("/api/easyship/rates", {
    postalCode,
  });

  const data = await res.data;

  if (!res) {
    throw new Error(data.error || "Easyship API error");
  }
  console.log(data);
  return data.rates[0];
}
