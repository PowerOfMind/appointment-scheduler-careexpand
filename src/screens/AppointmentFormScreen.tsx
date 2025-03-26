import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { createAppointment } from "../redux/appointments/appointmentsSlice";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

type FormData = z.infer<typeof formSchema>;

const AppointmentFormScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { loading } = useAppSelector((state) => state.appointments);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (!date || !time) {
      Alert.alert("Validation", "Please select date and time");
      return;
    }

    const fullDate = dayjs(date).format("YYYY-MM-DD");
    const fullTime = dayjs(time).format("HH:mm");

    try {
      await dispatch(
        createAppointment({
          name: data.name,
          description: data.description,
          date: fullDate,
          time: fullTime,
        })
      ).unwrap();
      navigation.goBack();
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
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <Text style={styles.label}>Date</Text>
      <Pressable onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>{date ? dayjs(date).format("YYYY-MM-DD") : "Select Date"}</Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Time</Text>
      <Pressable onPress={() => setShowTimePicker(true)} style={styles.input}>
        <Text>{time ? dayjs(time).format("HH:mm") : "Select Time"}</Text>
      </Pressable>
      {showTimePicker && (
        <DateTimePicker
          value={time || new Date()}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}

      <Text style={styles.label}>Description</Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.description && (
        <Text style={styles.error}>{errors.description.message}</Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
      )}
    </View>
  );
};

export default AppointmentFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f9fc",
  },
  label: {
    fontWeight: "600",
    marginTop: 16,
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginTop: 6,
    marginBottom: 6,
    fontSize: 16,
  },
  error: {
    color: "#ff4d4f",
    marginTop: 4,
    fontSize: 13,
  },
  pickerButton: {
    borderWidth: 1.5,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginTop: 6,
  },
  pickerText: {
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

