import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  displayName: z.string().min(2, "Display name is required."),
  mobileNumber: z.string().min(8, "Enter a valid mobile number."),
  preferredTone: z.string().min(3, "Add your preferred content tone."),
  favoriteCategory: z.string().min(3, "Add a favorite product category."),
  bio: z.string().min(24, "Share a short member introduction."),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const defaultProfileValues: ProfileFormValues = {
  firstName: "Nur",
  lastName: "Amirah",
  displayName: "Nur Amirah",
  mobileNumber: "+60 12-345 6789",
  preferredTone: "Elegant and educational",
  favoriteCategory: "Gold gifting",
  bio: "I enjoy creating elegant social content and helping my audience discover gift-worthy jewelry collections.",
};
