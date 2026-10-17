/** Device geometry is never stretched: only column positions and routes grow. */
export const homeViewBox = "0 0 800 560";
export const homeNodePositions = [
  [110, 135],
  [110, 365],
  [400, 135],
  [690, 135],
  [670, 365],
  [400, 365],
] as const;
export const homeRoutes = {
  phone: "M148 135H316",
  tablet: "M202 365H248Q270 365 270 343V182Q270 160 292 160H316",
  backend: "M491 135H606",
  usb: "M745 160H776V353Q776 365 764 365H762",
  radio: "M617 299Q552 304 487 365",
};
export const homeReturnRoutes = {
  phone: "M316 135H148",
  tablet: "M316 160H292Q270 160 270 182V343Q270 365 248 365H202",
  backend: "M606 135H491",
  usb: "M762 365H764Q776 365 776 353V160H745",
  radio: "M487 365Q552 304 617 299",
};
export const homeProcessPath = "M316 135H491";
export const homeTransmitPath =
  "M606 135H690L745 160H776V353Q776 365 764 365H762H621Q617 365 617 361V299Q552 304 487 365";
export const homeAckPath =
  "M487 365Q552 304 617 299V361Q617 365 621 365H762H764Q776 365 776 353V160H745L690 135H491";
export const homeFanoutPhone = "M316 135H172";
export const homeFanoutTablet =
  "M316 160H292Q270 160 270 182V343Q270 365 248 365H228";

/** Track, knob and travel are shared by static geometry and the live pose. */
export const homeToggleGeometry = {
  phone: { width: 28, radius: 5, travel: 14 },
  tablet: { width: 40, radius: 6, travel: 22 },
} as const;
