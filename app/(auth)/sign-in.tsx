import { Text, View, TextInput, Alert } from "react-native";
import { Stack, Link } from "expo-router";
import { useState } from "react";
import Button from "@components/Button";
import { supabase } from "@lib/supabase";
import { Image } from "react-native";

function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signInWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      Alert.alert("Error: ", error.message);
      setEmail("");
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <View className="w-11/12 sm:w-11/12 md:w-11/12 lg:w-5/12 xl:w-10/12 mx-auto flex-1 justify-center p-4">
      <Stack.Screen
        options={{
          title: "Sign in",
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
        text={loading ? "Signing in..." : "Sign in"}
        onPress={signInWithEmail}
        disabled={loading}
        className="w-full"
      />
      <View className="flex-row justify-center mt-4 gap-2">
        <Text className="text-black text-center text-lg">
          Don't have an account?
        </Text>
        <Link
          href="/sign-up"
          className="self-center font-bold text-[#2f95dc] text-lg"
        >
          Sign Up
        </Link>
      </View>
    </View>
  );
}

export default SignInScreen;
