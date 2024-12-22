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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    padding: 8,
    marginBottom: 10,
  },
  detailsGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  detailItem: {
    width: '31%',
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
  headerContainer: {
    marginBottom: 30,
  },
  universityLogo: {
    width: 80,
    height: 80,
    position: 'absolute',
    left: 30,
    top: 20,
  },
  headerText: {
    textAlign: 'center',
    marginBottom: 5,
  },
  universityName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 11,
    color: '#333333',
  },
  deanTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  divider: {
    borderBottom: '1 solid #000',
    marginVertical: 10,
  },
  documentTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  statusTag: {
    padding: 4,
    borderRadius: 4,
    fontWeight: 'bold',
  },
  activeStatus: {
    backgroundColor: '#d3d3d3',
  },
  inactiveStatus: {
    backgroundColor: '#ffd7d7',
  },
  floorsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  floorTag: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginRight: 4,
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
        const user = await api.getUserById(userId._id);
        const floorCount = Array.isArray(user.floorNumber) ? user.floorNumber.length : 0;
        setNumberOfFloors(floorCount);
        const floorDiscountState = floorCount === 4 ? rentDetails.floorDiscount : 0;
        setFloorDiscount(floorDiscountState);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [userId]);

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

  // Format date helper
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    }).replace(/\//g, '/');
  };

  return (
    
    
    <Document>
      <Page style={styles.page}>
        {/* Enhanced Header Section */}
        <View style={styles.headerContainer}>
          <Image src="/DTU,_Delhi_official_logo.png" style={styles.universityLogo} />
          <Text style={[styles.headerText, styles.universityName]}>DELHI TECHNOLOGICAL UNIVERSITY</Text>
          <Text style={[styles.headerText, styles.addressText]}>Established by Govt. of Delhi Vide Act 6 of 2009</Text>
          <Text style={[styles.headerText, styles.addressText]}>Shahbad Daulatpur, Bawana Road, Delhi-110042</Text>
          <Text style={[styles.headerText, styles.addressText]}>Tel: +91-11-27871024, Fax: +91-11-2787 1023</Text>
          <Text style={[styles.headerText, styles.deanTitle]}>General Admin</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Text style={styles.dateText}>Dated: {getCurrentDate()}</Text>
          </View>
          <View style={styles.divider} />
          <Text style={[styles.documentTitle, { marginTop: 4 }]}>RENT PAYMENT RECEIPT</Text>
        </View>

        

        {/* User Details Section */}
        {/* <View style={styles.userDetailsContainer}>
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

        <View style={styles.userDetailsContainer}>
          <View style={styles.userColumn}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{status}</Text>
          </View>
          <View style={styles.userColumn}>
            <Text style={styles.label}>Period:</Text>
            <Text style={styles.value}>{fromDisplay} - {toDisplay}</Text>
          </View>
          <View style={styles.userColumn}>
            <Text style={styles.label}>Number of Floors:</Text>
            <Text style={styles.value}>{userData.floorNumber !== null ? userData.floorNumber.length : "N/A"}</Text>
          </View>
        </View> */}

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{userId?.name || "N/A"}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Date of Birth</Text>
              <Text style={styles.value}>{formatDate(userData.dateOfBirth)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Gender</Text>
              <Text style={styles.value}>{userData.gender}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Mobile Number</Text>
              <Text style={styles.value}>{userData.mobileNumber}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Alternate Mobile</Text>
              <Text style={styles.value}>{userData.alternateMobileNumber || "N/A"}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Status</Text>
              <Text style={[
                styles.statusTag,
                userData.isActive ? styles.activeStatus : styles.inactiveStatus
              ]}>
                {userData.isActive ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>
        </View>

        {/* Address and Floor Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Details</Text>
          <View style={styles.detailsGrid}>
            <View style={{ width: '100%', marginBottom: 10 }}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{userData.address}</Text>
            </View>
            <View style={{ width: '100%' }}>
              <Text style={styles.label}>Floor Numbers</Text>
              <View style={styles.floorsContainer}>
                {userData.floorNumber.map((floor, index) => (
                  <Text key={index} style={styles.floorTag}>{floor}</Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Transaction Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Transaction ID</Text>
              <Text style={styles.value}>{_id}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Transaction Date</Text>
              <Text style={styles.value}>{formatDate(transactionDate)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Certificate Issued</Text>
              <Text style={styles.value}>{userData.certificateIssued}</Text>
            </View>
          </View>
        </View>

        {/* Rent Details Section */}
        <Text style={[styles.rentHeader]}>RENT BREAKDOWN</Text>
        {monthlyCalculations && (
          <View>
            {monthlyCalculations.map(({ month, year, amount }, index) => (
              <View key={`${month}-${year}-${index}`} style={[styles.rentItem, index % 2 === 0 && styles.alternateRow]}>
                <Text>
                  {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
                    new Date(year, month - 1)
                  )} {year}
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

            {/* Total Section */}
            <View style={styles.totalSection}>
              <View style={styles.rentItem}>
                <Text style={styles.boldText}>Total Amount:</Text>
                <Text>{totalAmount.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  currencyDisplay: "symbol",
                }).replace("₹", "Rs. ")}</Text>
              </View>
              <View style={styles.rentItem}>
                <Text style={styles.boldText}>Floor Discount ({floorDiscount}%):</Text>
                <Text>-{floorDiscountAmount.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  currencyDisplay: "symbol",
                }).replace("₹", "Rs. ")}</Text>
              </View>
              <View style={styles.rentItem}>
                <Text style={styles.boldText}>Year Discount ({yearDisc}%):</Text>
                <Text>-{yearDiscountAmt.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  currencyDisplay: "symbol",
                }).replace("₹", "Rs. ")}</Text>
              </View>
              <View style={styles.rentItem}>
                <Text style={styles.boldText}>Grand Total:</Text>
                <Text style={styles.boldText}>{grandTotal.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  currencyDisplay: "symbol",
                }).replace("₹", "Rs. ")}</Text>
              </View>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default TransactionDocument;
