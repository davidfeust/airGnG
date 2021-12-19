import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import CustomDateManager from "../components/CustomDateManager";
import {globalStyles} from "../assets/styles/globalStyles";
import {getStartAndEndTime} from "../utils/GlobalFuncitions";
import CustomButton from "../components/CustomButton";
import {db} from '../config/firebase';
import {doc, getDoc, updateDoc} from "firebase/firestore";

export default function PublishStationScreen({route, navigation}) {
    const [timeSlots, setTimeSlots] = useState([]);
    const [processing, setProcessing] = useState(false);

    useEffect(async () => {
        const docRef = doc(db, "stations", route.params.station_id);
        const docSnap = await getDoc(docRef);
        const docData = docSnap.data();

        // convert timestamp of firebase to Date of JS
        let temp = [...docData.time_slots];
        temp = temp.map((slot) => ({
            start: new Date(slot.start.toDate()),
            end: new Date(slot.end.toDate()),
        }))
        if (temp.length === 0) {
            temp.push(getStartAndEndTime())
        }
        setTimeSlots(temp);
    }, []);

    const onPublish = async () => {
        setProcessing(true);

        const stationRef = doc(db, "stations", route.params.station_id);
        await updateDoc(stationRef, {
            time_slots: timeSlots
        })
            .then(() => {
                setProcessing(false);
                navigation.pop();
            })
            .catch(() => setProcessing(false));
    };

    return (
        <View style={[globalStyles.container,]}>
            <ScrollView>
                <View style={[globalStyles.container, {paddingVertical: 70}]}>

                    <Text style={globalStyles.title}>Publish This Station</Text>
                    {/* Time slots */}
                    <CustomDateManager
                        timeSlots={timeSlots}
                        setTimeSlots={setTimeSlots}
                    />

                    <CustomButton text={'Publish'} onPress={onPublish} processing={processing}/>
                </View>
            </ScrollView>
        </View>

    );
}
