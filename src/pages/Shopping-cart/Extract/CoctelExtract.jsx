// import React, { useContext } from "react";
// import { CartContext } from "../Context/cardContext";
// import Cart from "../Cart";

// function CoctelExtract() {
//   const { cart, addToCart } = useContext(CartContext);

//   return (
//     <ul>
//       {cart.map((item) => (
//         <CartItem
//           key={item.id}
//           thumbnail={item.strDrinkThumb} // Pasa la imagen
//           price={item.price} // Pasa el precio
//           title={item.strDrink} // Pasa el nombre
//           quantity={item.quantity} // Pasa la cantidad
//           addToCart={() => addToCart(item)} // Pasa la función para agregar al carrito
//         />
//       ))}
//     </ul>
//   );
// }
// export default CoctelExtract;
