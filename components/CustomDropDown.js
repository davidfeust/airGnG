import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker"; // docs: https://www.npmjs.com/package/react-native-dropdown-picker
import { StyleSheet } from "react-native";

function CustomDropDown({
    items,
    setItems,
    value,
    setValue,
    placeholder,
    containerStyle,
    itemkey,
}) {
    const [open, setOpen] = useState(false);

    return (
        <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder={placeholder}
            containerStyle={[containerStyle, styles.dropDown]}
            itemKey={itemkey}
            dropDownDirection="TOP"
        />
    );
}

export default CustomDropDown;

const styles = StyleSheet.create({
    dropDown: {
        // justifyContent: "center",
        // backgroundColor: "red",
        marginVertical: 3,
    },
});
