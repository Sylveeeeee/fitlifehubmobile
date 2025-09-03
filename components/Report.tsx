import React from "react";
import { View, Text } from "react-native";
import * as Progress from "react-native-progress";

type EnergyData = {
  energyTarget: number;
  expenditureAboveBaseline: number;
  totalTarget: number;
  consumed: number;
};

type MacroItem = {
  key: string;
  label: string;
  unit: string;
  target: number | null;
  consumed: number | null;
  color: string;
};

type Props = {
  periodLabel?: string;
  energy?: EnergyData;
  macros?: MacroItem[];
};

const clampPercent = (v: number) => Math.max(0, Math.min(100, v));

export default function Report({
  periodLabel = "",
  energy = { energyTarget: 0, expenditureAboveBaseline: 0, totalTarget: 0, consumed: 0 },
  macros = [],
}: Props) {
  const remaining = energy.totalTarget - energy.consumed;
  const consumedPct = energy.totalTarget
    ? clampPercent((energy.consumed / energy.totalTarget) * 100)
    : 0;

  return (
    <View className="w-full max-w-3xl rounded-2xl border border-black bg-[#232433] p-4 shadow-sm">
      {/* Header */}
      <Text className="text-lg font-semibold text-[#fcae05] mb-1">
        Daily Average Energy Budget
      </Text>
      {periodLabel ? (
        <Text className="text-sm text-white mb-4">{periodLabel}</Text>
      ) : null}

      {/* Energy Stats Grid */}
      <View className="flex flex-row flex-wrap border border-black rounded-lg mb-4">
        <Stat label="Energy Target" value={`${energy.energyTarget} kcal`} />
        <Stat
          label="Expenditure Above Baseline"
          value={`${energy.expenditureAboveBaseline >= 0 ? "+" : ""}${energy.expenditureAboveBaseline} kcal`}
        />
        <Stat label="Total Target" value={`${energy.totalTarget} kcal`} />
        <Stat label="Consumed" value={`${energy.consumed} kcal`} />
        <Stat label="Remaining" value={`${remaining} kcal`} highlight />
      </View>

      {/* Progress */}
      <View className="mb-6">
        <View className="flex flex-row justify-between mb-1">
          <Text className="text-sm text-white">Calorie Progress</Text>
          <Text className="text-sm text-white">{consumedPct.toFixed(0)}%</Text>
        </View>
        <Progress.Bar
          progress={consumedPct / 100}
          width={null}
          color="#3b82f6"
          unfilledColor="#1f1f1f"
          borderWidth={0}
          height={10}
        />
        {energy.consumed === 0 && (
          <Text className="text-xs text-white mt-1">
            No intake data for this period
          </Text>
        )}
      </View>

      {/* Macronutrient Targets */}
      <Text className="text-base font-semibold mb-3 text-white">
        Macronutrient Targets
      </Text>
      <View className="gap-y-3">
        {macros.map((m) => {
          const hasData =
            m.target !== null && m.consumed !== null && m.target > 0;
          const pct = hasData
            ? clampPercent(((m.consumed as number) / (m.target as number)) * 100)
            : 0;

          return (
            <View
              key={m.key}
              className="border border-black rounded-lg p-3"
            >
              <View className="flex flex-row justify-between mb-1">
                <Text className="text-sm font-medium text-white">{m.label}</Text>
                <Text className="text-xs text-white">
                  {hasData ? `${m.consumed} / ${m.target} ${m.unit}` : "No Data"}
                </Text>
              </View>
              <Progress.Bar
                progress={pct / 100}
                width={null}
                color={m.color}
                unfilledColor="#1f1f1f"
                borderWidth={0}
                height={8}
              />
              <Text className="text-right text-xs text-white mt-1">
                {pct.toFixed(0)}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View className="w-1/2 md:w-1/3 lg:w-1/5 p-3 border-b border-black">
      <Text className="text-xs text-white">{label}</Text>
      <Text
        className={`text-sm ${highlight ? "font-semibold text-white" : "text-white"}`}
      >
        {value}
      </Text>
    </View>
  );
}
