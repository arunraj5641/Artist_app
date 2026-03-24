import * as Burnt from "burnt";

/**
 * Toast utility — drop-in replacement for web's react-toastify / react-hot-toast.
 *
 * Usage:
 *   import { toast } from "../utils/toast";
 *   toast.success("User created!");
 *   toast.error("Something went wrong");
 *   toast.info("Loading...");
 */
export const toast = {
  success: (message: string) => {
    Burnt.toast({
      title: message,
      preset: "done",
      haptic: "success",
      duration: 3,
    });
  },

  error: (message: string) => {
    Burnt.toast({
      title: message,
      preset: "error",
      haptic: "error",
      duration: 4,
    });
  },

  info: (message: string) => {
    Burnt.toast({
      title: message,
      preset: "none",
      haptic: "warning",
      duration: 3,
    });
  },

  /**
   * Shows a native alert-style sheet (like a confirmation dialog).
   * Replaces window.confirm() / react-toastify's dismiss-on-action pattern.
   */
  alert: (title: string, message?: string) => {
    Burnt.alert({
      title,
      message,
      preset: "heart",
      duration: 3,
    });
  },
};
