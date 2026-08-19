import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import patientReducer from './patientSlice';
import symptomReducer from './symptomSlice';
import queueReducer from './queueSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,
    symptom: symptomReducer,
    queue: queueReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;