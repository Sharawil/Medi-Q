import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PatientInfo {
  name: string;
  age: number;
  bloodGroup: string;
  phone?: string;
}

export interface SymptomInfo {
  bodyPart: string;
  symptomAnswers: Record<string, any>;
}

export interface QueueToken {
  id: string;
  patientId: PatientInfo;
  symptomId: SymptomInfo;
  tokenNumber: number;
  status: 'waiting' | 'called' | 'in-consultation' | 'completed';
  checkInTime: string;
}

interface QueueState {
  tokens: QueueToken[];
  currentToken: QueueToken | null;
  loading: boolean;
  error: string | null;
}

const initialState: QueueState = {
  tokens: [],
  currentToken: null,
  loading: false,
  error: null,
};

const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<QueueToken[]>) => {
      state.tokens = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentToken: (state, action: PayloadAction<QueueToken>) => {
      state.currentToken = action.payload;
      state.loading = false;
      state.error = null;
    },
    addToken: (state, action: PayloadAction<QueueToken>) => {
      state.tokens.unshift(action.payload);
      state.currentToken = action.payload;
    },
    updateTokenStatus: (state, action: PayloadAction<{ id: string; status: QueueToken['status'] }>) => {
      const index = state.tokens.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tokens[index] = {
          ...state.tokens[index],
          status: action.payload.status
        };
      }
      if (state.currentToken?.id === action.payload.id) {
        state.currentToken = {
          ...state.currentToken,
          status: action.payload.status
        };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearCurrentToken: (state) => {
      state.currentToken = null;
    },
  },
});

export const { setTokens, setCurrentToken, setStats, addToken, updateTokenStatus, setLoading, setError, clearCurrentToken } = queueSlice.actions;

export default queueSlice.reducer;