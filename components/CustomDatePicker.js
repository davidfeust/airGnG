import React, {useState} from 'react'
import {View, Button} from 'react-native'
import DatePicker from 'react-native-neat-date-picker'
import {globalStyles} from "../assets/styles/globalStyles";

export default function CustomDatePicker() {

    const [showDatePicker, setShowDatePicker] = useState(false)

    const openDatePicker = () => {
        setShowDatePicker(true)
    }

    const onCancel = () => {
        // You should close the modal in here
        setShowDatePicker(false)
    }

    const onConfirm = (start,end) => {
        // You should close the modal in here
        setShowDatePicker(false)

        // The parameter 'date' is a Date object so that you can use any Date prototype method.
        console.log(start.getMonth(), end.getMonth())
        console.log()
    }

    return (
        <View style={globalStyles.container}>
            <Button title={'open'} onPress={openDatePicker}/>
            <DatePicker
                isVisible={showDatePicker}
                mode={'range'}
                onCancel={onCancel}
                onConfirm={onConfirm}
            />
        </View>
    );
}
