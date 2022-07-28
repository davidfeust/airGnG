import React from 'react';
import {
    Image,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';
import { AirGnGUser, PlugType } from '../App.d';
import { colors } from '../assets/styles/colors';

class MiniCard extends React.PureComponent<{
    image: string;
    ownerDetails: AirGnGUser;
    address: string;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    price?: number;
    plugType: PlugType;
}> {
    render() {
        const {
            image,
            ownerDetails,
            address,
            children,
            style,
            price,
            plugType,
        } = this.props;
        return (
            <View
                style={{
                    alignItems: 'center',
                    paddingVertical: 10,
                }}
            >
                <View style={[styles.station_details, style]}>
                    <Image source={{ uri: image }} style={styles.image} />
                    <View style={styles.text}>
                        <Text  style={styles.address_text}>{address}</Text>
                        <Text
                            style={styles.owner_text}
                        >{`Plug Type: ${plugType}`}</Text>
                        {ownerDetails && (
                            <Text style={styles.owner_text}>
                                {'Owner: ' + ownerDetails.name}
                            </Text>
                        )}
                        {children}
                    </View>
                </View>
            </View>
        );
    }
}

export default MiniCard;
const styles = StyleSheet.create({
    station_details: {
        backgroundColor: '#fff',
        width: '90%',
        top: 40,
        flexDirection: 'row',
        borderRadius: 15,
        elevation: 5,
        marginBottom: 40,
    },
    image: {
        width: 300 * 0.5,
        height: 300 * 0.5,
        alignItems: 'center',
        borderRadius: 15,
    },
    text: {
        marginStart: 10,
        marginVertical: 20,
        // justifyContent: 'space-between',
    },
    address_text: {
        maxWidth: '80%',
        color: colors.primary,
        fontSize: 15,
        fontWeight: 'bold',
    },
    owner_text: {
        maxWidth: '95%',
        color: colors.primary,
        fontSize: 15,
        fontWeight: 'bold',
    },
    num_text: {
        maxWidth: '95%',
        color: colors.primary,
        fontSize: 15,
    },
});
