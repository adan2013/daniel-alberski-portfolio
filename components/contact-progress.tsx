"use client";
import { createContext, useContext } from "react";

/** What the contact form tells a figure drawn beside it. */
export interface ContactProgress {
  /** Characters currently typed into the visible fields. */
  typed: number;
  /** Messages sent successfully since the page loaded. */
  sent: number;
}

export const ContactProgressContext = createContext<ContactProgress>({
  typed: 0,
  sent: 0,
});

export const useContactProgress = () => useContext(ContactProgressContext);
