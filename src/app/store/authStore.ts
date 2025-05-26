import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthStore, UserProfile, AuthResponse } from '../types/auth.types';
import { fetchWrapper } from '../utils/fetchWrapper';

type State = AuthStore;

const useAuthStore = create<State>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            setUser: (user) => set({ user }),

            setTokens: (tokens) => {
                console.log('Setting tokens:', { accessToken: !!tokens.accessToken, refreshToken: !!tokens.refreshToken });
                set({
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    isAuthenticated: true,
                });
            },

            login: async (credentials) => {
                try {
                    console.log('Attempting login...');
                    const response = await fetchWrapper.post('/auth/login', credentials);

                    // First set the tokens
                    const tokens = {
                        accessToken: response.access_token,
                        refreshToken: response.refresh_token,
                    };
                    console.log('Login successful, setting tokens');
                    set({
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken,
                        isAuthenticated: true,
                    });

                    // Then fetch profile
                    console.log('Fetching profile after login...');
                    const store = get();
                    await store.fetchProfile();
                } catch (error) {
                    console.error('Login failed:', error);
                    throw new Error('Login failed');
                }
            },

            fetchProfile: async () => {
                const state = get();
                console.log('Fetch profile called, auth state:', {
                    hasAccessToken: !!state.accessToken,
                    isAuthenticated: state.isAuthenticated
                });

                try {
                    // Only fetch profile if we have an access token
                    if (!state.accessToken) {
                        console.log('No access token available, skipping profile fetch');
                        return;
                    }

                    console.log('Fetching profile...');
                    const profile = await fetchWrapper.get('/auth/profile');

                    console.log('Profile fetched successfully');
                    set({ user: profile });
                } catch (error) {
                    console.error('Profile fetch failed:', error);
                    // If profile fetch fails, log out the user
                    const store = get();
                    store.logout();
                    throw new Error('Failed to fetch user profile');
                }
            },

            hasPermission: (permission: string) => {
                const state = get();
                if (!state.user || !state.user.permission) {
                    return false;
                }
                return state.user.permission.includes(permission) || state.user.permission.includes('ALL');
            },

            logout: () => {
                console.log('Logging out...');
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state) => {
                console.log('Storage rehydrated:', {
                    hasState: !!state,
                    hasAccessToken: state?.accessToken,
                    isAuthenticated: state?.isAuthenticated
                });

                if (state && state.accessToken) {
                    console.log('Has token after rehydration, fetching profile...');
                    setTimeout(() => {
                        state.fetchProfile().catch(err => {
                            console.error('Failed to fetch profile after rehydration:', err);
                        });
                    }, 0);
                }
            },
        }
    )
);

export { useAuthStore }; 