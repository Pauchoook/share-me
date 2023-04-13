import { create } from "zustand";
import { IUserDoc, IUser } from "../type/user";
import { userQuery } from "../utils/data";
import { client } from "../utils/client";

interface IUserStore {
  user: IUser | null;
  addUser: (user: IUser) => void;
  removeUser: () => void;
  checkUser: () => void;
}

const useUserStore = create<IUserStore>()((set) => ({
  user: null,
  addUser: (user) => set({ user }),
  removeUser: () => set({ user: null }),
  checkUser: async () => {
    const localUserId = JSON.parse(localStorage.getItem("userId") || "{}");
    const query = userQuery(localUserId);
    client
      .fetch(query)
      .then((data: IUserDoc[]) => set({ user: { ...data[0], name: data[0]?.username, sub: data[0]?._id } }));
  },
}));

export default useUserStore;