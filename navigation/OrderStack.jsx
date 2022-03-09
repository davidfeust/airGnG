import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../assets/styles/colors";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import TimeSlot from "../components/TimeSlot";
import moment from "moment";
import CustomDateRangePicker from "../components/CustomDateRangePicker";
import { createStackNavigator } from "@react-navigation/stack";

const Header = ({ image, ownerDetails, address }) => {
  return (
    <View style={{ alignItems: "center" }}>
      <View style={styles.station_details}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.text}>
          <Text style={styles.address_text}>{address}</Text>
          {ownerDetails && (
            <Text style={styles.owner_text}>
              {"Owner: " + ownerDetails.name}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};
const ChooseTimeSlot = ({ route, navigation }) => {
  return (
    <View>
      {route.params.timeSlots.map((slot, idx) => {
        const { start, end } = slot;
        return (
          <TouchableOpacity
            key={idx}
            onPress={() =>
              navigation.navigate("Choose Time", { start: start, end: end })
            }
          >
            <TimeSlot start={start.toDate()} end={end.toDate()} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const OrderStack = ({ route, navigation }) => {
  const { address, timeSlots, price, image, id, phone, owner_id } =
    route.params;
  const Stack = createStackNavigator();
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [selectedSlotIdx, setSelectedSlotIdx] = useState(-1);
  const [chosenStart, setChosenStart] = useState(null);
  const [chosenEnd, setChosenEnd] = useState(null);
  const [show, setShow] = useState(moment());

  useEffect(async () => {
    const ownerRef = doc(db, "users", owner_id);
    const ownerObject = await getDoc(ownerRef);
    setOwnerDetails(ownerObject.data());
  }, [owner_id]);

  const ChooseTime = ({ route }) => {
    return <Text>{JSON.stringify(route.params.start)}</Text>;
  };

  return (
    <Stack.Navigator
      initialRouteName="Header"
      screenOptions={{
        presentation: "modal",
        header: (props) => (
          <Header
            {...props}
            image={image}
            ownerDetails={ownerDetails}
            address={address}
          />
        ),
      }}
    >
      <Stack.Group>
        <Stack.Screen
          name="Choose Time Slot"
          component={ChooseTimeSlot}
          initialParams={{ timeSlots }}
        />
        <Stack.Screen name="Choose Time" component={ChooseTime} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default OrderStack;

const styles = StyleSheet.create({
  station_details: {
    backgroundColor: "#fff",
    width: "90%",
    top: 40,
    flexDirection: "row",
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    marginBottom: 40,
  },
  image: {
    width: 400 * 0.4,
    height: 300 * 0.4,
    alignItems: "center",
  },
  text: {
    marginStart: 10,
    marginVertical: 20,
    justifyContent: "space-between",
  },
  address_text: {
    maxWidth: "95%",
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  owner_text: {
    maxWidth: "95%",
    color: colors.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  num_text: {
    maxWidth: "95%",
    color: colors.primary,
    fontSize: 15,
  },
});
