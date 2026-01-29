// ========== wishlistSlice.js ==========
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';
import toast from 'react-hot-toast';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/wishlist/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (product, { rejectWithValue }) => {
    try {
      // Since our API might not have a dedicated wishlist endpoint,
      // we'll store in localStorage
      toast.success('Added to wishlist');
      return product;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      toast.success('Removed from wishlist');
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: JSON.parse(localStorage.getItem('wishlist')) || [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    // Fetch Wishlist
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        // Ensure items is always an array, handle different API response formats
        const data = action.payload;
        if (Array.isArray(data)) {
          state.items = data;
        } else if (data && Array.isArray(data.items)) {
          state.items = data.items;
        } else if (data && Array.isArray(data.results)) {
          state.items = data.results;
        } else {
          state.items = [];
        }
      });

    // Add to Wishlist
    builder
      .addCase(addToWishlist.fulfilled, (state, action) => {
        if (!state.items.find((item) => item.id === action.payload.id)) {
          state.items.push(action.payload);
          localStorage.setItem('wishlist', JSON.stringify(state.items));
        }
      });

    // Remove from Wishlist
    builder
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      });
  },
});

export default wishlistSlice.reducer;