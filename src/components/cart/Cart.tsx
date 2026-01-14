/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { PiCaretLeftBold } from "react-icons/pi";
import { CartPrice } from "./CartPrice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/main/store";
import Image from "next/image";
import { FaMinus, FaPlus, FaRegTrashAlt } from "react-icons/fa";
import {
  decreaseQty,
  increaseQty,
  removeFromCart,
} from "@/redux/main/slices/orderCartSlice";
import { IoClose } from "react-icons/io5";

export function Cart() {
  const { orderProducts } = useSelector(
    (store: RootState) => store.orderCartSlice
  );
  const dispatch = useDispatch();
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

  const total = cartItemsDetailed.reduce(
    (sum, item: any) => sum + item.total,
    0
  );

  if (orderProducts && orderProducts.length <= 0) {
    return (
      <div
        className="menu absolute top-1/2 left-1/2"
        style={{
          transform: `translate(-50% ,-50%) `,
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <div className="menu-content-empty">
          <h3>Your cart is empty</h3>
          <p>
            Shop now and discover deals, new arrivals, and customers favorites
            waiting for you
          </p>
          <Link
            href={"/catalog"}
            className="menu-content-empty-button text-center"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="CartPopUp-wrapper">
      <div className="CartPopUp-top">
        <h2>Shopping Cart</h2>
        <Link href={"/catalog"} className="CartPopUp-top-continue">
          <PiCaretLeftBold />
          <p>Continue shopping</p>
        </Link>
      </div>
      <div className="CartPopUp-wrapper-content">
        <div className="CartPopUp-wrapper-content-products">
          <div className="CartPopUp-wrapper-content-products-top">
            <div className="CartPopUp-wrapper-content-products-column-first">
              Product
            </div>
            <div className="CartPopUp-wrapper-content-products-column-second">
              quantity
            </div>
            <div className="CartPopUp-wrapper-content-products-column-third">
              total
            </div>
          </div>
          <div className="CartPopUp-wrapper-content-products-content">
            {cartItemsDetailed.map((el, i) => {
              const length = el.product.specs.find(
                (el) => el.key == "Length"
              )?.value;
              return (
                <div className="CartItem" key={i}>
                  <div className="CartPopUp-wrapper-content-products-column-first">
                    <div className="CartItem-product">
                      <div className="CartItem-product-img">
                        <Image
                          src={el.product.images[0]}
                          alt={el.product.title}
                          width={200}
                          height={200}
                        />
                      </div>
                      <div className="CartItem-product-info">
                        <h2>{el.product.title}</h2>
                        <div className="CartItem-product-info-option">
                          <p>
                            {el.variant.value} {el.variant.unit}
                          </p>
                          <p>{length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="CartPopUp-wrapper-content-products-column-second">
                    <div className="manage-quantity">
                      <button
                        type="button"
                        className="manage-quantity-btn"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          dispatch(
                            decreaseQty({
                              productId: el.product.id,
                              variantId: el.variant.id,
                            })
                          )
                        }
                      >
                        <FaMinus />
                      </button>
                      <div className="manage-quantity-value">
                        {el?.quantity}
                      </div>

                      <button
                        type="button"
                        className="manage-quantity-btn"
                        aria-label="Increase quantity"
                        onClick={() =>
                          dispatch(
                            increaseQty({
                              productId: el.product.id,
                              variantId: el.variant.id,
                            })
                          )
                        }
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <div className="CartPopUp-wrapper-content-products-column-third">
                    <div className="CartItem-product-price">
                      <h4>{(el.price * el.quantity).toFixed(2)} $</h4>
                      <button
                        onClick={() =>
                          dispatch(
                            removeFromCart({
                              productId: el.product.id,
                              variantId: el.variant.id,
                            })
                          )
                        }
                      >
                        <FaRegTrashAlt />
                        <p>Delete</p>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <CartPrice total={total} />
      </div>
    </div>
  );
}
