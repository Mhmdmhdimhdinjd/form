import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const loadFromLocalStorage = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const data = localStorage.getItem('formData');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return [];
  }
};

const saveToLocalStorage = (data) => {
  try {
    localStorage.setItem('formData', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

const initialState = loadFromLocalStorage();

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    addDataEntry: (state, action) => {
      const newData = { ...action.payload, id: uuidv4() };
      state.push(newData); // چون استیت آرایه است
      saveToLocalStorage(state);
    },
    setData: (state, action) => {
      state.length = 0; // خالی کردن آرایه
      state.push(...action.payload); // پر کردن با داده جدید
      saveToLocalStorage(state);
    },
  },
});

export const { addDataEntry, setData } = dataSlice.actions;
export default dataSlice.reducer;
