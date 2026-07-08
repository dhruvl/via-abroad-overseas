import { z } from "zod";
import { enquiryStatusSchema, enquiryTypeSchema } from "@/lib/validation/enquiry";

export const updateStatusSchema = z.object({
  enquiryId: z.string().uuid(),
  status: enquiryStatusSchema,
});

export const createNoteSchema = z.object({
  enquiryId: z.string().uuid(),
  note: z.string().trim().min(1, "Note cannot be empty.").max(4000, "Note is too long."),
});

export const enquiryFiltersSchema = z.object({
  type: enquiryTypeSchema.optional(),
  status: enquiryStatusSchema.optional(),
  country: z.string().max(120).optional(),
  search: z.string().trim().max(200).optional(),
  sort: z.enum(["newest", "oldest"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type EnquiryFilters = z.infer<typeof enquiryFiltersSchema>;
