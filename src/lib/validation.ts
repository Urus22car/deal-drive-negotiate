import { z } from "zod";

// Car listing validation schema
export const listingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  price: z
    .number()
    .min(10000, "Price must be at least ₹10,000")
    .max(100000000, "Price must be less than ₹10,00,00,000"),
  year: z
    .number()
    .min(1980, "Year must be 1980 or later")
    .max(new Date().getFullYear() + 1, `Year cannot be after ${new Date().getFullYear() + 1}`),
  mileage: z
    .number()
    .min(0, "Mileage cannot be negative")
    .max(1000000, "Mileage seems unrealistic")
    .optional()
    .nullable(),
  location: z
    .string()
    .trim()
    .max(200, "Location must be less than 200 characters")
    .optional(),
  transmission: z
    .enum(["manual", "automatic", ""])
    .optional(),
  fuel: z
    .enum(["petrol", "diesel", "ev", "hybrid", ""])
    .optional(),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  features: z
    .string()
    .trim()
    .max(500, "Features must be less than 500 characters")
    .optional(),
});

// Offer validation schema
export const offerSchema = z.object({
  amount: z
    .number()
    .min(1000, "Offer must be at least ₹1,000")
    .max(100000000, "Offer must be less than ₹10,00,00,000"),
  message: z
    .string()
    .trim()
    .max(500, "Message must be less than 500 characters")
    .optional(),
});

// Phone validation schema
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format");

// Helper function to validate and parse listing data
export function validateListing(data: {
  title: string;
  price: string;
  year: string;
  mileage: string;
  location: string;
  transmission: string;
  fuel: string;
  description: string;
  features: string;
}) {
  return listingSchema.safeParse({
    title: data.title,
    price: data.price ? parseFloat(data.price) : undefined,
    year: data.year ? parseInt(data.year, 10) : undefined,
    mileage: data.mileage ? parseInt(data.mileage, 10) : null,
    location: data.location || undefined,
    transmission: data.transmission || undefined,
    fuel: data.fuel || undefined,
    description: data.description || undefined,
    features: data.features || undefined,
  });
}

// Helper function to validate offer amount
export function validateOffer(amount: string, message?: string) {
  return offerSchema.safeParse({
    amount: amount ? parseFloat(amount) : undefined,
    message: message || undefined,
  });
}

// Extract first error message from zod error
export function getFirstErrorMessage(error: z.ZodError): string {
  return error.errors[0]?.message || "Validation failed";
}
