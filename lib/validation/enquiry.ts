import { z } from "zod";
import { destinations } from "@/data/destinations";
import { services } from "@/data/services";

/**
 * Shared primitives. These are the single source of truth for both
 * client-side (react-hook-form) and server-side (Route Handler)
 * validation — the server re-runs this same schema and never trusts the
 * client's pass/fail result.
 */

function nonEmptyEnum(values: string[]) {
  return z.enum(values as [string, ...string[]]);
}

const countryValues = [...destinations.map((d) => d.name), "Other"];
const serviceValues = [...services.map((s) => s.title), "Not Sure Yet"];
const qualificationValues = [
  "High School",
  "Undergraduate",
  "Graduate",
  "Postgraduate",
  "Other",
];

export const countrySchema = nonEmptyEnum(countryValues);
export const serviceSchema = nonEmptyEnum(serviceValues);
export const qualificationSchema = nonEmptyEnum(qualificationValues);
export const enquiryTypeSchema = z.enum(["general", "consultation"]);
export const enquiryStatusSchema = z.enum([
  "new",
  "contacted",
  "qualified",
  "closed",
  "spam",
]);

const nameSchema = z
  .string()
  .trim()
  .min(2, "Please enter your full name.")
  .max(120, "Name is too long.")
  .transform((value) => value.replace(/\s+/g, " "));

const phoneSchema = z
  .string()
  .trim()
  .min(7, "Please enter a valid phone number.")
  .max(20, "Phone number is too long.")
  .regex(/^[+\d][\d\s()-]{5,19}$/, "Please enter a valid phone number.")
  .transform((value) => value.replace(/[\s()-]/g, ""));

const emailSchema = z
  .string()
  .trim()
  .max(254, "Email is too long.")
  .email("Please enter a valid email address.")
  .transform((value) => value.toLowerCase());

const messageSchema = z
  .string()
  .trim()
  .max(4000, "Message is too long.")
  .optional()
  .or(z.literal(""));

const courseSchema = z
  .string()
  .trim()
  .max(160, "Course name is too long.")
  .optional()
  .or(z.literal(""));

const consentSchema = z.literal(true, {
  message: "Please confirm you agree to be contacted before submitting.",
});

/** Honeypot field name shared by both forms — must stay empty. */
export const HONEYPOT_FIELD = "company_website";

const antiSpamFields = {
  [HONEYPOT_FIELD]: z.string().max(0).optional().or(z.literal("")),
  turnstileToken: z.string().min(1, "Please complete the verification challenge."),
  formRenderedAt: z.number(),
};

export const contactFormSchema = z.object({
  fullName: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  interestedCountry: countrySchema,
  serviceRequired: serviceSchema,
  message: messageSchema,
  consent: consentSchema,
  ...antiSpamFields,
});

export const consultationFormSchema = z.object({
  fullName: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  currentQualification: qualificationSchema,
  preferredCountry: countrySchema,
  interestedCourse: courseSchema,
  message: messageSchema,
  consent: consentSchema,
  ...antiSpamFields,
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type ConsultationFormInput = z.infer<typeof consultationFormSchema>;

/** Attribution metadata captured client-side and re-validated server-side. */
export const attributionSchema = z.object({
  source_path: z.string().max(300).optional(),
  referrer: z.string().max(500).optional(),
  utm_source: z.string().max(120).optional(),
  utm_medium: z.string().max(120).optional(),
  utm_campaign: z.string().max(120).optional(),
});
export type Attribution = z.infer<typeof attributionSchema>;
