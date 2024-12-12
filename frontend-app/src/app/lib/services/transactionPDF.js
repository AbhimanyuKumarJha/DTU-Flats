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

Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://fonts.gstatic.com/s/helvetica/v11/helvetica_regular.ttf" },
    { src: "https://fonts.gstatic.com/s/helvetica/v11/helvetica_bold.ttf", fontWeight: "bold" },
  ],
});

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

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString("default", { month: "short" });
  };

  const sortedMonths = [...monthsPaid].sort((a, b) => {
    if (a.year === b.year) return a.month - b.month;
    return a.year - b.year;
  });

  const from = sortedMonths[0];
  const to = sortedMonths[sortedMonths.length - 1];

  const fromDisplay = `${getMonthName(from.month)} ${from.year}`;
  const toDisplay = `${getMonthName(to.month)} ${to.year}`;
  const transactionDateDisplay = new Date(transactionDate).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Document>
      <Page style={styles.page}>
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
          </View>
        </View>

        <View style={styles.userDetailsContainer}>
          <View style={styles.userColumn}>
            <Text style={styles.label}>Transaction Date:</Text>
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
