// src/redux/musicSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTracks = createAsyncThunk(
  'music/fetchTracks',
  async (mood, { rejectWithValue }) => {
    try {
      // mood — строка, например "happy"
      const response = await axios.post('http://localhost:5274/api/Music/recommend', { mood });
      return response.data; // массив треков
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const musicSlice = createSlice({
  name: 'music',
  initialState: {
    tracks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.tracks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default musicSlice.reducer;