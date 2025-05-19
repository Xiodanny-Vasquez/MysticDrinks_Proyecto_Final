import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (cocktail) => {
    // Validación de campos esenciales
    if (
      !cocktail.idDrink ||
      !cocktail.strDrink ||
      !cocktail.strDrinkThumb ||
      !cocktail.price
    ) {
      console.error("Error: Datos incompletos en el producto:", cocktail);
      return;
    }

    // Parseamos la cantidad para asegurarnos que sea número
    const quantityToAdd = parseInt(cocktail.quantity) || 1;

    setCart((prevCart) => {
      const productInCartIndex = prevCart.findIndex(
        (item) => item.id === cocktail.idDrink
      );

      if (productInCartIndex >= 0) {
        // Si el producto ya está en el carrito
        const updatedCart = prevCart.map((item, index) =>
          index === productInCartIndex
            ? {
              ...item,
              quantity: item.quantity + quantityToAdd,
            }
            : item
        );

        // Si la cantidad se reduce a 0 o menos, lo eliminamos del carrito
        return updatedCart.filter((item) => item.quantity > 0);
      }

      // Si es un producto nuevo y la cantidad es positiva
      if (quantityToAdd > 0) {
        return [
          ...prevCart,
          {
            id: cocktail.idDrink,
            thumbnail: cocktail.strDrinkThumb,
            title: cocktail.strDrink,
            price: cocktail.price,
            quantity: quantityToAdd,
          },
        ];
      }

      // Si se intenta agregar un producto nuevo con cantidad negativa o cero, no lo agregamos
      return prevCart;
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        clearCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
