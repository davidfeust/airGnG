import React, {useContext, useEffect, useRef, useState} from "react";
import {Alert, Animated, ImageBackground, Text, TouchableOpacity, View,} from "react-native";
import {AuthenticatedUserContext} from "../providers/AuthenticatedUserProvider";
import {db} from "../config/firebase";
import {addDoc, arrayUnion, collection, doc, updateDoc,} from "firebase/firestore";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {colors} from "../assets/styles/colors";
import CustomDropDown from "./CustomDropDown";
import {dateRange, dateToString} from "../utils/GlobalFuncitions";
import {myOrdersContext} from "../providers/MyOrdersProvider";
import {Divider} from "react-native-elements";

export default function MaxiCard({
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
    const card = useRef();
    const {user} = useContext(AuthenticatedUserContext);
    const {myOrders, updateMyOrders} = useContext(myOrdersContext);
    const [relatedOrders, setRelatedOrders] = useState([]);

    const onOrder = () => {
        selectedStart && selectedEnd
            ? addDoc(collection(db, "orders"), {
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
                    });
                    updateMyOrders();
                })
                .catch((e) => console.error("Error adding document: ", e))
            : Alert.alert("Error", "Please choose a date from the dropdown.", [
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
                    15
                )
            );
        }
    }, [selectedTimeSlot]);

    useEffect(() => {
        setRelatedOrders(
            myOrders
                .filter((order) => order.station_id === id)
                .map((order) => ({
                    start: order.reservation.date_start.toDate(),
                    end: order.reservation.date_finish.toDate(),
                }))
        );
    }, [myOrders]);

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
            <View style={{padding: 10}}>
                <ImageBackground
                    source={
                        image
                            ? {uri: image}
                            : require("../assets/defaults/default_image.png")
                    }
                    style={{width: 250, height: 150, alignSelf: "center"}}
                />

                <Text style={{flexWrap: "wrap", color: "red"}}>
                    {address}
                </Text>
                <Text>
                    {phone} {price} nis
                </Text>

                {/*Choose a TimeSlot*/}
                <CustomDropDown
                    items={timeSlots.map((d, index) => ({
                        label:
                            dateToString(d.start.toDate()) +
                            "-" +
                            dateToString(d.end.toDate()),
                        value: d,
                        key: Math.random().toString(),
                    }))}
                    setItems={() => {
                    }}
                    value={selectedTimeSlot}
                    setValue={setSelectedTimeSlot}
                    placeholder="Choose Time Slot"
                />
                <View style={{flex: 1, flexDirection: "row"}}>
                    {/*Choose a Starting time*/}
                    {selectedTimeSlot ? (
                        <CustomDropDown
                            items={selectedDateRange.map((date) => {
                                if (
                                    relatedOrders.some(
                                        ({start, end}) =>
                                            start <= date && end > date
                                    )
                                )
                                    return {
                                        label: dateToString(date),
                                        value: date,
                                        containerStyle: {
                                            backgroundColor: colors.invalid,
                                        },
                                        disabled: true,
                                    };
                                return {
                                    label: dateToString(date),
                                    value: date,
                                };
                            })}
                            setItems={setSelectedDateRange}
                            value={selectedStart}
                            setValue={setSelectedStart}
                            containerStyle={{width: "50%"}}
                            placeholder="Choose Starting Hour"
                        />
                    ) : null}
                    {/*Choose an Ending time*/}
                    {selectedStart ? (
                        <CustomDropDown
                            items={selectedDateRange
                                .filter((date) => date > selectedStart)
                                .map((date) =>
                                    relatedOrders.some(
                                        ({start, end}) =>
                                            (start <= selectedStart &&
                                                end > selectedStart) ||
                                            (start >= selectedStart &&
                                                date >= end)
                                    )
                                        ? {
                                            label: dateToString(date),
                                            value: date,
                                            containerStyle: {
                                                backgroundColor:
                                                colors.invalid,
                                            },
                                            disabled: true,
                                        }
                                        : {
                                            label: dateToString(date),
                                            value: date,
                                        }
                                )}
                            setItems={() => {
                            }}
                            value={selectedEnd}
                            setValue={setSelectedEnd}
                            containerStyle={{width: "50%"}}
                            placeholder="Choose Ending Hour"
                        />
                    ) : null}
                </View>
                <Divider orientation="horizontal"/>
                {selectedStart && selectedEnd ? (
                    <View>
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
                            <Text
                                style={{
                                    paddingHorizontal: 10,
                                    color: "white",
                                }}
                            >
                                order
                            </Text>
                            <MaterialCommunityIcons
                                name="book"
                                color={"white"}
                                size={30}
                            />
                        </TouchableOpacity>
                    </View>
                ) : null}
            </View>
        </Animated.View>
    );
}
