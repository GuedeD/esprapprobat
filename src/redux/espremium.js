import { createSlice } from "@reduxjs/toolkit";

const espremiumSlice = createSlice({
  name: "projet",
  initialState: { userInfo: null, products: [], favorites: [], cart: [] },
  reducers: {
    connexion(state, action) {
      return { ...state, userInfo: action.payload };
    },
    deconnexion(state) {
      return { ...state, userInfo: null };
    },
    productsToShow(state, action) {
      return { ...state, products: action.payload };
    },
    addToCart(state, action) {
      const isInCart = state.cart.find(
        (product) => product.id === action.payload.id
      );

      if (isInCart) {
        isInCart.quantite = isInCart.quantite + 1;
      } else {
        const updatedProducts = state.cart.concat(action.payload);
        return { ...state, cart: updatedProducts };
      }
    },
    updateQuantity(state, action) {
      console.log(action.payload);
      const { updatedQuantite } = action.payload;
      const { produit } = action.payload;
      // console.log(updatedQuantite);
      // console.log(produit);
      const updatedProducts = state.cart.map((item) =>
        item.id === produit.id ? { ...item, quantite: updatedQuantite } : item
      );
      return { ...state, cart: updatedProducts };
    },
    removeToCart(state, action) {
      const updatedProducts = state.cart.filter(
        (item) => item.id !== action.payload
      );
      return { ...state, cart: updatedProducts };
    },
    resetAll(state) {
      return { ...state, cart: [] };
    },
  },
});

export const {
  connexion,
  deconnexion,
  productsToShow,
  addToCart,
  removeToCart,
  resetAll,
  updateQuantity,
} = espremiumSlice.actions;
export const espremiumReducer = espremiumSlice.reducer;
