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

export const getAppointments = createAsyncThunk(
  "appointments/getAppointments",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
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

export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (appointment: Omit<Appointment, 'id'>, thunkAPI) => {
    try {
      await axios.post('https://reqres.in/api/appointments', appointment);
      return {
        ...appointment,
        id: nanoid(),
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
          state.list.unshift(action.payload);
        }
      )
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default appointmentsSlice.reducer;
