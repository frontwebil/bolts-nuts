import { NextResponse } from "next/server";

const OriginAddress = {
  city: "Oakville",
  line_1: "2530 Speers Road",
  state: "Ontario",
  postal_code: "L6L5K8",
  country_alpha2: "CA",
};

export async function POST() {
  const url = "https://public-api.easyship.com/2024-09/rates";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${process.env.EASYSHIP_KEY}`, // ❗БЕЗ NEXT_PUBLIC
    },
    body: JSON.stringify({
      origin_address: OriginAddress,
      destination_address: {
        country_alpha2: "CA",
        line_1: "1200 Bay Street",
        state: "Ontario",
        city: "Toronto",
        postal_code: "M5R2A5",
      },
      incoterms: "DDU",
      insurance: { is_insured: false },
      courier_settings: {
        show_courier_logo_url: false,
        apply_shipping_rules: true,
      },
      shipping_settings: { units: { weight: "kg", dimensions: "cm" } },
      parcels: [
        {
          total_actual_weight: 5,
          items: [
            {
              description: "Protein powder",
              quantity: 1,
              declared_customs_value: 1,
              declared_currency: "CAD",
              category: "Health",
              hs_code: "210610",
              dimensions: {
                length: 25,
                width: 15,
                height: 10,
              },
              origin_country_alpha2: "CA",
            },
          ],
        },
      ],
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(data);
    return NextResponse.json({ error: data }, { status: res.status });
  }

  return NextResponse.json(data);
}
