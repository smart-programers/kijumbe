import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

export default function Notification() {
  return (
    <View style={styles.container}>
      <Ionicons name="notifications-outline" size={30} color="#D32F2F" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  }
});