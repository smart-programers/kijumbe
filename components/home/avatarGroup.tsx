import React from 'react';
import { Text, View, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import Notification from "./notification";

interface User {
  firstName?: string;
  photoUrl?: string;
}

export default function AvatarGroup({ user }: { user: User | null }) {
  const defaultFirstName = "Guest";
  const welcomeApp = "Karibu Kijumbe App";
  const firstNameToUse = user?.firstName || defaultFirstName;

  const welcome = `Habari, ${firstNameToUse.charAt(0).toUpperCase()}${firstNameToUse.slice(1)}`;

  return (
    <View style={styles.avatarContainer}>
      {user ? (
        user.photoUrl ? (
          <Avatar.Image size={40} source={{ uri: user.photoUrl }} style={styles.avatarStyle} />
        ) : (
          <Avatar.Text
            size={40}
            label={`${firstNameToUse?.charAt(0)?.toUpperCase() || 'G'}`}
            style={styles.avatarStyle}
            labelStyle={styles.avatarLabel}
            color="#FFFFFF"
          />
        )
      ) : (
        <Avatar.Text
          size={40}
          label={`${defaultFirstName.charAt(0).toUpperCase()}`}
          style={styles.avatarStyle}
          labelStyle={styles.avatarLabel}
          color="#FFFFFF"
        />
      )}
      <View style={styles.textBlock}>
        <Text style={styles.welcomeText}>{welcome}</Text>
        <Text style={styles.subtitleText}>{welcomeApp}</Text>
      </View>
      <Notification />
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 5,
  },
   avatarStyle: {
     backgroundColor: '#009c41',
   },
   avatarLabel: {
      fontSize: 20,
      fontWeight: 'bold',
   },
  textBlock: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitleText: {
    fontSize: 13,
    color: '#666666',
  }
});