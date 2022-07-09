import { defineStore } from "pinia";

import type { IMember } from "../types/IMember";

interface PointsStoreState {
  members: IMember[];
}

export const usePointsStore = defineStore("points", {
  state: () => {
    // fill with dummy data for now
    const state: PointsStoreState = {
      members: [
        {
          name: "Test 1",
          points: 100,
          history: [
            {
              change: 100,
              timestamp: new Date(10),
              message: "Completed question",
              adminName: "Yunze",
            },
          ],
        },
        {
          name: "Test 2",
          points: -10,
          history: [
            {
              change: 90,
              timestamp: new Date(100),
              message: "Did something good",
              adminName: "AJR",
            },
            {
              change: -100,
              timestamp: new Date(101),
              message: "Did something bad",
              adminName: "Yunze",
            },
          ],
        },
        {
          name: "Test 3",
          points: 300,
          history: [
            {
              change: 100,
              timestamp: new Date(11),
              message: "Completed another question",
              adminName: "Yunze",
            },

            {
              change: 100,
              timestamp: new Date(12),
              message: "Completed yet another question",
              adminName: "Yunze",
            },

            {
              change: 100,
              timestamp: new Date(10),
              message: "Completed question",
              adminName: "AJR",
            },
          ],
        },
        {
          name: "Test 4",
          points: 50,
          history: [
            {
              change: 50,
              timestamp: new Date(100),
              message: "Completed half a question..?",
              adminName: "AJR",
            },
          ],
        },
      ],
    };
    return state;
  },
  getters: {
    leaderboardEntries(): IMember[] {
      // sorted by points
      return [...this.members].sort((a, b) => b.points - a.points);
    },
  },
});
