import { useCart } from "../Shopping-cart/Hooks/useCart";
import "../Shopping-cart/Footer.css"
export function Fotter() {
  const { cart } = useCart();

  return <footer className="footer">{JSON.stringify(cart, null, 2)}</footer>;
}
