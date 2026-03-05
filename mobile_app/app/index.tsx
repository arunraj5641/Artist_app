import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import storage from "../services/storage";
import LoginScreen from "./Login";
import DashboardTabs from "./dashboard/DashboardTabs";

export default function EntryPoint() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await storage.getToken();
            setIsAuthenticated(!!token);
        } catch (e) {
            console.error("Auth check failed", e);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: "#0f172a", justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return isAuthenticated ? <DashboardTabs /> : <LoginScreen />;
}
