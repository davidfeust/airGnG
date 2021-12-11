import React, { useState } from "react";
import { StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

function CustomDropDown({
    items,
    setItems,
    value,
    setValue,
    placeholder,
    containerStyle,
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
            containerStyle={styles.container}
            placeholder={placeholder}
            containerStyle={([{ alignSelf: "flex-start" }], containerStyle)}
        />
    );
}

const styles = StyleSheet.create({
    container: {},
});

export default CustomDropDown;
