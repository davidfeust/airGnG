import React, { MutableRefObject } from 'react';
import {
    GooglePlacesAutocomplete,
    GooglePlacesAutocompleteRef,
    Point,
    Styles,
} from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
type ViewPort = {
    northeast: Point;
    southwest: Point;
};
export default function AddressAutocomplete({
    reference,
    setCords,
    placeHolder = 'Address',
    setViewPort = null,
    styleTag = 'default',
}: {
    reference: MutableRefObject<GooglePlacesAutocompleteRef>;
    setCords(cords: Point): void;
    placeHolder?: string;
    setViewPort?(viewPort: ViewPort): void;
    styleTag?: 'default' | 'styleSearch';
}) {
    const defaultStyle = {
        container: {
            flex: 0,
            width: '80%',
        },
        textInput: {
            borderBottomWidth: 1,
            borderColor: 'gray',
            margin: 2,
            padding: 5,
        },
        listView: {
            position: 'absolute',
            zIndex: 2,
            top: 46,
            borderBottomWidth: 1,
        },
        row: {
            backgroundColor: 'white',
        },
    };

    const styleSearch = {
        container: {
            flex: 0,
            width: '92%',
        },
        textInput: {
            margin: 2,
            borderRadius: 15,
        },
        listView: {
            zIndex: 4,
        },
        row: {
            backgroundColor: 'white',
        },
    };
    // I used styleToUse to implements the right style for the autocomplete component
    let styleToUse: Object | Partial<Styles> = defaultStyle;
    if (styleTag === 'styleSearch') {
        styleToUse = styleSearch;
    }

    return (
        <GooglePlacesAutocomplete
            textInputProps={{
                onSelectionChange: (e) => {
                    setCords(null);
                },
            }}
            ref={reference}
            placeholder={placeHolder}
            styles={styleToUse}
            nearbyPlacesAPI={'GooglePlacesSearch'}
            debounce={400}
            query={{
                key: Constants.manifest.extra.googleMapsApi,
                language: 'en-he',
            }}
            onPress={(data, details) => {
                setCords(details?.geometry?.location);
                if (setViewPort != null) {
                    setViewPort(details.geometry.viewport);
                }
            }}
            fetchDetails={true}
        />
    );
}
