import { create } from "zustand";
import { client } from "../utils/client";
import { IPin } from "../type/pin";
import { immer } from "zustand/middleware/immer";
import { pinDetailQuery, pinDetailQueryMore, searchPinQuery, slicePinQuery } from "../utils/data";

interface IPinStore {
  currentPin: IPin | null;
  similarCurrentPin: IPin[];
  pins: IPin[];
  loading: boolean;
  searchValue: string;
  startPin: number;
  maxPins: number;
  slicePins: (num: number, categoryId: string, userId?: string) => void;
  setSearchValue: (str: string) => void;
  getPin: (str: string) => void;
  getPins: (categoryId: string, searchValue: string) => void;
  getUserPins: (userId: string, query: string) => void;
}

const usePinStore = create<IPinStore>()(
  immer((set, get) => ({
    currentPin: null,
    similarCurrentPin: [],
    pins: [],
    loading: false,
    searchValue: "",
    startPin: 0,
    maxPins: 30,
    slicePins: (num: number, categoryId: string, userId?: string) => {
      set((state) => {
        state.loading = true;
        state.startPin = state.maxPins;
        state.maxPins += num;

        const query = slicePinQuery(categoryId, state.searchValue, state.startPin, state.maxPins, userId);
        client.fetch(query).then((res) => set({ pins: [...get().pins, ...res], loading: false }));
      });
    },
    setSearchValue: (searchValue: string) => {
      set({ searchValue });
    },
    getPin: (pinId: string) => {
      set({ loading: true });
      const query = pinDetailQuery(pinId);

      client.fetch(query).then((data: IPin[]) => {
        set({ currentPin: data[0] });
        if (data[0]) {
          const queryMore = pinDetailQueryMore(data[0].category, data[0]?._id);
          client.fetch(queryMore).then((res) => {
            set({ similarCurrentPin: res });
            set({ loading: false });
          });
        }
      });
    },
    getPins: (categoryId: string, searchValue: string) => {
      set({ loading: true, startPin: 0, maxPins: 30 });
      const query = searchPinQuery(categoryId, searchValue);
      client.fetch(query).then((data) => set({ pins: data, loading: false }));
    },
    getUserPins: (userId: string, query: string) => {
      set({ loading: true, startPin: 0, maxPins: 10 });
      client.fetch(query).then((data) => set({ pins: data, loading: false }));
    }
  })),
);

export default usePinStore;
