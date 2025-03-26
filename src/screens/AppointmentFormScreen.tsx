import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { createAppointment } from "../redux/appointments/appointmentsSlice";

const AppointmentFormScreen = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { loading } = useAppSelector((state) => state.appointments);

  const handleSubmit = async () => {
    if (!name || !date || !time || !description) {
      Alert.alert("Validation", "Please fill all fields.");
      return;
    }

    try {
      await dispatch(
        createAppointment({ name, date, time, description })
      ).unwrap();
      navigation.goBack(); // Volver a la lista
    } catch (error) {
      Alert.alert(
        "Error",
        "Something went wrong while creating the appointment."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />

      <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
      <TextInput value={date} onChangeText={setDate} style={styles.input} />

      <Text style={styles.label}>Time (HH:mm)</Text>
      <TextInput value={time} onChangeText={setTime} style={styles.input} />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Submit" onPress={handleSubmit} />
      )}
    </View>
  );
};

export default AppointmentFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
});
