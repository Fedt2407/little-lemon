import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView } from 'react-native'
import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon, CheckBox } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

const HomeScreen = ({ updateOnboardingStatus }) => {
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
    const handlePress = index => {
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
                    <View style={{ height: 60, width: 60, backgroundColor: 'white' }}></View>
                    <Image
                        source={require('../assets/Logo.png')}
                        style={styles.logo}
                    />
                    <Image
                        source={profileImage}
                        style={styles.profileIcon}
                    />
                </View>
                <View style={styles.homeArea}>
                    <Text style={styles.mainTitle}>Little Lemon</Text>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <View style={{width: '60%'}}>
                            <Text style={styles.subtityle}>Chicago</Text>
                            <Text style={styles.homeText}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
                            <Icon 
                                name='magnifying-glass'
                                type='entypo'
                                color='black'
                                size={35}
                                style={styles.searchIcon}
                            />
                        </View>
                        <Image
                            source={require('../assets/Home.png')}
                            style={styles.homeImage}
                        />
                    </View>
                </View>
                <ScrollView>

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
    homeArea: {
        height: 350,
        width: '100%',
        backgroundColor: '#495E57',
        marginTop: 10,
        padding: 15,
    },
    mainTitle: {
        color: '#F4CE14',
        fontSize: 50,
        fontWeight: 'bold',
    },
    subtityle: {
        color: '#ffffff',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    homeText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 400,
    },
    homeImage: {
        width: 140,
        height: 160,
        marginTop: 30,
        marginLeft: 'auto',
        borderRadius: 16,
    },
    searchIcon: {
        width: 50,
        height: 50,
        marginTop: 20,
        alignSelf: 'flex-start',
        marginLeft: 10,
        backgroundColor: '#dedede',
        borderRadius: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default HomeScreen;