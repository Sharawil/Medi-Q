import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Symptom {
  id: string;
  patientId: string;
  visitDate: string;
  affectedAreas?: Array<{
    bodyPart: string;
    severity: number;
    description?: string;
  }>;
  primarySymptom?: string;
  symptomDuration?: {
    value: number;
    unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks';
  };
  symptomFrequency?: 'constant' | 'frequent' | 'occasional' | 'rare';
  painLevel?: number;
  fever?: boolean;
  feverTemperature?: number;
  nausea?: boolean;
  vomiting?: boolean;
  dizziness?: boolean;
  headache?: boolean;
  fatigue?: boolean;
  shortnessOfBreath?: boolean;
  chestPain?: boolean;
  priorityLevel: 'low' | 'medium' | 'high' | 'emergency';
  triageScore?: number;
  isReviewedByDoctor?: boolean;
  doctorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface SymptomState {
  symptoms: Symptom[];
  currentSymptom: Symptom | null;
  loading: boolean;
  error: string | null;
}

const initialState: SymptomState = {
  symptoms: [],
  currentSymptom: null,
  loading: false,
  error: null,
};

const symptomSlice = createSlice({
  name: 'symptom',
  initialState,
  reducers: {
    setSymptoms: (state, action: PayloadAction<Symptom[]>) => {
      state.symptoms = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentSymptom: (state, action: PayloadAction<Symptom>) => {
      state.currentSymptom = action.payload;
      state.loading = false;
      state.error = null;
    },
    addSymptom: (state, action: PayloadAction<Symptom>) => {
      state.symptoms.unshift(action.payload);
      state.currentSymptom = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearCurrentSymptom: (state) => {
      state.currentSymptom = null;
    },
    updateSymptom: (state, action: PayloadAction<{ id: string; data: Partial<Symptom> }>) => {
      const index = state.symptoms.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.symptoms[index] = { ...state.symptoms[index], ...action.payload.data };
      }
      if (state.currentSymptom?.id === action.payload.id) {
        state.currentSymptom = { ...state.currentSymptom, ...action.payload.data };
      }
    },
  },
});

export const { setSymptoms, setCurrentSymptom, addSymptom, setLoading, setError, clearCurrentSymptom, updateSymptom } = symptomSlice.actions;

export default symptomSlice.reducer;