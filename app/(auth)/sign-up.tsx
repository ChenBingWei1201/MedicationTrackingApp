import { Text, View, TextInput, Alert } from "react-native";
import { Stack, Link } from "expo-router";
import { useState } from "react";
import Button from "@components/Button";
import { supabase } from "@/lib/supabase";
import { Image } from "react-native";

function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const defaultAvatarUrl = "https://example.com/default-avatar.png";

  const adjectives = ["Brave", "Clever", "Witty", "Happy", "Bold"];
  const nouns = ["Lion", "Tiger", "Bear", "Eagle", "Shark"];

  const generateRandomUsername = () => {
    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    return `${randomAdjective}${randomNoun}${randomNumber}`;
  };

  const signUpWithEmail = async () => {
    setLoading(true);
    const fullName = generateRandomUsername();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          avatar_url: defaultAvatarUrl,
        },
      },
    });
    if (error) {
      Alert.alert("Error: ", error.message);
    } else {
      console.log("User signed up successfully"); // Debugging: Confirm successful signup
    }
    setLoading(false);
  };

  return (
    <View className="w-11/12 sm:w-11/12 md:w-11/12 lg:w-5/12 xl:w-10/12 mx-auto flex-1 justify-center p-4">
      <Stack.Screen
        options={{
          title: "Sign up",
        }}
      />
      <Image
        src="https://i.postimg.cc/VdJXW8h1/logo.png"
        className="w-48 h-48 self-center rounded-full mb-1"
        alt="logo"
      />
      <Text className="text-black text-2xl mb-5 self-center">
        Medication Tracking App
      </Text>
      <Text className="text-black text-lg">Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="email@gmail.com"
        className="border border-gray-400 p-2 mt-1 mb-4 rounded bg-white text-lg"
        placeholderTextColor="gray"
      />

      <Text className="text-black text-lg">Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="password"
        secureTextEntry
        className="border border-gray-400 p-2 mt-1 mb-4 rounded bg-white text-lg"
        placeholderTextColor="gray"
      />

      <Button
        text={loading ? "Creating account..." : "Create account"}
        disabled={loading}
        onPress={signUpWithEmail}
        className="w-full"
      />
      <View className="flex-row justify-center mt-4 gap-2">
        <Text className="text-black text-center text-lg">
          Already have an account?
        </Text>
        <Link
          href="/sign-in"
          className="self-center font-bold text-[#2f95dc] text-lg"
        >
          Sign In
        </Link>
      </View>
    </View>
  );
}

export default SignUpScreen;