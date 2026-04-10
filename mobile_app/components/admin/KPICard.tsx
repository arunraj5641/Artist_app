import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface KPICardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendPositive?: boolean;
    accentColor?: string;
}

export default function KPICard({
    title,
    value,
    icon,
    trend,
    trendPositive,
}: KPICardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.top}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.iconWrap}>{icon}</View>
            </View>
            <Text style={styles.value}>{value}</Text>
            {trend && (
                <View style={styles.trendRow}>
                    <Ionicons
                        name={trendPositive ? "trending-up" : "trending-down"}
                        size={11}
                        color={trendPositive ? "#22c55e" : "#ef4444"}
                    />
                    <Text
                        style={[
                            styles.trendText,
                            { color: trendPositive ? "#22c55e" : "#ef4444" },
                        ]}
                    >
                        {" "}{trend}
                    </Text>
                    <Text style={styles.trendSub}> vs last week</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#141e30",
        borderRadius: 16,
        padding: 18,
        width: 170,
        marginRight: 12,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
    },
    top: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    title: {
        fontSize: 11,
        color: "#64748b",
        fontWeight: "500",
        flex: 1,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.05)",
        alignItems: "center",
        justifyContent: "center",
    },
    value: {
        fontSize: 26,
        fontWeight: "800",
        color: "#f8fafc",
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    trendRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
    },
    trendText: {
        fontSize: 10,
        fontWeight: "700",
    },
    trendSub: {
        fontSize: 10,
        color: "#475569",
    },
});
