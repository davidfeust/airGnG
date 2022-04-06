import { Picker } from '@react-native-community/picker';
import { Formik } from 'formik';
import React, { MutableRefObject } from 'react';
import {
    Dimensions,
    Keyboard,
    ScrollView,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {
    GooglePlacesAutocompleteRef,
    Point,
} from 'react-native-google-places-autocomplete';
import * as yup from 'yup';
import { colors } from '../assets/styles/colors';
import { globalStyles } from '../assets/styles/globalStyles';
import AddressAutocomplete from './AddressAutocomplete';
import CustomButton from './CustomButton';
import ImagePicker from './ImagePicker';

export default function StationForm({
    submit,
    processing,
    formValues,
    googleAddress,
}: {
    submit: any;
    processing: boolean;
    formValues: any;
    googleAddress: MutableRefObject<GooglePlacesAutocompleteRef>;
}) {
    const width = Dimensions.get('window').width;
    const formSchema = yup.object({
        price: yup.number().required(),
        cords: yup
            .object()
            .nullable()
            .test(
                'notNull',
                'Please Choose a station address',
                (test) => test != null
            ),
        plugType: yup.string().required(),
    });

    return (
        <Formik
            enableReinitialize
            initialValues={formValues}
            onSubmit={(values) => submit(values)}
            validationSchema={formSchema}
        >
            {(formikProps) => (
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <AddressAutocomplete
                        reference={googleAddress}
                        setCords={(newVal: Point) => {
                            formikProps.setFieldValue('cords', {
                                latitude: newVal.lat,
                                longitude: newVal.lng,
                            });
                        }}
                    />
                    <Text style={{ color: colors.error }}>
                        {
                            //formikProps.touched.cords &&
                            formikProps.errors.cords
                        }
                    </Text>

                    <ScrollView keyboardShouldPersistTaps={'handled'}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View
                                style={[
                                    globalStyles.container,
                                    { width: width, paddingBottom: 150 },
                                ]}
                            >
                                {/* Price field*/}
                                <TextInput
                                    style={globalStyles.text_input}
                                    placeholder='Price per hour'
                                    keyboardType={'number-pad'}
                                    onChangeText={formikProps.handleChange(
                                        'price'
                                    )}
                                    onBlur={formikProps.handleBlur('price')}
                                    value={formikProps.values.price.toString()}
                                />
                                <Text style={{ color: colors.error }}>
                                    {formikProps.touched.price &&
                                        formikProps.errors.price}
                                </Text>

                                <Text style={{ color: colors.error }}>
                                    {formikProps.touched.plugType &&
                                        formikProps.errors.plugType}
                                </Text>

                                {/* Plug type field*/}
                                <Text>Plug Type:</Text>
                                <Picker
                                    style={{
                                        alignSelf: 'stretch',
                                        maxWidth: '75%',
                                    }}
                                    selectedValue={formikProps.values.plugType}
                                    onValueChange={(selected) =>
                                        formikProps.setFieldValue(
                                            'plugType',
                                            selected
                                        )
                                    }
                                >
                                    <Picker.Item value={'BEV'} label={'BEV'} />
                                    <Picker.Item
                                        value={'PHEV'}
                                        label={'PHEV'}
                                    />
                                    <Picker.Item value={'HEV'} label={'HEV'} />
                                </Picker>

                                <ImagePicker
                                    image={formikProps.values.image}
                                    setImage={(img) =>
                                        formikProps.setFieldValue('image', img)
                                    }
                                />

                                {/* Submit */}
                                <CustomButton
                                    text={'post'}
                                    processing={processing}
                                    onPress={formikProps.handleSubmit}
                                    disabled={
                                        !(
                                            formikProps.isValid &&
                                            formikProps.dirty
                                        )
                                    }
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </ScrollView>
                </View>
            )}
        </Formik>
    );
}
