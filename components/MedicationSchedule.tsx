import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import Button from "@components/Button";
import RNPickerSelect from "react-native-picker-select";
import { useAuth } from "@providers/AuthProvider";

function MedicationSchedule() {
  const { profile, updateTimestamps } = useAuth();
  const [times, setTimes] = useState({
    morning: [] as string[],
    noon: [] as string[],
    night: [] as string[],
  });
  const [editMode, setEditMode] = useState(false);
  const [tempTimes, setTempTimes] = useState(times);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.timestamps) {
      const defaultTimes = {
        morning: profile.timestamps.slice(0, 2) as string[],
        noon: profile.timestamps.slice(2, 4) as string[],
        night: profile.timestamps.slice(4, 6) as string[],
      };
      setTimes(defaultTimes);
      setTempTimes(defaultTimes);
    }
  }, [profile]);

  const handleTimeChange = (time: string, period: string) => {
    const startTime = time.split(" - ")[0]; // Extract the start time
    const endTime = time.split(" - ")[1]; // Extract the end time
    setTempTimes((prev) => ({
      ...prev,
      [period]: [startTime, endTime],
    }));
  };

  const handleSave = () => {
    setLoading(true);
    setTimes(tempTimes);
    const allTimes = [
      ...tempTimes.morning,
      ...tempTimes.noon,
      ...tempTimes.night,
    ];
    updateTimestamps(allTimes);
    setEditMode(false);
    setLoading(false);
  };

  const handleCancel = () => {
    setTempTimes(times);
    setEditMode(false);
  };

  return (
    <View className="w-full my-4 p-4 bg-white rounded-lg shadow-md">
      <Text className="text-2xl font-bold mb-2 text-center">
        ⏰ Schedule (24-hour clock)
      </Text>
      {editMode ? (
        <View className="flex flex-col">
          <RNPickerSelect
            onValueChange={(value) => handleTimeChange(value, "morning")}
            items={[
              { label: "6 - 7", value: "6 - 7" },
              { label: "7 - 8", value: "7 - 8" },
              { label: "8 - 9", value: "8 - 9" },
              { label: "9 - 10", value: "9 - 10" },
              { label: "10 - 11", value: "10 - 11" },
              { label: "11 - 12", value: "11 - 12" },
            ]}
            value={tempTimes.morning.join(" - ")}
          />
          <RNPickerSelect
            onValueChange={(value) => handleTimeChange(value, "noon")}
            items={[
              { label: "12 - 13", value: "12 - 13" },
              { label: "13 - 14", value: "13 - 14" },
              { label: "14 - 15", value: "14 - 15" },
              { label: "15 - 16", value: "15 - 16" },
              { label: "16 - 17", value: "16 - 17" },
            ]}
            value={tempTimes.noon.join(" - ")}
          />
          <RNPickerSelect
            onValueChange={(value) => handleTimeChange(value, "night")}
            items={[
              { label: "17 - 18", value: "17 - 18" },
              { label: "18 - 19", value: "18 - 19" },
              { label: "19 - 20", value: "19 - 20" },
              { label: "20 - 21", value: "20 - 21" },
              { label: "21 - 22", value: "21 - 22" },
            ]}
            value={tempTimes.night.join(" - ")}
          />
          <View className="flex flex-row-reverse gap-3 mt-4">
            <Button
              text={loading ? "Saving..." : "Save"}
              onPress={handleSave}
              disabled={loading}
              className="w-4/12 bg-green-500 text-white py-2 rounded-lg"
            />
            <Button
              text="Cancel"
              onPress={handleCancel}
              className="w-4/12 bg-red-500 text-white py-2 rounded-lg"
            />
          </View>
        </View>
      ) : (
        <>
          <View className="flex flex-col gap-2 mt-1 mx-1.5">
            <Text className="text-lg">
              Morning: {times.morning.join(" - ")}
            </Text>
            <Text className="text-lg">Noon: {times.noon.join(" - ")}</Text>
            <Text className="text-lg">Night: {times.night.join(" - ")}</Text>
          </View>
          <View className="flex flex-row-reverse">
            <Button
              text="Edit"
              onPress={() => setEditMode(true)}
              className="w-4/12 bg-blue-[#2f95dc] text-white py-2 rounded-lg"
            />
          </View>
        </>
      )}
    </View>
  );
}

export default MedicationSchedule;
