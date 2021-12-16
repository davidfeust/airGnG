import React, {useState} from "react";
import DropDownPicker from "react-native-dropdown-picker"; // docs: https://www.npmjs.com/package/react-native-dropdown-picker

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
            placeholder={placeholder}
            containerStyle={[{alignSelf: "flex-start"}, containerStyle]}
        />
    );
}

export default CustomDropDown;
