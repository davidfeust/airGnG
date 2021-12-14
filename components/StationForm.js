import React from 'react';
import {Dimensions, Keyboard, ScrollView, Text, TextInput, TouchableWithoutFeedback, View} from 'react-native';
import {globalStyles} from "../assets/styles/globalStyles";
import {Formik} from "formik";
import Autocomplete from "./Autocomplete";
import {colors} from "../assets/styles/colors";
import CustomDatePicker from "./CustomDatePicker";
import ImagePicker from "./ImagePicker";
import Checkbox from "expo-checkbox";
import MyButton from "./MyButton";
import * as yup from "yup";


export default function StationForm({submit, processing, formValues, googleAddress}) {

    const width = Dimensions.get('window').width;

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const formSchema = yup.object({
        phone: yup.string().required().matches(phoneRegExp, 'Phone number is not valid'),
        name: yup.string().min(2).required(),
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

                                {/* Time slots */}
                                <CustomDatePicker
                                    timeSlots={formikProps.values.timeSlots}
                                    setTimeSlots={(newVal) => formikProps.setFieldValue('timeSlots', newVal)}/>

                                <Text style={globalStyles.subTitle}>Contact Details</Text>

                                {/* Name field */}
                                <TextInput
                                    style={globalStyles.text_input}
                                    placeholder="Name"
                                    onChangeText={formikProps.handleChange('name')}
                                    onBlur={formikProps.handleBlur('name')}
                                    value={formikProps.values.name}
                                />
                                <Text style={{color: colors.error}}>
                                    {formikProps.touched.name && formikProps.errors.name}
                                </Text>

                                {/* Phone field */}
                                <TextInput
                                    style={globalStyles.text_input}
                                    placeholder="Phone number"
                                    keyboardType={"phone-pad"}
                                    onChangeText={formikProps.handleChange('phone')}
                                    onBlur={formikProps.handleBlur('phone')}
                                    value={formikProps.values.phone}
                                />
                                <Text style={{color: colors.error}}>
                                    {formikProps.touched.phone && formikProps.errors.phone}
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
