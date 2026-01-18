/* eslint-disable @typescript-eslint/no-explicit-any */
type CartItemDetailed = {
  key: string;
  product: any;
  variant: any;
  quantity: number;
  hasDiscount: boolean;
  oldPrice: number | null;
  price: number;
  total: number;
};

export function buildCartItemsDetailed(
  products: any[],
  orderProducts: any[]
): CartItemDetailed[] {
  const productsMap = new Map(products.map((p) => [p.id, p]));

  return orderProducts
    .map((item) => {
      const product = productsMap.get(item.productId);
      if (!product) return null;

      const variantsArr = product.options ?? [];
      const variant = variantsArr.find(
        (v: any) => v.id === item.variantId
      );
      if (!variant) return null;

      const hasDiscount =
        typeof variant.discount === "number" && variant.discount > 0;

      const oldPrice = hasDiscount ? variant.price : null;

      const price = hasDiscount
        ? Math.round(
            variant.price * (1 - variant.discount / 100) * 100
          ) / 100
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
    .filter(Boolean) as CartItemDetailed[];
}
