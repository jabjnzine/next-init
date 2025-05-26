export interface User {
    id: number;
    username: string;
    branch_id: number;
    branch_name: string;
    user_type: string;
}

export interface Branch {
    id: number;
    code: string;
    name: string;
}

export interface Role {
    id: number;
    name: string;
    role_permission: string[];
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface TokenPayload {
    username: string;
    user_id: number;
    branch_id: number;
    branch_name: string;
    user_type: string;
    sub: {
        id: number;
        branch_id: number;
        branch_name: string;
        user_type: string;
    };
    iat: number;
    exp: number;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
}

export interface UserRole {
    id: number;
    name: string;
}

export interface UserData {
    id: number;
    status: string;
    username: string;
    user_profile_id: number;
    supplier_id: number | null;
    role_id: number;
}

export interface UserProfile {
    id: number;
    status: string;
    code: string;
    full_name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    superadmin: boolean;
    image: string | null;
    users: UserData;
    permission: string[];
    roles: UserRole;
}

export interface AuthStore {
    user: UserProfile | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    setTokens: (tokens: { accessToken: string | null; refreshToken: string | null }) => void;
    setUser: (user: UserProfile) => void;
    fetchProfile: () => Promise<void>;
    hasPermission: (permission: string) => boolean;
} 