import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockLogin } from '../services/mockAuthService';

const userFromStorage = JSON.parse(localStorage.getItem('user'));
const tokenFromStorage = localStorage.getItem('token');

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    // Menggunakan NIK untuk login
    const response = await mockLogin(credentials.nik, credentials.password);
    const { user, token } = response;
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    return { user, token };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage || null,
    token: tokenFromStorage || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
