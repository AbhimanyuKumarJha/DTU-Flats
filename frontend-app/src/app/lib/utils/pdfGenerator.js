import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import TransactionDocument from "../services/transactionPDF";

export const generateAndDownloadPDF = async (transaction) => {
  // Assuming rentDetails are part of the transaction or can be derived
  const rentDetails = transaction.rentDetails || {}; // Adjust based on your data structure

  const doc = (
    <TransactionDocument transaction={transaction} rentDetails={rentDetails} />
  );
  const asPdf = pdf([]);
  asPdf.updateContainer(doc);
  const blob = await asPdf.toBlob();
  saveAs(blob, `Transaction_${transaction._id}.pdf`);
};
