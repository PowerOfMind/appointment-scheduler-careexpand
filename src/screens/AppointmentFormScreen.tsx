import React, { useState, useRef, useEffect } from "react";
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
  Animated,
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [
      {
        translateY: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <AnimatedInput
        label="Name"
        control={control}
        name="name"
        errors={errors.name}
        animatedStyle={animatedStyle}
      />

      <AnimatedPicker
        label="Date"
        value={date ? dayjs(date).format("YYYY-MM-DD") : "Select Date"}
        onPress={() => setShowDatePicker(true)}
        animatedStyle={animatedStyle}
      />
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

      <AnimatedPicker
        label="Time"
        value={time ? dayjs(time).format("HH:mm") : "Select Time"}
        onPress={() => setShowTimePicker(true)}
        animatedStyle={animatedStyle}
      />
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

      <AnimatedInput
        label="Description"
        control={control}
        name="description"
        errors={errors.description}
        animatedStyle={animatedStyle}
      />

      <Animated.View style={[animatedStyle, styles.submitContainer]}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Submit" onPress={handleSubmit(onSubmit)} />
        )}
      </Animated.View>
    </View>
  );
};

const AnimatedInput = ({ label, control, name, errors, animatedStyle }: any) => (
  <Animated.View style={animatedStyle}>
    <Text style={styles.label}>{label}</Text>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
        />
      )}
    />
    {errors && <Text style={styles.error}>{errors.message}</Text>}
  </Animated.View>
);

const AnimatedPicker = ({ label, value, onPress, animatedStyle }: any) => (
  <Animated.View style={animatedStyle}>
    <Text style={styles.label}>{label}</Text>
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pickerButton,
        pressed && { backgroundColor: "#e6f0ff" },
      ]}
    >
      <Text style={styles.pickerText}>{value}</Text>
    </Pressable>
  </Animated.View>
);

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
  submitContainer: {
    marginTop: 32,
  },
});
