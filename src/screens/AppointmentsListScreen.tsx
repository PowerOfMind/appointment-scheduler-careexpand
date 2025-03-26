import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getAppointments } from "../redux/appointments/appointmentsSlice";
import { AntDesign } from "@expo/vector-icons";
import AppointmentFormModal from "../components/AppointmentFormModal";

const AppointmentsListScreen = () => {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector(
    (state) => state.appointments
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(getAppointments());
  }, [] );
  
  const capitalizeFirst = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#007AFF" />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{capitalizeFirst(item.name)}</Text>
            <Text style={styles.subtitle}>
              {item.date} at {item.time}
            </Text>
            <Text>
              {capitalizeFirst(item.description)}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <AntDesign name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      <AppointmentFormModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
};

export default AppointmentsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
    padding: 16,
  },
  card: {
    marginBottom: 12,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  title: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#222",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  error: {
    color: "red",
    marginVertical: 10,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    backgroundColor: "#007AFF",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});
