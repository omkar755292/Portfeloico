import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiService from "@/utils/ApiService";
import { API } from "@/utils/Api";
import { RootState } from "../store";

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
export const loginUser = createAsyncThunk(
    "user/login",
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await ApiService.post<{ user: IUser }>(
                API.auth.login,
                credentials
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || "Invalid email or password"
            );
        }
    }
);

export const logout = createAsyncThunk(
    "user/logout",
    async (_, { rejectWithValue }) => {
        try {
            await ApiService.post(API.auth.logout);
            return null;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Logout failed");
        }
    }
);

export const verifyUser = createAsyncThunk<IUser | null>(
    "user/verify",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await ApiService.get<IUser>(API.auth.verify);
            if (data) {
                return data;
            }
            return rejectWithValue(null);
        } catch (error: any) {
            return rejectWithValue(null);
        }
    }
);

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
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
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

        // Verify
        builder
            .addCase(verifyUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(verifyUser.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
            });
    },
});

export const userSelector = (state: RootState) => state.user;
export default userSlice.reducer;
