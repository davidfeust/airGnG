import React, { useState } from 'react';
import {
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { globalStyles } from '../assets/styles/globalStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { Formik } from 'formik'; // to manage forms. docs: https://formik.org/docs/api/formik
import * as yup from 'yup'; // validation of forms. docs: https://www.npmjs.com/package/yup
import { colors } from '../assets/styles/colors';

export default function SignInScreen() {
    const formValues = {
        email: '',
        password: '',
    };

    const formSchema = yup.object({
        email: yup.string().email().required(),
        password: yup.string().required().min(6),
    });

    const [showPass, setShowPass] = useState(true);
    const [processing, setProcessing] = useState(false);

    const handleLogin = async (email, password) => {
        setProcessing(true);
        await signInWithEmailAndPassword(auth, email, password)
            //after 'then' function we will change the processing value in order to show the indicator
            .then(() => {
                setProcessing(false);
            })
            .catch((error) => {
                alert(error.message);
                setProcessing(false);
            });
    };
    const forgotPassword = (Email) => {
        sendPasswordResetEmail(auth, Email, null)
            .then(() => {
                alert(
                    'reset email sent to ' +
                        Email +
                        '\nPlease check your email...'
                );
                console.log('reset email sent to ' + Email);
            })
            .catch(function (e) {
                console.log(e);
                alert('Email Not Verified!');
            });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={[globalStyles.title, styles.title]}>Sing In</Text>

                <Formik
                    initialValues={formValues}
                    onSubmit={(values) =>
                        handleLogin(values.email, values.password)
                    }
                    validationSchema={formSchema}
                >
                    {
                        /**
                         * formik children must be a function returns JSX of the form formikProps is an object
                         * contains all the necessary fields of the form management
                         * like handleSubmit, handleChange, values...
                         * @param formikProps
                         * @returns {JSX.Element}
                         */
                        (formikProps) => {
                            return (
                                <View
                                    style={{
                                        width: '100%',
                                        alignItems: 'center',
                                    }}
                                >
                                    {/* Email field */}
                                    <TextInput
                                        style={globalStyles.text_input}
                                        placeholder={'Email'}
                                        onChangeText={formikProps.handleChange(
                                            'email'
                                        )}
                                        value={formikProps.values.email}
                                        onBlur={formikProps.handleBlur('email')}
                                        textContentType='emailAddress'
                                        keyboardType={'email-address'}
                                    />
                                    <Text style={{ color: colors.error }}>
                                        {formikProps.touched.email &&
                                            formikProps.errors.email}
                                    </Text>

                                    {/* View for password field to include eye button inside the field */}
                                    <View
                                        style={[
                                            globalStyles.text_input,
                                            {
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            },
                                        ]}
                                    >
                                        <View style={{ flex: 10 }}>
                                            <TextInput
                                                onChangeText={formikProps.handleChange(
                                                    'password'
                                                )}
                                                value={
                                                    formikProps.values.password
                                                }
                                                placeholder='Password'
                                                secureTextEntry={showPass}
                                                autoComplete={'password'}
                                                onBlur={formikProps.handleBlur(
                                                    'password'
                                                )}
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    setShowPass(!showPass)
                                                }
                                            >
                                                <MaterialCommunityIcons
                                                    name={
                                                        showPass
                                                            ? 'eye-off'
                                                            : 'eye'
                                                    }
                                                    color={'gray'}
                                                    size={20}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <Text style={{ color: 'crimson' }}>
                                        {formikProps.touched.password
                                            ? formikProps.errors.password
                                            : ''}
                                    </Text>

                                    <TouchableOpacity
                                        style={{ marginTop: 30 }}
                                        onPress={() => {
                                            forgotPassword(
                                                formikProps.values.email
                                            );
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'darkblue',
                                                fontSize: 16,
                                            }}
                                        >
                                            Forgot your password? Reset now!
                                        </Text>
                                    </TouchableOpacity>

                                    <CustomButton
                                        text={'Login'}
                                        style={{ marginTop: 50 }}
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
                            );
                        }
                    }
                </Formik>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    title: {
        marginTop: '30%',
        marginBottom: '20%',
    },
});
