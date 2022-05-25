import React, { useContext, useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '../assets/styles/globalStyles';
import { Formik } from 'formik';
import { colors } from '../assets/styles/colors';
import * as yup from 'yup';
import CustomButton from '../components/CustomButton';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import UploadPicture from '../components/UploadPicture';
import { uploadImage } from '../utils/GlobalFuncitions';

export default function UserDetailsScreen({ navigation }) {
    const { user, setUser } = useContext(AuthenticatedUserContext);
    const [processing, setProcessing] = useState(false);
    const [formValues, setFormValues] = useState({
        name: '',
        phone: '',
    });

    useEffect(() => {
        setFormValues({
            name: user.name,
            phone: user.phone,
        });
    }, []);

    const phoneRegExp =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    const formSchema = yup.object({
        phone: yup.string().matches(phoneRegExp, 'Phone number is not valid'),
        name: yup.string().min(2),
    });

    const onSave = async ({ name, phone }) => {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
            phone: phone,
            name: name,
        })
            .then(() => {
                setUser({ ...user, phone, name });
                setProcessing(false);
                navigation.push('TabsNavigator');
            })
            .catch(console.error);
    };


    
    return (
        <View style={globalStyles.container}>
            <Text style={[globalStyles.title, { marginTop: 80 }]}>
                Let us know you!
            </Text>
            <UploadPicture
                fullPath={`images_profiles/${user.uid}.jpg`}
                onFinish={(image) => {
                    // onFinish will be called on:
                    // 1. succesful upload (then image will be the correct url)
                    // 2. deletion (then image will be null)
                    // onFinish will not be called in case of an error
                    setUser({ ...user, image });
                }}
                defaultImage={user.image !== undefined ? user.image : null}
            />

            <Formik
                initialValues={formValues}
                onSubmit={(values) => onSave(values)}
                validationSchema={formSchema}
                enableReinitialize
            >
                {(formikProps) => (
                    <View
                        style={{
                            width: '100%',
                            alignItems: 'center',
                            marginTop: 50,
                        }}
                    >
                        {/*Name field*/}
                        <TextInput
                            style={globalStyles.text_input}
                            placeholder='Name'
                            onChangeText={formikProps.handleChange('name')}
                            onBlur={formikProps.handleBlur('name')}
                            value={formikProps.values.name}
                        />
                        <Text style={{ color: colors.error }}>
                            {formikProps.touched.name &&
                                formikProps.errors.name}
                        </Text>

                        {/*Phone field*/}
                        <TextInput
                            style={globalStyles.text_input}
                            placeholder='Phone number'
                            keyboardType={'phone-pad'}
                            onChangeText={formikProps.handleChange('phone')}
                            onBlur={formikProps.handleBlur('phone')}
                            value={formikProps.values.phone}
                        />
                        <Text style={{ color: colors.error }}>
                            {formikProps.touched.phone &&
                                formikProps.errors.phone}
                        </Text>

                        {/* Submit */}
                        <CustomButton
                            text={'Submit'}
                            style={{ marginTop: 120 }}
                            processing={processing}
                            onPress={formikProps.handleSubmit}
                            disabled={
                                !(formikProps.isValid && formikProps.dirty)
                            }
                        />

                        {/* Skip */}
                        <TouchableOpacity
                            style={[
                                globalStyles.flex_container,
                                { marginTop: 10 },
                            ]}
                            onPress={() => navigation.push('TabsNavigator')}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: colors.secondary,
                                }}
                            >
                                Skip for now{' '}
                            </Text>
                            <MaterialCommunityIcons
                                name={'arrow-right-circle'}
                                color={colors.secondary}
                                size={24}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </View>
    );
}
