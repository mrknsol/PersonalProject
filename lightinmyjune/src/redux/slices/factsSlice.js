import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFact = createAsyncThunk('facts/fetchFact', async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/Facts/GetFact`);
  if (!response.ok) {
    throw new Error('Ошибка при попытке получить факт');
  }
  const text = await response.text(); 
  return text;
});

const factsSlice = createSlice({
  name: 'facts',
  initialState: {
    fact: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFact.fulfilled, (state, action) => {
        state.loading = false;
        state.fact = action.payload;
      })
      .addCase(fetchFact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Что-то пошло не так';
      });
  },
});

export default factsSlice.reducer;