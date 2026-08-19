import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Patient {
  id: string;
  name: string;
  age: number;
  bloodGroup: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

interface PatientState {
  profile: Patient | null;
  loading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  profile: null,
  loading: false,
  error: null,
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Patient>) => {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
});

export const { setProfile, setLoading, setError, clearProfile } = patientSlice.actions;

export default patientSlice.reducer;