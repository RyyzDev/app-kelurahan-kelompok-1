import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../services/authService';

const userFromStorage = JSON.parse(localStorage.getItem('user'));
const tokenFromStorage = localStorage.getItem('token');

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginUser(credentials);
    const { user, token } = response.data;
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    return { user, token };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login gagal. Periksa kembali NIK/Email dan Kata Sandi Anda.');
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await registerUser(userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.response?.data?.errors?.[0] || 'Registrasi gagal. Silakan coba lagi.');
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
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
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
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
