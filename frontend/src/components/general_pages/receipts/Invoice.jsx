/* eslint-disable react/prop-types */
import React, { Fragment } from "react";
import {
  Image,
  Text,
  View,
  Page,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

const today = new Date();

const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Add 1 because months are zero-based
const day = today.getDate().toString().padStart(2, "0");

const todayString = `${year}-${month}-${day}`;

const Invoice = (props) => {
  const data = props.data;
  const styles = StyleSheet.create({
    page: {
      fontSize: 11,
      paddingTop: 20,
      paddingLeft: 40,
      paddingRight: 40,
      lineHeight: 1.5,
      flexDirection: "column",
    },

    spaceBetween: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      color: "#3E3E3E",
    },

    titleContainer: { flexDirection: "row", marginTop: 24 },

    logo: { width: 90 },

    reportTitle: { fontSize: 16, textAlign: "center" },

    addressTitle: { fontSize: 11, fontStyle: "bold" },

    invoice: { fontWeight: "bold", fontSize: 20 },

    invoiceNumber: { fontSize: 11, fontWeight: "bold" },

    address: { fontWeight: 400, fontSize: 10 },

    theader: {
      marginTop: 20,
      fontSize: 10,
      fontStyle: "bold",
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1,
      height: 20,
      backgroundColor: "#DEDEDE",
      borderColor: "whitesmoke",
      borderRightWidth: 1,
      borderBottomWidth: 1,
    },

    theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },

    tbody: {
      fontSize: 9,
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1,
      borderColor: "whitesmoke",
      borderRightWidth: 1,
      borderBottomWidth: 1,
    },

    total: {
      fontSize: 9,
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1.5,
      borderColor: "whitesmoke",
      borderBottomWidth: 1,
    },

    tbody2: { flex: 2, borderRightWidth: 1 },

    horizontalRule: {
      borderBottomWidth: 1,
      borderBottomColor: "#000000",
      marginBottom: 10,
    },

    name: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#333333", // Change color to your preference
      marginBottom: 5,
      textTransform: "capitalize",
    },

    email: {
      fontSize: 10,
      color: "#666666", // Change color to your preference
    },
  });

  const InvoiceTitle = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        {/* <Image style={styles.logo} src={logo} /> */}
        <Text style={styles.reportTitle}>Xpress Enterprises</Text>
      </View>
    </View>
  );
  // update InvoiceTitle component here

  const Address = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <View>
          <Text style={styles.invoice}>Elixzor Technologies PVT LTD </Text>
          <Text style={styles.invoiceNumber}>Invoices@elixzor.com</Text>
        </View>
        <View>
          <Text style={styles.addressTitle}>prabhakar 208, </Text>
          <Text style={styles.addressTitle}>
            Jangid estate near vijay park,
          </Text>
          <Text style={styles.addressTitle}> mira road east thane 401107</Text>
          <Text style={styles.addressTitle}> +91 88506 14359</Text>
        </View>
      </View>
    </View>
  );

  const UserAddress = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <View style={{ maxWidth: 200 }}>
          <Text style={styles.addressTitle}>Bill to </Text>
          {/* <Text style={styles.address}>{reciept_data.address}</Text> */}
        </View>
        {/* <Text style={styles.addressTitle}>{reciept_data.date}</Text> */}
      </View>
    </View>
  );

  const TableHead = () => (
    <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
      <View style={styles.theader}>
        <Text>Task Id</Text>
      </View>
      <View style={[styles.theader, styles.theader2]}>
        <Text>Title</Text>
      </View>
      <View style={styles.theader}>
        <Text>SubId</Text>
      </View>
      <View style={styles.theader}>
        <Text>Completed On</Text>
      </View>
      <View style={styles.theader}>
        <Text>Amount</Text>
      </View>
    </View>
  );
  const BankDetailsHead = () => (
    <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
      <View style={[styles.theader, styles.theader2]}>
        <Text>Bank Details</Text>
      </View>
    </View>
  );
  const BankDetailsBody = () => (
    <>
      <View style={{ width: "100%", flexDirection: "row" }}>
        <View style={[styles.theader2]}>
          <Text>Name</Text>
        </View>
        <View style={[styles.theader2]}>
          <Text style={{ textTransform: "capitalize" }}>
            {data?.[0]?.user?.name ?? " "}
          </Text>
        </View>
      </View>

      <View style={{ width: "100%", flexDirection: "row" }}>
        <View style={[styles.theader2]}>
          <Text>Bank Name</Text>
        </View>
        <View style={[styles.theader2]}>
          <Text style={{ textTransform: "capitalize" }}>
            {data?.[0]?.user?.bankName ?? " "}
          </Text>
        </View>
      </View>

      <View style={{ width: "100%", flexDirection: "row" }}>
        <View style={[styles.theader2]}>
          <Text>Account Number</Text>
        </View>
        <View style={[styles.theader2]}>
          <Text style={{ textTransform: "capitalize" }}>
            {data?.[0]?.user?.accountNumber ?? " "}
          </Text>
        </View>
      </View>

      <View style={{ width: "100%", flexDirection: "row" }}>
        <View style={[styles.theader2]}>
          <Text>IFSC Code</Text>
        </View>
        <View style={[styles.theader2]}>
          <Text style={{ textTransform: "capitalize" }}>
            {data?.[0]?.user?.ifsc ?? " "}
          </Text>
        </View>
      </View>

      <View style={{ width: "100%", flexDirection: "row" }}>
        <View style={[styles.theader2]}>
          <Text>PAN Number</Text>
        </View>
        <View style={[styles.theader2]}>
          <Text style={{ textTransform: "capitalize" }}>
            {data?.[0]?.user?.panNum ?? " "}
          </Text>
        </View>
      </View>
    </>
  );

  const TableBody = () =>
    data.map((row, index) => {
      return (
        <Fragment key={index}>
          <View style={{ width: "100%", flexDirection: "row" }}>
            <View style={styles.tbody}>
              <Text>{row.tasks.id} </Text>
            </View>
            <View style={[styles.tbody, styles.tbody2]}>
              <Text>{row.tasks.title}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{row.userTask.id}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{row.userTask.completedOn.slice(0, 10)}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{row.userTask.price}</Text>
            </View>
          </View>
        </Fragment>
      );
    });

  const TableTotal = () => (
    <View style={{ width: "100%", flexDirection: "row" }}>
      <View style={styles.total}>
        <Text></Text>
      </View>
      <View style={styles.total}>
        <Text> </Text>
      </View>
      <View style={styles.total}>
        <Text> </Text>
      </View>
      <View style={styles.tbody}>
        <Text>Total</Text>
      </View>
      <View style={styles.tbody}>
        <Text>
          {data.reduce((total, item) => total + item.userTask.price, 0)}
        </Text>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.invoice}>Invoice </Text>
        <Text style={styles.addressTitle}>{todayString}</Text>
        <View style={styles.horizontalRule} /> {/* Horizontal rule */}
        <Address/>
        <Text style={styles.name}>{data?.[0]?.user?.name ?? " "}</Text>
        {/* Name */}
        <Text style={styles.email}>{data?.[0]?.user?.email ?? " "}</Text>{" "}
        {/* Email */}
        <TableHead />
        <TableBody />
        <TableTotal />
        <BankDetailsHead />
        <BankDetailsBody />
      </Page>
    </Document>
  );
};
export default Invoice;
