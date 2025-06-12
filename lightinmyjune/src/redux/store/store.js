// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import musicReducer from '../slices/musicSlice';
import factsReducer from '../slices/factsSlice';

const store = configureStore({
  reducer: {
    music: musicReducer,
    facts: factsReducer
  },
});

export default store;