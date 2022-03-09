import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../assets/styles/colors';

const MiniCard = React.forwardRef(
    ({ image, ownerDetails, address, children, style }, ref) => {
        return (
            <View style={{ alignItems: 'center' }} ref={ref}>
                <View style={[styles.station_details, style]}>
                    <Image source={{ uri: image }} style={styles.image} />
                    <View style={styles.text}>
                        <Text style={styles.address_text}>{address}</Text>
                        {ownerDetails && (
                            <Text style={styles.owner_text}>
                                {'Owner: ' + ownerDetails.name}
                            </Text>
                        )}
                    </View>
                    {children}
                </View>
            </View>
        );
    }
);
export default MiniCard;
const styles = StyleSheet.create({
    station_details: {
        backgroundColor: '#fff',
        width: '90%',
        top: 40,
        flexDirection: 'row',
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 5,
        marginBottom: 40,
    },
    image: {
        width: 400 * 0.4,
        height: 300 * 0.4,
        alignItems: 'center',
    },
    text: {
        marginStart: 10,
        marginVertical: 20,
        justifyContent: 'space-between',
    },
    address_text: {
        maxWidth: '95%',
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    owner_text: {
        maxWidth: '95%',
        color: colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    num_text: {
        maxWidth: '95%',
        color: colors.primary,
        fontSize: 15,
    },
});
