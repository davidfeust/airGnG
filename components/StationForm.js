import React from 'react';
import {Dimensions, Keyboard, ScrollView, Text, TextInput, TouchableWithoutFeedback, View} from 'react-native';
import {globalStyles} from "../assets/styles/globalStyles";
import {Formik} from "formik";
import Autocomplete from "./Autocomplete";
import {colors} from "../assets/styles/colors";
import ImagePicker from "./ImagePicker";
import Checkbox from "expo-checkbox";
import MyButton from "./MyButton";
import * as yup from "yup";


export default function StationForm({submit, processing, formValues, googleAddress}) {

    const width = Dimensions.get('window').width;

    const formSchema = yup.object({
        price: yup.number().required(),
        cords: yup.object().nullable()
            .test('notNull', 'address is a required field', (value) => value)
    });


    return (
        <Formik
            enableReinitialize
            initialValues={formValues}
            onSubmit={values => submit(values)}
            validationSchema={formSchema}>
            {(formikProps) => (
                <View style={{width: '100%', alignItems: "center"}}>
                    <Autocomplete
                        reference={googleAddress}
                        setCords={(newVal) => formikProps.setFieldValue('cords', newVal)}/>
                    <Text style={{color: colors.error}}>
                        {//formikProps.touched.cords &&
                            formikProps.errors.cords}
                    </Text>

                    <ScrollView keyboardShouldPersistTaps={'handled'}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={[globalStyles.container, {width: width, paddingBottom: 170}]}>
                                {/* Price field*/}
                                <TextInput
                                    style={globalStyles.text_input}
                                    placeholder="Price per hour"
                                    keyboardType={"number-pad"}
                                    onChangeText={formikProps.handleChange('price')}
                                    onBlur={formikProps.handleBlur('price')}
                                    value={formikProps.values.price}
                                />
                                <Text style={{color: colors.error}}>
                                    {formikProps.touched.price && formikProps.errors.price}
                                </Text>

                                <ImagePicker image={formikProps.values.image}
                                             setImage={(img) => formikProps.setFieldValue('image', img)}/>

                                {/* shadowed field */}
                                <View style={globalStyles.flex_container}>
                                    <Checkbox
                                        style={globalStyles.checkbox}
                                        value={formikProps.values.shadowed}
                                        onValueChange={nextValue => formikProps.setFieldValue('shadowed', nextValue)}
                                    />
                                    <Text style={globalStyles.checkbox_label}>Shadowed parking
                                                                              spot</Text>
                                </View>

                                {/* Submit */}
                                <MyButton
                                    text={'post'}
                                    processing={processing}
                                    onPress={formikProps.handleSubmit}
                                    disabled={!(formikProps.isValid && formikProps.dirty)}
                                />

                            </View>
                        </TouchableWithoutFeedback>
                    </ScrollView>
                </View>
            )}
        </Formik>
    );
}