/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import "./style.css";
import { Cart } from "./Cart";
import { Breadcrums } from "../breadcrums/Breadcrums";
import { SwiperCards } from "../swiperCards/SwiperCards";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/main/store";
import { useMemo } from "react";

export function CartLayout() {
  const { orderProducts } = useSelector(
    (store: RootState) => store.orderCartSlice
  );
  const { products } = useSelector((store: RootState) => store.productSlice);

  const productsMap = new Map(products.map((p) => [p.id, p]));

  const cartItemsDetailed = orderProducts
    .map((item) => {
      const product = productsMap.get(item.productId);
      if (!product) return null;

      const variantsArr = product.options ?? [];
      const variant = variantsArr.find((v: any) => v.id === item.variantId);
      if (!variant) return null;

      const hasDiscount = variant.discount && variant.discount > 0;

      const oldPrice = hasDiscount ? variant.price : null;

      const price =
        hasDiscount && variant.discount
          ? Math.round(variant.price * (1 - variant.discount / 100) * 100) / 100
          : variant.price;

      return {
        key: `${item.productId}_${item.variantId}`,

        product,
        variant,

        quantity: item.quantity,

        hasDiscount,
        oldPrice,
        price,

        total: price * item.quantity,
      };
    })
    .filter((el) => el !== null);

  const alsoMayLike = useMemo(() => {
    if (!products?.length) return [];
    if (!cartItemsDetailed?.length) return products.slice(0, 10);

    // ids продуктів у корзині, щоб не показувати їх у "also may like"
    const cartIds = new Set(
      cartItemsDetailed.map((item: any) => item.id ?? item.productId)
    );

    // категорії з корзини
    const cartCategoryIds = new Set(
      cartItemsDetailed
        .map((item: any) => item.categoryId ?? item.category?.id)
        .filter(Boolean)
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
