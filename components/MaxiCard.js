import React, { useContext, useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    Image,
    Animated,
    Alert,
    TouchableOpacity,
} from "react-native";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";
import { db } from "../config/firebase";
import {
    collection,
    addDoc,
    updateDoc,
    arrayUnion,
    doc,
} from "firebase/firestore";
import TimeSlot from "./TimeSlot";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../assets/styles/colors";
import CustomDropDown from "./CustomDropDown";
import {
    dateToStringNoHours,
    dateToStringHours,
    dateToString,
    dateRange,
} from "../utils/GlobalFuncitions";

export default function MaxiCard({
    owner,
    address,
    date,
    price,
    image,
    id,
    style,
    phone,
}) {
    new Date().getDate;
    const stretchAnim = useRef(new Animated.Value(100)).current; // Initial
    const [cardStyle, setCardStyle] = useState(style);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedDateRange, setSelectedDateRange] = useState([]);
    const [selectedStart, setSelectedStart] = useState(null);
    const [selectedEnd, setSelectedEnd] = useState(null);
    const card = useRef();
    const { user } = useContext(AuthenticatedUserContext);
    const onOrder = () => {
        selectedStart && selectedEnd
            ? addDoc(collection(db, "subscriptions"), {
                  sub_id: user.uid,
                  date_of_sub: new Date(),
                  reservation: {
                      date_start: selectedStart,
                      date_finish: selectedEnd,
                  },
                  station_id: id,
                  payed: false,
                  sub_car_type:
                      "the user might have an incompetible type of charge for his card",
              })
                  .then((docRef) =>
                      updateDoc(doc(db, "users", user.uid), {
                          orders: arrayUnion(docRef.id),
                      })
                  )
                  .catch((e) => console.error("Error adding document: ", e))
            : Alert.alert("Erorr", "Please choose a date from the dropdown.", [
                  {
                      text: "Close",
                  },
              ]);
    };

    useEffect(() => {
        Animated.timing(stretchAnim, {
            toValue: 400,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [stretchAnim]);

    useEffect(() => {
        setSelectedStart(null);
        setSelectedEnd(null);
        if (selectedTimeSlot) {
            setSelectedDateRange(
                dateRange(
                    selectedTimeSlot.start.toDate(),
                    selectedTimeSlot.end.toDate(),
                    60
                )
            );
        }
    }, [selectedTimeSlot]);

    return (
        <Animated.View
            style={[
                style,
                {
                    height: stretchAnim,
                },
            ]}
            ref={card.current}
        >
            <View>
                <Image
                    source={
                        image
                            ? { uri: image }
                            : require("../assets/defaults/default_image.png")
                    }
                    style={{ width: 300, height: 200, alignSelf: "center" }}
                />
                <Text style={{ flexWrap: "wrap", color: "red" }}>
                    {address}
                </Text>
                <Text>{owner}</Text>
                <Text>{phone}</Text>

                <Text>{price} nis</Text>

                <CustomDropDown
                    items={date.map((d, index) => ({
                        label:
                            dateToStringNoHours(d.start.toDate()) +
                            "-" +
                            dateToStringNoHours(d.end.toDate()),
                        value: d,
                    }))}
                    setItems={() => {}}
                    value={selectedTimeSlot}
                    setValue={setSelectedTimeSlot}
                    placeholder="Choose Time Slot"
                />
                <View style={{ flex: 1, flexDirection: "row" }}>
                    {selectedTimeSlot ? (
                        <CustomDropDown
                            items={selectedDateRange.map((date) => ({
                                label: dateToString(date),
                                value: date,
                            }))}
                            setItems={setSelectedDateRange}
                            value={selectedStart}
                            setValue={setSelectedStart}
                            containerStyle={{ width: "50%" }}
                            placeholder="Choose Starting Hour"
                        />
                    ) : null}
                    {selectedStart ? (
                        <CustomDropDown
                            items={selectedDateRange
                                .filter((date) => date > selectedStart)
                                .map((date) => ({
                                    label: dateToString(date),
                                    value: date,
                                }))}
                            setItems={() => {}}
                            value={selectedEnd}
                            setValue={setSelectedEnd}
                            containerStyle={{ width: "50%" }}
                            placeholder="Choose Ending Hour"
                        />
                    ) : null}
                </View>
                <Text>
                    Price:{" "}
                    {selectedStart && selectedEnd
                        ? ((selectedEnd - selectedStart) / 36e5) * price
                        : 0}{" "}
                    nis
                </Text>
                <TouchableOpacity
                    onPress={onOrder}
                    style={{
                        alignSelf: "center",
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: colors.primary,
                        borderRadius: 5,
                    }}
                >
                    <Text style={{ paddingHorizontal: 10, color: "white" }}>
                        order
                    </Text>
                    <MaterialCommunityIcons
                        name="book"
                        color={"white"}
                        size={30}
                    />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}
