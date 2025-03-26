import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Pressable,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { createAppointment } from "../redux/appointments/appointmentsSlice";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import DateTimePicker from "@react-native-community/datetimepicker";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  visible: boolean;
  onClose: () => void;
};

const AppointmentFormModal = ({ visible, onClose }: Props) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.appointments);

  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

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
      onClose();
    } catch (error) {
      Alert.alert("Error", "Could not create appointment");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

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
          {errors.name && (
            <Text style={styles.error}>{errors.name.message}</Text>
          )}

          <Text style={styles.label}>Date</Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            <Text>
              {date ? dayjs(date).format("YYYY-MM-DD") : "Select Date"}
            </Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              onChange={(e, selected) => {
                setShowDatePicker(false);
                if (selected) setDate(selected);
              }}
            />
          )}

          <Text style={styles.label}>Time</Text>
          <Pressable
            onPress={() => setShowTimePicker(true)}
            style={styles.input}
          >
            <Text>{time ? dayjs(time).format("HH:mm") : "Select Time"}</Text>
          </Pressable>
          {showTimePicker && (
            <DateTimePicker
              value={time || new Date()}
              mode="time"
              is24Hour
              onChange={(e, selected) => {
                setShowTimePicker(false);
                if (selected) setTime(selected);
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
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <Button title="Submit" onPress={handleSubmit(onSubmit)} />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AppointmentFormModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  closeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  label: {
    fontWeight: "600",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  error: {
    color: "red",
    fontSize: 13,
  },
});
