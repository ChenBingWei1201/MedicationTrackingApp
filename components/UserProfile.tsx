import { useState, useEffect } from "react";
import { View, Text, TextInput, Image } from "react-native";
import Button from "@components/Button";
import { supabase } from "@lib/supabase";
import { useAuth } from "@providers/AuthProvider";
import { Redirect } from "expo-router";

function UserProfile() {
  const { profile, updateUserProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.full_name && profile?.avatar_url) {
      setFullName(profile.full_name);
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  const handleSave = async () => {
    setLoading(true);
    updateUserProfile({ fullName, avatarUrl });
    setEditMode(false);
    setLoading(false);
  };

  const handleCancel = () => {
    setFullName(profile.full_name);
    setAvatarUrl(profile.avatar_url);
    setEditMode(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    return <Redirect href="/(auth)/sign-in" />;
  };

  return (
    <View className="flex flex-col justify-center items-center gap-6 w-11/12 sm:w-11/12 md:w-11/12 lg:w-5/12 xl:w-10/12 mx-auto p-6 bg-white rounded-lg shadow-lg mt-4">
      {editMode ? (
        <View className="flex flex-col gap-4 w-full">
          <Text className="text-3xl font-bold text-center">Edit Profile</Text>
          <Text className="text-lg font-semibold">Full Name</Text>
          <TextInput
            value={fullName}
            onChangeText={(text) => setFullName(text)}
            placeholder="Full Name"
            className="border border-gray-300 p-3 rounded-lg bg-white text-lg w-full"
          />
          <Text className="text-lg font-semibold">Avatar URL</Text>
          <TextInput
            value={avatarUrl}
            onChangeText={(text) => setAvatarUrl(text)}
            placeholder="Avatar URL"
            className="border border-gray-300 p-3 rounded-lg bg-white text-lg w-full"
          />
          <View className="flex flex-row-reverse gap-3 w-full mt-4">
            <Button
              text={loading ? "Saving..." : "Save"}
              onPress={handleSave}
              className="w-5/12 bg-green-500 text-white py-2 rounded-lg"
              disabled={loading}
            />
            <Button
              text="Cancel"
              onPress={handleCancel}
              className="w-5/12 bg-red-500 text-white py-2 rounded-lg"
            />
          </View>
        </View>
      ) : (
        <>
          {profile?.avatar_url && (
            <Image
              source={{ uri: profile.avatar_url }}
              className="w-48 h-48 rounded-full border-4 border-gray-200 shadow-md"
            />
          )}
          <Text className="text-4xl font-bold mt-1">{profile?.full_name}</Text>
          <View className="flex flex-col gap-3 w-full mt-3">
            <Button
              text="Edit"
              onPress={() => setEditMode(true)}
              className="w-full bg-blue-[#2f95dc] text-white py-2 rounded-lg"
            />
            <Button
              text="Sign Out"
              onPress={handleSignOut}
              className="w-full bg-gray-500 text-white py-2 rounded-lg"
            />
          </View>
        </>
      )}
    </View>
  );
}

export default UserProfile;
