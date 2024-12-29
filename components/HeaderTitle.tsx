import { View, Text, Image } from "react-native";

function HeaderTitle({ title }: { title: string }) {
  return (
    <View className="flex flex-row items-center gap-2">
      <Image
        src="https://i.postimg.cc/VdJXW8h1/logo.png"
        className="w-14 h-14 rounded-full"
      />
      <Text className="text-black text-3xl font-semibold">{title}</Text>
    </View>
  );
}

export default HeaderTitle;
