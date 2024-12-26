import { useState } from "react";
import { View, Text, Modal, TouchableOpacity, FlatList } from "react-native";
import { Calendar } from "react-native-calendars";
import { useAuth } from "@providers/AuthProvider";
import type { CalendarDay } from "@/shared/types";

const UserCalendar = () => {
  const { medicationLogs } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Format data for Calendar
  const markedDates = medicationLogs.reduce(
    (acc, log) => {
      const dots = acc[log.date]?.dots || [];

      if (!log.taken) {
        if (
          log.time === "Morning" &&
          !dots.some((dot: any) => dot.key === "morning")
        ) {
          dots.push({ key: "Morning", color: "red" });
        } else if (
          log.time === "Noon" &&
          !dots.some((dot: any) => dot.key === "Noon")
        ) {
          dots.push({ key: "Noon", color: "orange" });
        } else if (
          log.time === "Night" &&
          !dots.some((dot: any) => dot.key === "Night")
        ) {
          dots.push({ key: "Night", color: "brown" });
        }
      }

      if (dots.length > 0) {
        // Sort dots to ensure the order is Morning, Noon, Night
        dots.sort((a: any, b: any) => {
          const order = { Morning: 1, Noon: 2, Night: 3 };
          return (
            order[a.key as keyof typeof order] -
            order[b.key as keyof typeof order]
          );
        });
        acc[log.date] = { dots };
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  // Show modal with the selected date's data
  const handleDayPress = (day: CalendarDay) => {
    setSelectedDate(day.dateString);
    setIsModalVisible(true);
  };

  return (
    <View className="w-full mt-1.5 p-4 bg-white rounded-lg shadow-md">
      <Text className="text-2xl font-bold text-center">📅 Calendar</Text>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        markingType="multi-dot"
        theme={{
          todayTextColor: "blue",
          dotStyle: { width: 6, height: 6, borderRadius: 3 },
        }}
      />
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center bg-black/50"
          activeOpacity={1}
          onPressOut={() => setIsModalVisible(false)}
        >
          <View className="w-11/12 bg-white rounded-lg p-5 shadow-lg">
            <Text className="text-xl font-bold mb-3 text-center">
              Medication Records for {selectedDate}
            </Text>
            {selectedDate &&
            medicationLogs.filter((log) => log.date === selectedDate).length >
              0 ? (
              <FlatList
                data={medicationLogs
                  .filter((log) => log.date === selectedDate)
                  .sort((a, b) => a.time.localeCompare(b.time))}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View className="flex flex-row items-center mb-2">
                    <Text className="text-lg">
                      {item.time.charAt(0).toUpperCase() + item.time.slice(1)}:
                      {item.taken ? ` Taken` : " Missed"}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <Text className="text-lg text-center mb-1">
                No data available
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default UserCalendar;
