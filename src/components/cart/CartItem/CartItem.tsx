import Image from "next/image";
import "./style.css";
import { useDispatch } from "react-redux";
import {
  decreaseQty,
  increaseQty,
  removeFromCart,
} from "@/redux/main/slices/orderCartSlice";
import { FaMinus, FaPlus, FaRegTrashAlt } from "react-icons/fa";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CartItem({ el }: { el: any }) {
  const dispatch = useDispatch();
  const length = el.product.specs.find(
    (el: { key: string }) => el.key == "Length",
  )?.value;
  return (
    <div className="CartItem">
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
      <div className="Cart-item-two-column-wrap">
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
                  }),
                )
              }
            >
              <FaMinus />
            </button>
            <div className="manage-quantity-value">{el?.quantity}</div>

            <button
              type="button"
              className="manage-quantity-btn"
              aria-label="Increase quantity"
              onClick={() =>
                dispatch(
                  increaseQty({
                    productId: el.product.id,
                    variantId: el.variant.id,
                  }),
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
                  }),
                )
              }
            >
              <FaRegTrashAlt />
              <p>Delete</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
