/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export async function getEasyshipRates(postalCode: string) {
  const res = await axios.post("/api/easyship/rates", {
    postalCode,
  });

  const availableDeliveryId = [
    "2f93b15f-4111-4ba8-a96c-7b5d2aaa2e08",
    "a11cebea-6091-4bd3-a195-522d6552b4dc",
    "d80d08d5-6a7f-49ca-bd3e-410512b28e77",
    "abfa932c-b418-428b-b0fc-c4f77b2797d9",
    "0b9d82cb-8f75-4487-9b58-9d42e54a6b50",
    "b3cad4ee-9b30-4120-8f47-1c56bff02290",
    "510d9128-a506-4050-8cbe-14757490be24",
  ];

  const data = res.data;

  if (!data?.rates || data.rates.length === 0) {
    throw new Error("No shipping rates available");
  }

  const sortedRates = [...data.rates].sort(
    (a: any, b: any) => a.total_charge - b.total_charge,
  );

  const filteredRates = sortedRates.filter((el) =>
    availableDeliveryId.includes(el.courier_service.id),
  );

  console.log(filteredRates);

  return filteredRates;
}
