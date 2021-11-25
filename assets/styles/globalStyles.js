import {StyleSheet} from "react-native";
import {colors} from "./colors";

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
    , title: {
        fontSize: 40,
        fontWeight: 'bold',
        maxWidth: '65%',
        textAlign: 'center',
        color: colors.primary,
    },
    bt: {
        width: 120,
        height: 45,
        backgroundColor: colors.primary,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        margin: 5
    },
    in_bt: {
        color: 'white'
    },
    text_input: {
        borderBottomWidth: 1,
        borderColor: 'gray',
        margin: 2,
        padding: 5,
        width: '80%'
    },
});
