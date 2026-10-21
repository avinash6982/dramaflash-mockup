import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";

import { coinPacks, STARTING_COINS } from "@/data/coinPacks";

import { unlockEpisode, unlockSeason } from "./unlocksSlice";

export type Transaction = {
  id: string;
  kind: "purchase" | "unlock";
  coins: number; // positive for a purchase, negative for an unlock
  createdAt: number;
};

type WalletState = {
  coins: number;
  purchaseStatus: "idle" | "purchasing";
  transactions: Transaction[];
  // Each tap that wants the Buy coins sheet adds 1 (same idea as the unlock sheet's request counter)
  buyCoinsRequest: number;
};

const initialState: WalletState = {
  coins: STARTING_COINS,
  purchaseStatus: "idle",
  transactions: [],
  buyCoinsRequest: 0,
};

// Mocked store purchase: waits about a second, then returns the pack to credit.
// In production this is StoreKit / Play Billing plus server-side receipt validation.
export const purchaseCoins = createAsyncThunk("wallet/purchaseCoins", async (packId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const pack = coinPacks.find((p) => p.id === packId);
  if (!pack) throw new Error(`Unknown coin pack: ${packId}`);
  return pack;
});

function addTransaction(state: WalletState, kind: Transaction["kind"], coins: number) {
  state.coins += coins;
  state.transactions.unshift({ id: nanoid(), kind, coins, createdAt: Date.now() });
}

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    openBuyCoinsSheet: (state) => {
      state.buyCoinsRequest += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(purchaseCoins.pending, (state) => {
        state.purchaseStatus = "purchasing";
      })
      .addCase(purchaseCoins.fulfilled, (state, action) => {
        state.purchaseStatus = "idle";
        addTransaction(state, "purchase", action.payload.coins + action.payload.bonus);
      })
      .addCase(purchaseCoins.rejected, (state) => {
        state.purchaseStatus = "idle";
      })
      .addCase(unlockEpisode.fulfilled, (state, action) => {
        addTransaction(state, "unlock", -action.payload.cost);
      })
      .addCase(unlockSeason.fulfilled, (state, action) => {
        addTransaction(state, "unlock", -action.payload.cost);
      });
  },
});

export const { openBuyCoinsSheet } = walletSlice.actions;
export default walletSlice.reducer;
