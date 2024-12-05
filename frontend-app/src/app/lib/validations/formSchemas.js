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
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid mobile number")
    .optional()
    .nullable(),
  isActive: z.boolean(),
  certificateIssued: z.enum(CERTIFICATE_OPTIONS),
});

export const transactionSchema = z.object({
  userId: z.string(),
  monthsPaid: z.array(
    z.object({
      month: z.number().min(1).max(12),
      year: z.number().min(2000).max(2100),
    })
  ),
  calculatedAmount: z.number().positive(),
  paymentMode: z.enum(Object.values(PAYMENT_MODES)),
  paymentDetails: z
    .object({
      chequeOrDDNumber: z.string().optional(),
      upiTransactionId: z.string().optional(),
    })
    .refine((data) => {
      if (
        data.paymentMode === PAYMENT_MODES.UPI &&
        !data.paymentDetails.upiTransactionId
      ) {
        return false;
      }
      if (
        (data.paymentMode === PAYMENT_MODES.DD ||
          data.paymentMode === PAYMENT_MODES.CHEQUE) &&
        !data.paymentDetails.chequeOrDDNumber
      ) {
        return false;
      }
      return true;
    }, "Payment details are required for the selected payment mode"),
  status: z.enum(Object.values(TRANSACTION_STATUS)),
});
