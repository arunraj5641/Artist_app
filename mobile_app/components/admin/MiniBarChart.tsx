import React from "react";
import { View, Text } from "react-native";

interface MiniBarChartProps {
    data: number[];
    labels?: string[];
    color?: string;
    height?: number;
}

export default function MiniBarChart({
    data,
    labels,
    color = "#3b82f6",
    height = 60,
}: MiniBarChartProps) {
    const max = Math.max(...data, 1);

    return (
        <View style={{ height: height + 20 }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    height,
                    gap: 4,
                }}
            >
                {data.map((val, i) => {
                    const barH = Math.max((val / max) * height, 4);
                    const isLast = i === data.length - 1;
                    return (
                        <View key={i} style={{ flex: 1, alignItems: "center" }}>
                            <View
                                style={{
                                    width: "100%",
                                    height: barH,
                                    borderRadius: 4,
                                    backgroundColor: isLast ? color : color + "55",
                                }}
                            />
                        </View>
                    );
                })}
            </View>
            {labels && (
                <View style={{ flexDirection: "row", marginTop: 4 }}>
                    {labels.map((l, i) => (
                        <Text
                            key={i}
                            style={{
                                flex: 1,
                                textAlign: "center",
                                fontSize: 9,
                                color: "#475569",
                            }}
                        >
                            {l}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
}
