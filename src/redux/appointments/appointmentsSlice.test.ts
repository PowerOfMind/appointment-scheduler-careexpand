import appointmentsReducer, {
  getAppointments,
  Appointment,
} from "./appointmentsSlice";

describe("appointmentsSlice", () => {
  const initialState = {
    list: [],
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(appointmentsReducer(undefined, { type: "INIT" })).toEqual(
      initialState
    );
  });

  it("should handle getAppointments.fulfilled", () => {
    const mockAppointments: Appointment[] = [
      {
        id: "1",
        name: "Test Appointment",
        date: "2025-03-30",
        time: "14:00",
        description: "Description here",
      },
    ];

    const nextState = appointmentsReducer(
      initialState,
      getAppointments.fulfilled(mockAppointments, "", undefined)
    );

    expect(nextState).toEqual({
      ...initialState,
      list: mockAppointments,
      loading: false,
    });
  });

  it("should handle getAppointments.pending", () => {
    const nextState = appointmentsReducer(
      initialState,
      getAppointments.pending("", undefined)
    );
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBe(null);
  });

  it("should handle getAppointments.rejected", () => {
    const nextState = appointmentsReducer(
      initialState,
      getAppointments.rejected(new Error(), "", undefined, "Failed to load")
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe("Failed to load");
  });
});
