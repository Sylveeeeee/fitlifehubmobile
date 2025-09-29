import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { VictoryChart, VictoryAxis, VictoryBar } from 'victory-native';
import { getToken } from '@/utils/tokenStorage.native';
import { API_URL } from '@/config';

const screenWidth = Dimensions.get('window').width;

type NetEnergyEntry = {
    date: string;
    protein: number;
    carbs: number;
    fat: number;
    burned?: number;
    baseEnergyNeed?: number;
    activityCalories?: number;
    caloriesGoal?: number;
    calories?: number;
};

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}`;
}

const RANGE_OPTIONS = [
    { label: '7 day', value: '7d' },
    { label: '14 day', value: '14d' },
    { label: '1 month', value: '1m' },
];

export default function NetEnergyChart() {
    const [range, setRange] = useState('7d');
    const [history, setHistory] = useState<NetEnergyEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedData, setSelectedData] = useState<any>(null);

    useEffect(() => {
        const fetchEnergyHistory = async () => {
            setLoading(true);
            try {
                const token = await getToken();
                const foodRes = await fetch(`${API_URL}/api/food-entry/energy-history?range=${range}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const exerciseRes = await fetch(`${API_URL}/api/exercise-entry/energy-history?range=${range}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!foodRes.ok || !exerciseRes.ok) throw new Error('Failed to fetch');

                const foodJson = await foodRes.json();
                const exerciseJson = await exerciseRes.json();

                // รวมข้อมูลตามวันที่
                const merged: { [date: string]: NetEnergyEntry } = {};

                (foodJson.history || []).forEach((f: NetEnergyEntry) => {
                    merged[f.date] = { ...f };
                });

                (exerciseJson.history || []).forEach((e: NetEnergyEntry) => {
                    if (!merged[e.date]) merged[e.date] = { date: e.date, protein: 0, carbs: 0, fat: 0 };
                    merged[e.date] = {
                        ...merged[e.date],
                        burned: e.burned ?? merged[e.date].burned,
                        baseEnergyNeed: e.baseEnergyNeed ?? merged[e.date].baseEnergyNeed,
                        activityCalories: e.activityCalories ?? merged[e.date].activityCalories,
                    };
                });

                setHistory(Object.values(merged));
            } catch (err) {
                setHistory([]);
            } finally {
                setLoading(false);
            }
        };
        fetchEnergyHistory();
    }, [range]);

    const getRangeDays = (range: string) => {
        if (range.endsWith('d')) return parseInt(range);
        if (range.endsWith('m')) return 30;
        return 7; // default
    };

    const sortedHistory = [...history]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-getRangeDays(range));

    const netEnergyData = sortedHistory.map((d) => {
        const consumed =
            d.calories ??
            ((d.protein || 0) * 4 + (d.carbs || 0) * 4 + (d.fat || 0) * 9);
        const burned = (d.baseEnergyNeed || 0) + (d.activityCalories || 0) + (d.burned || 0);
        const caloriesGoal = d.caloriesGoal || 0;
        const net = consumed - caloriesGoal;
        return {
            date: formatDate(d.date),
            net,
            caloriesGoal,
            netDiff: net - caloriesGoal,
            consumed,
            burned,
            original: d, // เก็บ object ดั้งเดิมเพื่อแสดงใน modal
        };
    });

    if (loading) {
        return (
            <View className="w-[100%] self-center my-4 bg-[#232433] rounded-2xl p-4 shadow-lg  ">
                <Text className="text-[#ffb300] text-lg font-bold mb-2">Net Energy Chart (kcal)</Text>

                {/* Range Selector */}
                <View className="flex-row gap-x-2 mb-2">
                    {RANGE_OPTIONS.map((opt) => (
                        <TouchableOpacity
                            key={opt.value}
                            onPress={() => setRange(opt.value)}
                            className={`px-3 py-1 rounded-full ${range === opt.value ? 'bg-[#ffb300]' : 'bg-[#3a3b4d]'
                                }`}
                        >
                            <Text className="text-white text-xs">{opt.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <ActivityIndicator size="large" color="#ffb300" />
            </View>
        );
    }

    const tickValues =
        range === "1m"
            ? history.filter((_, i) => i % 3 === 0).map(d => formatDate(d.date))
            : history.map(d => formatDate(d.date));

    return (
        <View className="w-[100%] self-center my-4 bg-[#232433] rounded-2xl p-4 shadow-lg">
            <Text className="text-[#ffb300] text-lg font-bold mb-2">Net Energy Chart (kcal)</Text>

            {/* Range Selector */}
            <View className="flex-row gap-x-2 mb-2">
                {RANGE_OPTIONS.map((opt) => (
                    <TouchableOpacity
                        key={opt.value}
                        onPress={() => setRange(opt.value)}
                        className={`px-3 py-1 rounded-full ${range === opt.value ? 'bg-[#ffb300]' : 'bg-[#3a3b4d]'
                            }`}
                    >
                        <Text className="text-white text-xs">{opt.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <VictoryChart domainPadding={{ x: 20, y: 10 }} height={250} width={screenWidth * 0.92}>
                <VictoryAxis
                    tickFormat={(t: any) => t}
                    style={{
                        tickLabels: { fill: 'white', fontSize: 10 },
                        axis: { stroke: 'white' },
                    }}
                />

                <VictoryAxis
                    dependentAxis
                    tickCount={5}
                    tickFormat={(t: any) => `${t}`}
                    style={{
                        tickLabels: { fill: 'white', fontSize: 10 },
                        axis: { stroke: 'white' },
                        grid: { stroke: '#444' },
                    }}
                />

                {/* Net Energy Bar */}
                <VictoryBar
                    data={netEnergyData}
                    x="date"
                    y="net"
                    style={{
                        data: { fill: '#ffb300', opacity: 0.7, width: range === '1m' ? 6 : range === '14d' ? 12 : 15, },
                        labels: { fill: 'white', fontSize: 10 },
                    }}
                    events={[
                        {
                            target: 'data',
                            eventHandlers: {
                                onPressIn: (evt, clickedProps) => {
                                    setSelectedData(netEnergyData[clickedProps.index]);
                                    setModalVisible(true);
                                },
                            },
                        },
                    ]}
                />
            </VictoryChart>

            {/* Legend */}
            <View className="flex-row justify-center mt-3 gap-x-4">
                <View className="flex-row items-center">
                    <View className="w-3 h-3 rounded bg-[#ffb300] mr-1" />
                    <Text className="text-white text-xs">Net Energy</Text>
                </View>
            </View>

            {/* Modal */}
            {modalVisible && selectedData && (
                <Modal
                    transparent
                    animationType="fade"
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View className="flex-1 justify-center items-center bg-black/50">
                        <View className="bg-[#232433] p-4 rounded-xl w-[80%]">
                            <Text className="text-white font-bold text-lg mb-2">
                                {selectedData.date}
                            </Text>
                            <Text className="text-white text-sm">Consumed: {selectedData.consumed} kcal</Text>
                            <Text className="text-white text-sm">Burned: {selectedData.burned} kcal</Text>
                            <Text className="text-white text-sm">Goal: {selectedData.caloriesGoal} kcal</Text>
                            <Text className="text-white text-sm mt-2 font-bold">
                                Net: {selectedData.net} kcal
                            </Text>
                            <TouchableOpacity
                                className="mt-3 bg-[#ffb300] p-2 rounded"
                                onPress={() => setModalVisible(false)}
                            >
                                <Text className="text-black text-center font-semibold">Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}
