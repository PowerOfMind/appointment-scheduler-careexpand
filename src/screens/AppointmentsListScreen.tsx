// src/screens/AppointmentsListScreen.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getAppointments } from "../redux/appointments/appointmentsSlice";

const AppointmentsListScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector(
    (state) => state.appointments
  );

  useEffect(() => {
    dispatch(getAppointments());
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title="Add Appointment"
        onPress={() => navigation.navigate("New Appointment" as never)}
      />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>
              {item.date} at {item.time}
            </Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default AppointmentsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginVertical: 10,
  },
});
