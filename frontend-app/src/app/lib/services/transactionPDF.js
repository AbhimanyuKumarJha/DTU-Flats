import React,{useState} from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import api from './api'; // Import the API
import { set } from "zod";

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

const TransactionDocument = ({ transaction, rentDetails, userData }) => {
  const { userId, status, monthsPaid, transactionDate, _id , floorNumber , userDataset} = transaction;

  // State to hold user data
  const [numberOfFloors, setNumberOfFloors] = useState(0);
  const [floorDiscountState, setFloorDiscount] = useState(0);

  // Fetch user data by userId
  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await api.getUserById(userId._id); // Assuming userId is an object with _id
        console.log("Fetched User Data:", user);

        // Ensure floorNumber is processed correctly
        const floorCount = Array.isArray(user.floorNumber) ? user.floorNumber.length : 0;
        // console.log("Processed floorNumber length:", floorCount);

        console.log("Processed floorNumber length:", floorCount);
        const numberOfFloors = floorCount;
        setNumberOfFloors(floorCount); // Update number of floors state
        console.log(numberOfFloors);
        const floorDiscountState = numberOfFloors === 4 ? rentDetails.floorDiscount : 0
        setFloorDiscount(floorDiscountState)
        console.log("floor discount state:",floorDiscountState);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId      ]); // Dependency array to run effect when userId changes

  // Destructure rentDetails
  const { monthlyCalculations, totalAmount } = rentDetails || {};

  // Calculate discounts
  const floorDiscount = userData.floorNumber.length === 4 ? rentDetails.floorDiscount : 0; // Assuming 10% discount for 4 floors
  const floorDiscountAmount = (totalAmount * floorDiscount) / 100; // Calculate floor discount amount
  const yearDisc = monthsPaid.length >= 12 ? rentDetails.yearDiscount : 0; // Assuming 5% discount for 12 or more months
  const yearDiscountAmt = (totalAmount * yearDisc) / 100; // Calculate year discount amount

  // Calculate grand total without discounts
  const grandTotal = totalAmount-yearDiscountAmt-floorDiscountAmount; // Grand total is total without deducting discounts

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
  console.log("user data " , userData);
  return (
    
    
    <Document>
      <Page style={styles.page}>
        {/* Top-Centered Logo */}
        <Image src="/DTU,_Delhi_official_logo.png" style={styles.logo} />

        <Text style={styles.header}>Transaction Details</Text>

        {/* Display number of floors */}
        <View style={styles.userDetailsContainer}>
          <View style={styles.userColumn}>
            <Text style={styles.label}>Number of Floors:</Text>
            
            <Text>{userData.floorNumber !== null ? userData.floorNumber.length: "N/A"}</Text>
          </View>
        </View>

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
        {monthlyCalculations && (
          <View>
            {monthlyCalculations.map(({ month, year, amount }, index) => (
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
                  {totalAmount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    currencyDisplay: "symbol",
                  }).replace("₹", "Rs. ")}
                </Text>
              </View>
              <View style={styles.rentItem}>
                <Text style={styles.boldText}>
                  Floor Discount: {floorDiscount}%
                </Text>
                <Text>
                  {floorDiscountAmount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    currencyDisplay: "symbol",
                  }).replace("₹", "Rs. ")}
                </Text>
              </View>
              <View style={styles.rentItem}>
                <Text style={styles.boldText}>
                  Year Discount: {yearDisc}%
                </Text>
                <Text>
                  {yearDiscountAmt.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    currencyDisplay: "symbol",
                  }).replace("₹", "Rs. ")}
                </Text>
              </View>
              <View style={styles.rentItem}>
                <Text style={styles.boldText}>Grand Total:</Text>
                <Text>
                  {grandTotal.toLocaleString("en-IN", {
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
