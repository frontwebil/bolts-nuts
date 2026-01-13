/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoClose } from "react-icons/io5";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsOpenFirstCartMenu,
  setIsOpenPopUpCart,
} from "@/redux/main/slices/uiSlice";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/main/store";
import Image from "next/image";
import { decreaseQty, increaseQty } from "@/redux/main/slices/orderCartSlice";
import { FaMinus, FaPlus } from "react-icons/fa";
import Link from "next/link";

export function CartFirstMenu() {
  const dispatch = useDispatch();
  const { orderProducts } = useSelector(
    (store: RootState) => store.orderCartSlice
  );
  const { products } = useSelector((store: RootState) => store.productSlice);
  const router = useRouter();

  if (
    (orderProducts && orderProducts.length <= 0) ||
    (products && products.length <= 0)
  ) {
    return (
      <div className="CartFirstMenu">
        <div className="menu">
          <div className="menu-top">
            <h2>Cart</h2>
            <div
              className="menu-top-close"
              onClick={() => {
                dispatch(setIsOpenFirstCartMenu(false));
              }}
            >
              <IoClose />
              <p>Close</p>
            </div>
          </div>
          <div className="menu-content-empty">
            <h3>Your cart is empty</h3>
            <p>
              Shop now and discover deals, new arrivals, and customers favorites
              waiting for you
            </p>
            <button
              className="menu-content-empty-button"
              onClick={() => {
                dispatch(setIsOpenFirstCartMenu(false));
                router.replace("/catalog");
              }}
            >
              Continue shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className="CartFirstMenu">
      <div className="menu">
        <div className="menu-top">
          <h2>Cart</h2>
          <div
            className="menu-top-close"
            onClick={() => {
              dispatch(setIsOpenFirstCartMenu(false));
            }}
          >
            <IoClose />
            <p>Close</p>
          </div>
        </div>
        <div className="CartFirstMenu-products-added">
          {orderProducts.length} products added
        </div>
        <div className="CartFirstMenu-content">
          {cartItemsDetailed.map((el, i) => (
            <div className="CartFirstMenu-content-card" key={i}>
              <Link
                href={`/product/${el.product.slug}`}
                className="CartFirstMenu-content-card-wrapper"
              >
                <div className="CartFirstMenu-content-card-img">
                  <Image
                    src={el.product.images[0]!}
                    alt={el.product.title!}
                    width={300}
                    height={300}
                  />
                </div>
                <div className="CartFirstMenu-content-card-info">
                  <h2>
                    {el?.product.title} <br />
                  </h2>
                  <p>{`(${el?.variant.value} ${el?.variant.unit})`}</p>
                </div>
              </Link>
              <div className="CartFirstMenu-content-card-info-buttons">
                <div className="CartFirstMenu-content-card-info-buttons-price">
                  ${(el?.price * el.quantity).toFixed(2)}
                </div>
                <div className="CartFirstMenu-content-card-info-buttons-manage-quantity">
                  <button
                    type="button"
                    className="qty-btn"
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

                  <div className="qty-value">{el?.quantity}</div>

                  <button
                    type="button"
                    className="qty-btn"
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
            </div>
          ))}
        </div>
        <div className="CartFirstMenu-content-bottom">
          <div className="CartFirstMenu-content-bottom-price">
            <p>Total</p>
            <div className="CartFirstMenu-content-bottom-price-right">
              <p>${total.toFixed(2)}</p>
              <div className="tax-alarm-cart">+Tax</div>
            </div>
          </div>
          <div className="CartFirstMenu-content-bottom-buttons">
            <div
              className="CartFirstMenu-content-bottom-button-open-cart"
              onClick={() => {
                dispatch(setIsOpenPopUpCart(true));
                dispatch(setIsOpenFirstCartMenu(false));
              }}
            >
              Open Cart
            </div>
            <div className="CartFirstMenu-content-bottom-button-checkout">
              Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
