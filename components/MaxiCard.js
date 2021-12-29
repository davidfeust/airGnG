import React, { useContext, useEffect, useRef, useState } from "react";
import { Alert, Animated, Image, Text, View } from "react-native";
import { AuthenticatedUserContext } from "../providers/AuthenticatedUserProvider";
import { db } from "../config/firebase";
import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import CustomDropDown from "./CustomDropDown";
import { dateRange, dateToString } from "../utils/GlobalFuncitions";
import { myOrdersContext } from "../providers/MyOrdersProvider";
import { Divider } from "react-native-elements";
import CustomButton from "./CustomButton";

export default function MaxiCard({
                                     goToMyOrdersTab,
                                     owner_id,
                                     address,
                                     timeSlots,
                                     price,
                                     image,
                                     id,
                                     style,
                                     phone,
                                 }) {
    const stretchAnim = useRef(new Animated.Value(100)).current; // Initial
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedDateRange, setSelectedDateRange] = useState([]);
    const [selectedStart, setSelectedStart] = useState(null);
    const [selectedEnd, setSelectedEnd] = useState(null);
    const { user } = useContext(AuthenticatedUserContext);
    const { myOrders } = useContext(myOrdersContext);
    const [relatedOrders, setRelatedOrders] = useState([]);
    const [processing, setProcessing] = useState(false);

    const onOrder = () => {
        if (selectedStart && selectedEnd) {
            setProcessing(true);
            addDoc(collection(db, "orders"), {
                sub_id: user.uid,
                date_of_sub: new Date(),
                reservation: {
                    date_start: selectedStart,
                    date_finish: selectedEnd,
                },
                station_id: id,
                payed: false,
                sub_car_type:
                    "the user might have an incompatible type of charge for his card",
            })
                .then((orderRef) => {
                    const userRef = doc(db, "users", user.uid);
                    updateDoc(userRef, {
                        orders: arrayUnion(orderRef.id),
                    }).then(() => {
                        goToMyOrdersTab();
                        setProcessing(false);
                    });
                })
                .catch((e) => {
                    console.error("Error adding document: ", e);
                    setProcessing(false);
                });
        } else {
            Alert.alert("Error", "Please choose a date from the dropdown.", [
                {
                    text: "Close",
                },
            ]);
        }
    };

    useEffect(() => {
        setSelectedStart(null);
        setSelectedEnd(null);
        if (selectedTimeSlot) {
            setSelectedDateRange(
                dateRange(
                    selectedTimeSlot.start.toDate(),
                    selectedTimeSlot.end.toDate(),
                    15
                ).filter(
                    (dateItem) =>
                        !relatedOrders.some(
                            ({ start, end }) =>
                                start <= dateItem && end > dateItem
                        )
                )
            );
        }
    }, [selectedTimeSlot]);

    useEffect(() => {
        setSelectedDateRange(
            selectedDateRange.filter(
                (dateItem) =>
                    !relatedOrders.some(
                        ({ start, end }) =>
                            // selected start is between old reservation slot
                            (start <= selectedStart && end > selectedStart) ||
                            // OR: date resembles wrapping slot encapsulating old timeslot already ordered by user
                            (start >= selectedStart && dateItem >= end)
                    )
            )
        );
    }, [selectedStart]);

    useEffect(() => {
        const q = query(collection(db, 'orders'), where('station_id', '==', id));
        getDocs(q).then(snap => {
            setRelatedOrders(
                snap.docs.map((order) => ({
                    start: order.data().reservation.date_start.toDate(),
                    end: order.data().reservation.date_finish.toDate(),
                }))
            );
        });
    }, [myOrders]);

    return (
        <View style={style}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <Text
                    style={{
                        flexWrap: "wrap",
                        color: "black",
                        fontWeight: "bold",
                    }}
                >
                    {address}
                </Text>
                <Text>
                    {phone} {price} nis
                </Text>
            </View>
            <Divider style={{ margin: 10 }} />
            <Image
                source={
                    image
                        ? { uri: image }
                        : require("../assets/defaults/default_image.png")
                }
                style={{
                    width: 250,
                    height: 150,
                    alignSelf: "center",
                    borderRadius: 15,
                    margin: 10,
                }}
            />

            {/*Choose a TimeSlot*/}
            <CustomDropDown
                itemkey="key"
                items={timeSlots.map((d, index) => ({
                    label:
                        dateToString(d.start.toDate()) +
                        "-" +
                        dateToString(d.end.toDate()),
                    value: d,
                    key: index,
                }))}
                setItems={() => {}}
                value={selectedTimeSlot}
                setValue={setSelectedTimeSlot}
                placeholder="Choose Time Slot"
            />
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                {/*Choose a Starting time*/}
                {selectedTimeSlot ? (
                    <CustomDropDown
                        itemkey="key"
                        items={selectedDateRange.map((date, index) => ({
                            label: dateToString(date),
                            value: date,
                            key: index,
                        }))}
                        setItems={setSelectedDateRange}
                        value={selectedStart}
                        setValue={setSelectedStart}
                        containerStyle={{ width: "49%" }}
                        placeholder="Choose Starting Hour"
                    />
                ) : null}
                {/*Choose an Ending time*/}
                {selectedStart ? (
                    <CustomDropDown
                        itemkey="key"
                        items={selectedDateRange
                            .filter((date) => date > selectedStart)
                            .map((date, index) => ({
                                label: dateToString(date),
                                value: date,
                                key: index,
                            }))}
                        setItems={() => {}}
                        value={selectedEnd}
                        setValue={setSelectedEnd}
                        containerStyle={{ width: "49%" }}
                        placeholder="Choose Ending Hour"
                    />
                ) : null}
            </View>
            <Divider orientation="horizontal" />

            <View style={{ alignItems: "center" }}>
                <CustomButton
                    text={"Order"}
                    onPress={onOrder}
                    disabled={!(selectedStart && selectedEnd)}
                    processing={processing}
                />
            </View>
        </View>
    );
}
