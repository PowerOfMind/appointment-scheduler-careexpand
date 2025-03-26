import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";

import AppointmentsListScreen from "./src/screens/AppointmentsListScreen";
import AppointmentFormScreen from "./src/screens/AppointmentFormScreen";

const RootStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

const MainStackScreen = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="Appointments" component={AppointmentsListScreen} />
  </MainStack.Navigator>
);

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen
            name="Main"
            component={MainStackScreen}
            options={{ headerShown: false }}
          />
          {/* <RootStack.Screen
            name="AppointmentForm"
            component={AppointmentFormScreen}
            options={{
              title: "New Appointment",
            }}
          /> */}
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
