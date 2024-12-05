import { NextResponse } from "next/server";
import api from "../../lib/services/api";

export async function POST(request) {
  try {
    const formData = await request.json();

    // First create the user
    const userResponse = await api.createUser(formData.userData);
    const userId = userResponse._id;

    // Then create the transaction
    const transactionData = {
      ...formData.transactionData,
      userId,
    };
    const transactionResponse = await api.createTransaction(transactionData);

    return NextResponse.json({
      success: true,
      user: userResponse,
      transaction: transactionResponse,
    });
  } catch (error) {
    console.error("Error in form submission:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An error occurred during form submission",
      },
      { status: 500 }
    );
  }
}
