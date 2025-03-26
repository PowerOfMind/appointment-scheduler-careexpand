// App.tsx
import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppointmentsListScreen from "./src/screens/AppointmentsListScreen";
import AppointmentFormScreen from "./src/screens/AppointmentFormScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Appointments"
            component={AppointmentsListScreen}
          />
          <Stack.Screen
            name="New Appointment"
            component={AppointmentFormScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
