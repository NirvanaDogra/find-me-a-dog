import { LoginFormState, LoginResult } from "../page";

export async function loginUser(credentials: LoginFormState): Promise<LoginResult> {
    const url = `https://frontend-take-home-service.fetch.com/auth/login`;
    const options: RequestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials),
        credentials: "include",
    };

    try {
        const response: Response = await fetch(url, options);

        if (!response.ok) {
            return {
                success: false,
                error: "Authentication failed"
            };
        }

        const data = await response.text();

        return {
            success: data === "OK",
            error: data !== "OK" ? "Login failed" : undefined
        };
    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Network error"
        };
    }
}  

export async function logoutUser(): Promise<void> {
    const url = `https://frontend-take-home-service.fetch.com/auth/logout`;
    const options: RequestInit = {
        method: "POST",
        credentials: "include",
    };

    const response: Response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
}