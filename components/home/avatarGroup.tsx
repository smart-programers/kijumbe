import { Text } from "react-native";
import { View, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import Notification from "./notification";

interface User {
  firstName?: string;
  photoUrl?: string;
}
export default function AvatarGroup({ user }: User) {
  const firstName = "Guest";
  const welcomeApp = "Karibu Kijumbe App";
  const welcome = user
    ? `Habari ${user?.firstName?.charAt(0)?.toUpperCase()}${user?.firstName?.slice(1)}`
    : `Habari ${firstName.charAt(0).toUpperCase()}${firstName.slice(1)}`;
  return (
    <View style={styles.avatar}>
      {user ? (
        user?.photoUrl ? (
          <Avatar.Image size={40} source={{ uri: user.photoUrl }} />
        ) : (
          <Avatar.Text
            size={40}
            label={`${user?.firstName?.charAt(0)?.toUpperCase()}`}
          />
        )
      ) : (
        <Avatar.Text
          size={40}
          label={`${firstName?.charAt(0)?.toUpperCase()}`}
        />
      )}
      <View>
        <Text style={styles.text}>{welcome}</Text>
        <Text>{welcomeApp}</Text>
      </View>
      <Notification />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginHorizontal: 50,
    flexDirection: "row",
  },
  text: {
    fontSize: 20,
  },
});
