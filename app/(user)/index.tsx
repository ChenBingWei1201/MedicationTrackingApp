import { ScrollView } from "react-native";
import UserCalendar from "@/components/UserCalendar";
import MedicationSchedule from "@components/MedicationSchedule";

const HomeScreen = () => {
  return (
    <ScrollView className="w-11/12 sm:w-11/12 md:w-11/12 lg:w-5/12 xl:w-10/12 mx-auto p-4 gap-2">
      <UserCalendar />
      <MedicationSchedule />
    </ScrollView>
  );
};

export default HomeScreen;
