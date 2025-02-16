import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiService from "@/utils/ApiService";
import { API } from "@/utils/Api";
import { RootState } from "../store";
import { AxiosResponse } from "axios";

interface LoginCredentials {
    Email: string;
    Password: string;
}

interface AuthState {
    user: IUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// Async thunks
export const userLogin = createAsyncThunk<AxiosResponse<{ user: IUser }>, LoginCredentials>(
    "auth/login",
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await ApiService.post<{ user: IUser }>(API.auth.login, credentials);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Invalid email or password");
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        await ApiService.post(API.auth.logout);
        return null;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.error || "Logout failed");
    }
});

export const verifyToken = createAsyncThunk("auth/verifyToken", async (_, { rejectWithValue }) => {
    try {
        const response = await ApiService.post<{ user: IUser }>(API.auth.verify);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.error || "Refresh failed");
    }
});

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(userLogin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.data.user;
                state.error = null;
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Logout
        builder
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Refresh
        builder
            .addCase(verifyToken.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyToken.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(verifyToken.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const userSelector = (state: RootState) => state.user;
export default userSlice.reducer;
