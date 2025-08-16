import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CatEntity } from "../models/Cat.model";

interface FavoritesState {
  favorites: CatEntity[];
}

const initialState: FavoritesState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(
        (cat) => cat.id !== action.payload
      );
    },
    toggleFavorite: (state, action: PayloadAction<CatEntity>) => {
      const index = state.favorites.findIndex(
        (cat) => cat.id === action.payload.id
      );
      if (index >= 0) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(action.payload);
      }
    },
  },
});

export const { removeFavorite, toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
