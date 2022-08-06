import { getAuth } from "firebase/auth";
import { defineStore } from "pinia";
import { IHistoryEntry } from "../types/IHistoryEntry";

import type { IMember } from "../types/IMember";
import { Either } from "../utils";

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
          id: "cccccc",
          points: 100,
          history: [
            {
              id: "asdfasdf",
              change: 100,
              timestamp: new Date(10),
              message: "Completed question",
              adminName: "Yunze",
            },
          ],
        },
        {
          name: "Test 2",
          id: "abababababa",
          points: -10,
          history: [
            {
              id: "sdfasdfasd",
              change: 90,
              timestamp: new Date(100),
              message: "Did something good",
              adminName: "AJR",
            },
            {
              id: "adfsdyuf",
              change: -100,
              timestamp: new Date(101),
              message: "Did something bad",
              adminName: "Yunze",
            },
          ],
        },
        {
          name: "Test 3",
          id: "asdssssss",
          points: 300,
          history: [
            {
              id: "ouisdofsd",
              change: 100,
              timestamp: new Date(11),
              message: "Completed another question",
              adminName: "Yunze",
            },

            {
              id: "xasdfasdfx",
              change: 100,
              timestamp: new Date(12),
              message: "Completed yet another question",
              adminName: "Yunze",
            },

            {
              id: "yasdysy",
              change: 100,
              timestamp: new Date(10),
              message: "Completed question",
              adminName: "AJR",
            },
          ],
        },
        {
          name: "Test 4",
          id: "asdfa",
          points: 50,
          history: [
            {
              id: "asdfsfysfyysdf",
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
    // members sorted by points
    leaderboardEntries(): IMember[] {
      return [...this.members].sort((a, b) => b.points - a.points);
    },
    // all history from all members
    allHistory(): IHistoryEntry<"with member">[] {
      const allHistory: IHistoryEntry<"with member">[] = [];
      for (const member of this.members) {
        for (const historyEntry of member.history) {
          allHistory.push({ ...historyEntry, memberName: member.name });
        }
      }
      allHistory.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      return allHistory;
    },
  },
  actions: {
    async addPoints(
      memberId: string,
      deltaAmount: number,
      message: string
    ): Promise<Either<undefined, string>> {
      const currentUser = getAuth().currentUser;

      if (!currentUser) {
        return [null, "cannot modify points, not signed in as admin"];
      }

      // for now just modify the hardcoded stuff
      for (const member of this.members) {
        if (member.id == memberId) {
          member.points += deltaAmount;
          member.history.push({
            id: "ugh",
            change: deltaAmount,
            message,
            timestamp: new Date(),
            adminName: "test admin", // todo: make this actually use the current user
          });
          return [undefined, null];
        }
      }
      return [null, `member with id ${memberId} not found`];
    },
  },
});
