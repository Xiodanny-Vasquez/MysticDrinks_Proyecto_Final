import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (cocktail) => {
    if (!cocktail.idDrink || !cocktail.strDrink || !cocktail.strDrinkThumb || !cocktail.price) {
      console.error("Error: Datos incompletos en el producto:", cocktail);
      return; // Evita agregar productos incompletos
    }
    //'setCart' funcion que toma a 'prevCart' como argumento para mostar el estado m
    setCart((prevCart) => {
      
      const productInCartIndex = prevCart.findIndex(
        (item) => item.id === cocktail.idDrink
      );

      if (productInCartIndex >= 0) {
        // Si el producto ya está, incrementa la cantidad
        return prevCart.map((item, index) =>
          index === productInCartIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      
      }

      // Si el producto no está en el carrito, lo añade con cantidad inicial de 1
      return [
        ...prevCart,
        {
          id: cocktail.idDrink,
          thumbnail: cocktail.strDrinkThumb,
          title: cocktail.strDrink,
          price: cocktail.price,
          quantity: 1,
        },
      ];
    
    });
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
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
        removeFromCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
