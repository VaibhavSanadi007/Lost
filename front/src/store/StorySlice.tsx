import { createSlice } from "@reduxjs/toolkit";
import type { ObjType } from "../store/userSlice";

export interface Story {
  ownerId: ObjType;
  mediaUrl?: string;
  storytype: "image" | "video" | "text";
  storytext?: string;
  duration?: number;
  createdAt: Date;
  expiresAt: Date;
  _id: string;
}

type StoryGroupedState = Story[][];

const initialState: StoryGroupedState = [];

const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {

    addStory: (state, action) => {
      const story = action.payload;

      const ownerIndex = state.findIndex(
        (arr) => arr[0]?.ownerId._id === story.ownerId._id
      );

      if (ownerIndex !== -1) {
        state[ownerIndex].push(story);
      } else {
        state.push([story]);
      }
    },

    removeStory: (state, action) => {
      const id = action.payload;

      return state
        .map((group) => group.filter((story) => story._id !== id))
        .filter((group) => group.length > 0); 
    },

    setStories: (_, action ) => {
      const map = new Map<string, Story[]>();

      for (const item of action.payload) {
        if (!map.has(item.ownerId._id)) {
          map.set(item.ownerId._id, []);
        }
        map.get(item.ownerId._id)!.push(item);
      }

      return [...map.values()];
    },
  },
});

export const { addStory, removeStory, setStories } = storySlice.actions;
export default storySlice.reducer;
