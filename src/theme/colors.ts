// Design tokens sampled from the design file. Screens must use these, never raw hex values.
export const colors = {
  primary: "#64EDF7", // CTAs, active tab, selected state
  onPrimary: "#044449", // labels on primary buttons
  accent: "#CB64F7", // badges, "Best Value", gradient end
  gradient: ["#64EDF7", "#CB64F7"], // popular / best value pack headers
  background: "#000000",
  backgroundNavy: "#061532", // used inside gradients
  surface: "#18172B", // cards, sheets
  surfaceRaised: "#1E1D35",
  border: "#322F56",
  textPrimary: "#FFFFFF",
  textMuted: "#C0BEDA", // secondary labels
  lockCoin: "#FACC15", // small coin badge on the lock icon
} as const;
