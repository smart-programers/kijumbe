import React, { useState } from "react";
import { StyleSheet, View, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { FAB, Button, Modal, Portal, Text, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import GroupForm from "./groupForm";
import { useForm } from "react-hook-form";

const { height } = Dimensions.get("window");

export default function GroupModal({refreshAction}:{refreshAction: () => void }) {
  const [visible, setVisible] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const theme = useTheme();
  
  const {
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      remarks: "",
      amount: 0,
      phoneNumber: "",
    },
  });

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log("Form data:", data);
     
      hideModal();
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <FAB
        icon={() => <Ionicons name="add" size={24} color="#FFFFFF" />}
        label="Unda Mchezo Mpya"
        color="#FFFFFF"
        style={styles.fab}
        onPress={showModal}
      />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.handle} />
            
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Unda Mchezo Mpya</Text>
              <TouchableOpacity onPress={hideModal}>
                <Ionicons name="close" size={24} color="#757575" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.formContainer}>
              <GroupForm hideModal={hideModal} refreshAction={refreshAction} />
            </ScrollView>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#009c41',
    borderRadius: 28,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.9, // Take up 90% of screen height
    paddingBottom: 20,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#DDDDDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
  },
});