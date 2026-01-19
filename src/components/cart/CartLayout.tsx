/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import "./style.css";
import { Cart } from "./Cart";
import { Breadcrums } from "../breadcrums/Breadcrums";
import { SwiperCards } from "../swiperCards/SwiperCards";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/main/store";
import { useEffect, useMemo, useState } from "react";
import { buildCartItemsDetailed } from "@/hooks/buildCartItems";
import axios from "axios";
import { getEasyshipRates } from "@/lib/easyships/getEasyshipRates";
import {
  setLocation,
  setShippingAdress,
} from "@/redux/main/slices/orderCartSlice";
import { FullScreenLoader } from "../loader/FullScreenLoader";

export function CartLayout({ postalCode }: { postalCode: string }) {
  const { orderProducts } = useSelector(
    (store: RootState) => store.orderCartSlice,
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleGetShippingPrice = async () => {
    if (loading) return;

    setLoading(true);
    const fsa = postalCode.substring(0, 3);

    try {
      const res = await axios.get(`https://api.zippopotam.us/CA/${fsa}`);

      const place = res.data?.places?.[0];

      if (!place) {
        return;
      }
      const shipping = await getEasyshipRates(postalCode);
      console.log(place);
      dispatch(
        setLocation({
          stateCode: place["state abbreviation"],
          stateName: place.state,
          shippingPrice: shipping[0].total_charge,
        }),
      );

      dispatch(
        setShippingAdress({
          postalCode: postalCode,
          city: place["place name"] ?? "",
          province: place["state"] ?? "",
          address: "",
          company: "",
          apartment: "",
        }),
      );
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetShippingPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postalCode]);

  const { products } = useSelector((store: RootState) => store.productSlice);

  const cartItemsDetailed = buildCartItemsDetailed(products, orderProducts);

  const alsoMayLike = useMemo(() => {
    if (!products?.length) return [];
    if (!cartItemsDetailed?.length) return products.slice(0, 10);

    // ids продуктів у корзині, щоб не показувати їх у "also may like"
    const cartIds = new Set(
      cartItemsDetailed.map((item: any) => item.id ?? item.productId),
    );

    // категорії з корзини
    const cartCategoryIds = new Set(
      cartItemsDetailed
        .map((item: any) => item.categoryId ?? item.category?.id)
        .filter(Boolean),
    );

    // товари з цих категорій (але не ті, що в корзині)
    const candidates = products.filter((p: any) => {
      const pCategoryId = p.categoryId ?? p.category?.id;
      return (
        pCategoryId && cartCategoryIds.has(pCategoryId) && !cartIds.has(p.id)
      );
    });

    // якщо нічого не знайшло — просто добиваємо будь-якими товарами не з корзини
    const fallback = products.filter((p: any) => !cartIds.has(p.id));

    const result = candidates.length ? candidates : fallback;

    // рандом + ліміт
    return [...result].sort(() => Math.random() - 0.5).slice(0, 12);
  }, [products, cartItemsDetailed]);

  return (
    <div className="CartPage">
      {loading && <FullScreenLoader />}
      <div className="container">
        <Breadcrums links={[{ title: "Home", href: "/" }, { title: "Cart" }]} />
        <Cart />
        {orderProducts.length > 0 && (
          <SwiperCards cards={alsoMayLike} title="you may also like" />
        )}
      </div>
    </div>
  );
}
