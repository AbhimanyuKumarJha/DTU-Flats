import { z } from "zod";
import {
  PAYMENT_MODES,
  TRANSACTION_STATUS,
  GENDER_OPTIONS,
  FLOOR_OPTIONS,
  CERTIFICATE_OPTIONS,
} from "../constants/formConstants";

export const userSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(GENDER_OPTIONS, {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address cannot exceed 100 characters"),
  floorNumber: z
    .array(z.enum(FLOOR_OPTIONS))
    .min(1, "Select at least one floor")
    .max(5, "Cannot select more than 5 floors"),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  alternateMobileNumber: z
    .union([
      z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
      z.string().length(0),
    ])
    .optional(),
  isActive: z.boolean(),
  certificateIssued: z.enum(CERTIFICATE_OPTIONS),
  email: z.string().email("Invalid email address"),
  alternateEmail: z
    .string()
    .email("Invalid alternate email address")
    .optional(),
});

export const transactionSchema = z.object({
  userId: z.string(),
  monthsPaid: z
    .array(
      z.object({
        month: z.number().min(1).max(12),
        year: z.number().min(2000).max(2100),
      })
    )
    .min(1, "At least one month must be specified"),
  calculatedAmount: z.number().positive(),
  paymentMode: z.enum(Object.values(PAYMENT_MODES)),
  paymentDetails: z
    .object({
      chequeOrDDNumber: z.string().optional(),
      upiTransactionId: z.string().optional(),
    })
    .refine(
      (data, ctx) => {
        const { paymentMode } = ctx.parent;
        if (paymentMode === PAYMENT_MODES.UPI && !data.upiTransactionId) {
          return ctx.addIssue({
            path: ["upiTransactionId"],
            message: "UPI Transaction ID is required for UPI payments",
            code: z.ZodIssueCode.custom,
          });
        }
        if (
          (paymentMode === PAYMENT_MODES.DD ||
            paymentMode === PAYMENT_MODES.CHEQUE) &&
          !data.chequeOrDDNumber
        ) {
          return ctx.addIssue({
            path: ["chequeOrDDNumber"],
            message: "Cheque/DD number is required for Cheque/DD payments",
            code: z.ZodIssueCode.custom,
          });
        }
        return true;
      },
      { message: "Invalid payment details", path: ["paymentDetails"] }
    ),
  status: z.enum(Object.values(TRANSACTION_STATUS)),
});

export const adminSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
});

export const rentRateSchema = z.object({
  amount: z.number().positive(),
  effectiveDate: z.coerce.date(),
});

export const discountSchema = z.object({
  onYear: z.number().positive().min(0).max(100),
  onFloor: z.number().positive().min(0).max(100),
});
