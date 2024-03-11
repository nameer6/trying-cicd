import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface CreateRevealState {
  create_reveal_state: {
    questionToReveal: null | string;
    selected_category: {
      question_category_id: string;
      category_name: string;
      category_image: string;
    };
  };
  shareDirectlyWith: null | any; // Replace 'any' with the actual type if known
  currentAudio: null | any; // Replace 'any' with the actual type if known
  questions_to_exclude: string[]; // Specify the type for the array
  revealToPost: any;
}

const initialState: CreateRevealState = {
  create_reveal_state: {
    questionToReveal: null,
    selected_category: {
      question_category_id: 'random',
      category_name: 'Random',
      category_image: '❓',
    },
  },
  shareDirectlyWith: null,
  currentAudio: null,
  questions_to_exclude: [],
  revealToPost: null,
};

const createRevealSlice = createSlice({
  name: 'createReveal',
  initialState,
  reducers: {
    updateCreateRevealState(state, action: PayloadAction<any>) {
      state.create_reveal_state = {
        ...state.create_reveal_state,
        ...action.payload,
      };
    },
    updateShareDirectlyWith(state, action: PayloadAction<any>) {
      state.shareDirectlyWith = action.payload;
    },
    updateCurrentAudio(state, action: PayloadAction<any>) {
      state.currentAudio = action.payload;
    },
    updateQuestionsToExclude(state, action: PayloadAction<string>) {
      const newQuestion = action.payload;
      // Use spread operator to append the new question to the existing array
      state.questions_to_exclude = [...state.questions_to_exclude, newQuestion];
    },
    updateRevealToPost(state, action: PayloadAction<any>) {
      state.revealToPost = action.payload;
    },
  },
});

export const {
  updateCreateRevealState,
  updateShareDirectlyWith,
  updateCurrentAudio,
  updateQuestionsToExclude,
  updateRevealToPost,
} = createRevealSlice.actions;
export default createRevealSlice.reducer;
