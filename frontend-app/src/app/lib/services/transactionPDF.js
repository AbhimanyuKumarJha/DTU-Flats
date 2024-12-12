import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

<<<<<<< HEAD
=======
// Register a font (optional, for better styling)
>>>>>>> refs/remotes/origin/main
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://fonts.gstatic.com/s/helvetica/v11/helvetica_regular.ttf" },
<<<<<<< HEAD
    { src: "https://fonts.gstatic.com/s/helvetica/v11/helvetica_bold.ttf", fontWeight: "bold" },
  ],
});

=======
    {
      src: "https://fonts.gstatic.com/s/helvetica/v11/helvetica_bold.ttf",
      fontWeight: "bold",
    },
  ],
});

// Define styles for the PDF
>>>>>>> refs/remotes/origin/main
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    alignSelf: "center",
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    marginLeft: 10,
  },
  userDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  userColumn: {
    width: "30%",
  },
  rentHeader: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
    textDecoration: "underline",
  },
<<<<<<< HEAD
  rentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalSection: {
    borderTop: "1 solid #000",
    paddingTop: 10,
    marginTop: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
});

const TransactionDocument = ({ transaction, rentDetails }) => {
  const { userId, status, monthsPaid, transactionDate, _id } = transaction;

=======
  rentSection: {
    marginBottom: 10,
  },
  rentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalSection: {
    borderTop: "1 solid #000",
    paddingTop: 5,
    marginTop: 10,
  },
});

// PDF Document Component
const TransactionDocument = ({ transaction, rentDetails }) => {
  const { userId, status, monthsPaid, transactionDate, _id } = transaction;

  // Helper function to get month name from month number
>>>>>>> refs/remotes/origin/main
  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString("default", { month: "short" });
  };

<<<<<<< HEAD
=======
  // Compute From and To dates based on monthsPaid
>>>>>>> refs/remotes/origin/main
  const sortedMonths = [...monthsPaid].sort((a, b) => {
    if (a.year === b.year) return a.month - b.month;
    return a.year - b.year;
  });

  const from = sortedMonths[0];
  const to = sortedMonths[sortedMonths.length - 1];

  const fromDisplay = `${getMonthName(from.month)} ${from.year}`;
  const toDisplay = `${getMonthName(to.month)} ${to.year}`;
<<<<<<< HEAD
  const transactionDateDisplay = new Date(transactionDate).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
=======
  const transactionDateDisplay = new Date(transactionDate).toLocaleString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
