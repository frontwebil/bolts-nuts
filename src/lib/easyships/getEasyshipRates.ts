export async function getEasyshipRates() {
  const res = await fetch("/api/easyship/rates", {
    method: "POST",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Easyship API error");
  }

  return data;
}
