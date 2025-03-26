// src/redux/appointments/appointmentsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { nanoid } from "@reduxjs/toolkit";

export interface Appointment {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
}

interface AppointmentsState {
  list: Appointment[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentsState = {
  list: [],
  loading: false,
  error: null,
};

// Async thunk
export const getAppointments = createAsyncThunk(
  "appointments/getAppointments",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      // Adaptamos los datos mock para que encajen
      const adapted = response.data.slice(0, 10).map((item: any) => ({
        id: String(item.id),
        name: item.title,
        date: "2025-03-28",
        time: "10:00",
        description: item.body,
      }));
      return adapted as Appointment[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Failed to load appointments");
    }
  }
);

// Async thunk para crear cita
export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (appointment: Omit<Appointment, 'id'>, thunkAPI) => {
    try {
      // Simulación de envío a una API (reqres permite POST)
      await axios.post('https://reqres.in/api/appointments', appointment);

      // Creamos una cita con ID local (en real API, lo devolvería el backend)
      return {
        ...appointment,
        id: nanoid(), // ID local simulado
      };
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to create appointment');
    }
  }
);

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAppointments.fulfilled,
        (state, action: PayloadAction<Appointment[]>) => {
          state.loading = false;
          state.list = action.payload;
        }
      )
      .addCase(getAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createAppointment.fulfilled,
        (state, action: PayloadAction<Appointment>) => {
          state.loading = false;
          state.list.unshift(action.payload); // Añadir al principio
        }
      )
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
  },
});

export default appointmentsSlice.reducer;