>>>>>>> refs/remotes/origin/main

  return (
    <Document>
      <Page style={styles.page}>
<<<<<<< HEAD
        {/* Top-Centered Logo */}
        <Image src="/DTU,_Delhi_official_logo.png" style={styles.logo} />

        <Text style={styles.header}>Transaction Details</Text>

        {/* User Details in Rows */}
        <View style={styles.userDetailsContainer}>
          <View style={styles.userColumn}>
            <Text style={styles.label}>Transaction ID:</Text>
            <Text>{_id}</Text>
          </View>
          <View style={styles.userColumn}>
            <Text style={styles.label}>Name:</Text>
            <Text>{userId?.name || "N/A"}</Text>
          </View>
          <View style={styles.userColumn}>
            <Text style={styles.label}>Contact:</Text>
            <Text>{userId?.mobileNumber || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.userDetailsContainer}>
          <View style={styles.userColumn}>
            <Text style={styles.label}>Status:</Text>
            <Text>{status}</Text>
          </View>
          <View style={styles.userColumn}>
            <Text style={styles.label}>From:</Text>
            <Text>{fromDisplay}</Text>
          </View>
          <View style={styles.userColumn}>
            <Text style={styles.label}>To:</Text>
            <Text>{toDisplay}</Text>
=======
        {/* Top-Centered Image */}
        <Image
          src="/DTU,_Delhi_official_logo.png" // Ensure this path is correct
          style={styles.logo}
        />

        <Text style={styles.header}>Transaction Details</Text>

        {/* User Details in 3 Columns */}
        <View style={styles.userDetailsContainer}>
          <View style={styles.userColumn}>
            <Text style={styles.label}>Transaction ID:</Text>
            <Text style={styles.value}>{_id}</Text>
          </View>
          <View style={styles.userColumn}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{userId?.name || "N/A"}</Text>
          </View>
          <View style={styles.userColumn}>
            <Text style={styles.label}>Contact:</Text>
            <Text style={styles.value}>{userId?.mobileNumber || "N/A"}</Text>
          </View>
        </View>

        {/* Additional User Information (Optional) */}
        <View style={styles.userDetailsContainer}>
          <View style={styles.userColumn}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{status}</Text>
          </View>
          <View style={styles.userColumn}>
            <Text style={styles.label}>From:</Text>
            <Text style={styles.value}>{fromDisplay}</Text>
          </View>
          <View style={styles.userColumn}>
            <Text style={styles.label}>To:</Text>
            <Text style={styles.value}>{toDisplay}</Text>
>>>>>>> refs/remotes/origin/main
          </View>
        </View>

        <View style={styles.userDetailsContainer}>
          <View style={styles.userColumn}>
            <Text style={styles.label}>Transaction Date:</Text>
<<<<<<< HEAD
            <Text>{transactionDateDisplay}</Text>
          </View>
        </View>

        {/* Rent Details */}
        <Text style={styles.rentHeader}>Rent Details</Text>
        {rentDetails && rentDetails.monthlyCalculations && (
          <View>
            {rentDetails.monthlyCalculations.map(({ month, year, amount }, index) => (
              <View key={`${month}-${year}-${index}`} style={styles.rentItem}>
                <Text>
                  {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
                    new Date(year, month - 1)
                  )} {year}:
                </Text>
                <Text>
                  {amount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    currencyDisplay: "symbol",
                  }).replace("₹", "Rs. ")}
                </Text>
              </View>
            ))}

            {/* Totals */}
            <View style={styles.totalSection}>
              <View style={styles.rentItem}>
                <Text style={styles.boldText}>Total:</Text>
                <Text>
                  {rentDetails.totalAmount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    currencyDisplay: "symbol",
                  }).replace("₹", "Rs. ")}
                </Text>
              </View>
              <View style={styles.rentItem}>
                <Text style={styles.boldText}>
                  Floor Discount: {rentDetails.floorDiscount || 0}%
                </Text>
                <Text>
                  {rentDetails.floorDiscountAmount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    currencyDisplay: "symbol",
                  }).replace("₹", "Rs. ")}
                </Text>
              </View>
              <View style={styles.rentItem}>
                <Text style={styles.boldText}>
                  Year Discount: {rentDetails.yearDiscount || 0}%
                </Text>
                <Text>
                  {rentDetails.yearDiscountAmount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    currencyDisplay: "symbol",
                  }).replace("₹", "Rs. ")}
                </Text>
              </View>
              <View style={styles.rentItem}>
                <Text style={styles.boldText}>Grand Total:</Text>
                <Text>
                  {rentDetails.grandTotal.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    currencyDisplay: "symbol",
                  }).replace("₹", "Rs. ")}
=======
            <Text style={styles.value}>{transactionDateDisplay}</Text>
          </View>
          {/* You can add more columns if needed */}
          <View style={styles.userColumn}>
            {/* Empty Column for spacing */}
          </View>
          <View style={styles.userColumn}>
            {/* Empty Column for spacing */}
          </View>
        </View>

        {/* Rent Details Heading */}
        <Text style={styles.rentHeader}>Rent Details</Text>

        {/* Rent Calculations */}
        {rentDetails && rentDetails.monthlyCalculations && (
          <View>
            {rentDetails.monthlyCalculations.map(({ month, year, amount }) => (
              <View key={`${month}-${year}`} style={styles.rentItem}>
                <Text>
                  {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
                    new Date(year, month - 1)
                  )}{" "}
                  {year}:
                </Text>
                <Text>{amount.toFixed(2)}</Text>
              </View>
            ))}
            {/* Total */}
            <View style={styles.totalSection}>
              <View style={styles.rentItem}>
                <Text style={{ fontWeight: "bold" }}>Total:</Text>
                <Text style={{ fontWeight: "bold" }}>
                  {rentDetails.totalAmount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.rentItem}>
                <Text style={{ fontWeight: "bold" }}>
                  Floor Discount:{" "}
                  {rentDetails.floorDiscount ? rentDetails.floorDiscount : 0}%
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  {rentDetails.floorDiscountAmount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.rentItem}>
                <Text style={{ fontWeight: "bold" }}>
                  Year Discount:{" "}
                  {rentDetails.yearDiscount ? rentDetails.yearDiscount : 0}%
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  {rentDetails.yearDiscountAmount.toFixed(2)}
                </Text>
              </View>
              <View style={styles.rentItem}>
                <Text style={{ fontWeight: "bold" }}>Grand Total:</Text>
                <Text style={{ fontWeight: "bold" }}>
                  {rentDetails.grandTotal.toFixed(2)}
>>>>>>> refs/remotes/origin/main
                </Text>
              </View>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default TransactionDocument;
