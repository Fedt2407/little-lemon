import { View, Text, StyleSheet, Image, SafeAreaView, TextInput, ScrollView } from 'react-native'
import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon, CheckBox } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import Button from '../components/Button';

const ProfileScreen = ({updateOnboardingStatus}) => {
    const navigation = useNavigation();
    
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');;

    useFocusEffect(
        useCallback(() => {
            const getData = async () => {
                try {
                    const savedImage = await AsyncStorage.getItem('profileImage');
                    const savedName = await AsyncStorage.getItem('name');
                    const savedLastName = await AsyncStorage.getItem('lastName');
                    const savedEmail = await AsyncStorage.getItem('email');
                    const savedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
                    const savedOrderStatuses = await AsyncStorage.getItem('orderStatuses');
                    const savedPasswordChanges = await AsyncStorage.getItem('passwordChanges');
                    const savedSpecialOffers = await AsyncStorage.getItem('specialOffers');
                    const savedNewsletter = await AsyncStorage.getItem('newsletter');
                    if (savedName !== null && savedEmail !== null) {
                        setProfileImage({ uri: savedImage });
                        setName(savedName);
                        setLastName(savedLastName);
                        setEmail(savedEmail);
                        setPhoneNumber(savedPhoneNumber);
                        setSelected([
                            JSON.parse(savedOrderStatuses),
                            JSON.parse(savedPasswordChanges),
                            JSON.parse(savedSpecialOffers),
                            JSON.parse(savedNewsletter),
                        ]);
                    }
                } catch (e) {
                    console.log('Failed to fetch the data')
                }
            }
            getData();
        }, [])
    );

    const [selected, setSelected] = useState([false, false, false, false]);
    const handleCheck = index => {
        const newSelected = [...selected];
        newSelected[index] = !newSelected[index];
        setSelected(newSelected);
    };

    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValid, setIsValid] = useState(null);
    const checkPhoneNumber = (value) => {
        setPhoneNumber(value);
        const syntax = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value);
        setIsValid(syntax);
    };

    // this block allows to select a photo from phone gallery
    const [status, requestPermission] = MediaLibrary.usePermissions();
    const [profileImage, setProfileImage] = useState(require('../assets/profile-image.png'));

    if (status === null) {
        requestPermission();
    }

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            setProfileImage({ uri: result.assets[0].uri });
        } else {
            alert('You did not select any image.');
        }
    };

    const saveData = async () => {
        try {
            await AsyncStorage.setItem('profileImage', profileImage.uri);
            await AsyncStorage.setItem('lastName', lastName);
            await AsyncStorage.setItem('phoneNumber', phoneNumber);
            await AsyncStorage.setItem('orderStatuses', selected[0].toString());
            await AsyncStorage.setItem('passwordChanges', selected[1].toString());
            await AsyncStorage.setItem('specialOffers', selected[2].toString());
            await AsyncStorage.setItem('newsletter', selected[3].toString());
            console.log('Data saved')
        } catch (e) {
            console.log('Failed to save data')
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('profileImage');
            await AsyncStorage.removeItem('name');
            await AsyncStorage.removeItem('lastName');
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('phoneNumber');
            await AsyncStorage.removeItem('orderStatuses');
            await AsyncStorage.removeItem('passwordChanges');
            await AsyncStorage.removeItem('specialOffers');
            await AsyncStorage.removeItem('newsletter');
            updateOnboardingStatus(false);
            console.log('Data removed')
        } catch (e) {
            console.log('Failed to remove data')
        }
    };


    return (
        <View style={styles.continer}>
            <SafeAreaView>
                <View style={styles.header}>
                    <Icon
                        name='arrow-back-circle'
                        type='ionicon'
                        size={60}
                        color='#495E57'
                        onPress={() => navigation.navigate('Home')}
                    />
                    <Image
                        source={require('../assets/Logo.png')}
                        style={styles.logo}
                    />
                    <Image
                        source={profileImage}
                        style={styles.profileIcon}
                    />
                </View>
                <ScrollView>
                    <View style={styles.formContainer}>
                        <Text style={styles.textTitle}>Personal information</Text>
                        <Text style={styles.textSubTitle}>Avatar</Text>
                        <View style={styles.profileContainer}>
                            <Image
                                source={profileImage}
                                style={styles.profile}
                            />
                            <Button
                                description="Change"
                                onPress={pickImageAsync}
                                width={'auto'}
                                backgroundColor="#495E57"
                                borderColor="#495E57"
                                color="#FFFFFF"
                            />
                            <Button
                                description="Remove"
                                onPress={() => setProfileImage(require('../assets/profile-image.png'))}
                                width={'auto'}
                                backgroundColor="#FFFFFF"
                                borderColor="#495E57"
                                color="gray"
                            />
                        </View>
                        <Text style={styles.textSubTitle}>First name</Text>
                        <TextInput
                            style={styles.textInput}
                            value={name}
                        />
                        <Text style={styles.textSubTitle}>Last name</Text>
                        <TextInput
                            style={styles.textInput}
                            value={lastName}
                            onChangeText={(text) => setLastName(text)}
                        />
                        <Text style={styles.textSubTitle}>Email</Text>
                        <TextInput
                            style={styles.textInput}
                            value={email}
                        />
                        <Text style={styles.textSubTitle}>Phone number</Text>
                        <TextInput
                            style={isValid === true || isValid === null ? styles.textInput : [styles.textInput, { borderColor: 'red' }]}
                            value={phoneNumber}
                            onChangeText={checkPhoneNumber}
                        />

                        <Text style={[styles.textTitle, { marginVertical: '5%' }]}>Email notification</Text>
                        <View style={{ marginBottom: '8%' }}>
                            {['Order statuses', 'Password changes', 'Special offers', 'Newsletter'].map((checkbox, index) => (
                                <CheckBox
                                    key={index}
                                    title={checkbox}
                                    checked={selected[index]}
                                    onPress={() => handleCheck(index)}
                                    containerStyle={styles.checkbox}
                                    checkedColor='#495E57'
                                    textStyle={{ fontWeight: 500 }}
                                />
                            ))}
                        </View>
                        <Button
                            description="Log out"
                            onPress={logout}
                            width={'100%'}
                            backgroundColor="#F4CE14"
                            borderColor="#EE9972"
                            color="#000000"
                        />
                        <View style={styles.buttonContainer}>
                            <Button
                                description="Discard changes"
                                width={'auto'}
                                backgroundColor="#FFFFFF"
                                borderColor="#495E57"
                                color="gray"
                            />
                            <Button
                                description="Save changes"
                                onPress={saveData}
                                width={'auto'}
                                backgroundColor="#495E57"
                                borderColor="#495E57"
                                color="#FFFFFF"
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    continer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        paddingBottom: '20%',
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: '5%',
    },
    profileContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '20%',
    },
    logo: {
        width: '50%',
        height: '70%',
        resizeMode: 'contain',
    },
    profileIcon: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        borderRadius: 50,
    },
    profile: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        borderRadius: 50,
        marginTop: '2%',
    },
    formContainer: {
        height: '100%',
        borderColor: '#dedede',
        borderWidth: 1,
        margin: '2%',
        borderRadius: 16,
        padding: '5%',
    },
    textTitle: {
        fontSize: 20,
        textAlign: 'left',
        fontWeight: 'bold',
    },
    textSubTitle: {
        fontSize: 16,
        textAlign: 'left',
        fontWeight: 'bold',
        color: 'gray',
        marginTop: '5%',
    },
    mainText: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    textInput: {
        fontSize: 20,
        padding: 10,
        width: '100%',
        alignSelf: 'center',
        borderColor: '#dedede',
        borderWidth: 2,
        borderRadius: 12,
        marginVertical: 5,
    },
    nextButton: {
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        width: '40%',
        backgroundColor: '#dedede',
        marginVertical: '10%',
        marginRight: '10%',
        marginLeft: 'auto',
        borderRadius: 16,
    },
    checkbox: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        marginVertical: '-1.5%',
        marginLeft: '-3%',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: '10%',
    },
})

export default ProfileScreen;