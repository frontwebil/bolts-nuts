import axios from "axios";

export async function validatePostalCode({
  postalCode,
}: {
  postalCode: string;
}) {
  const res = await axios.post(
    "https://api.easyship.com/2024-09/address-validation/domestic",
    {
      country_alpha2: "CA", // "CA", "US"
      postal_code: postalCode,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.EASYSHIP_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );
  console.log(res)
  return res.data;
}
