import { NextResponse } from "next/server";
import api from "../../lib/services/api";

export async function PUT(request) {
  try {
    const formData = await request.json();

    // Update user
    const userResponse = await api.updateUser(
      formData.userId,
      formData.userData
    );

    // Update transaction if provided
    let transactionResponse = null;
    if (formData.transactionData) {
      transactionResponse = await api.updateTransaction(
        formData.transactionData.id,
        formData.transactionData
      );
    }

    return NextResponse.json({
      success: true,
      user: userResponse,
      transaction: transactionResponse,
    });
  } catch (error) {
    console.error("Error in form update:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An error occurred during form update",
      },
      { status: 500 }
    );
  }
}
