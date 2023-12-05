import { View, Text, StyleSheet, Image, SafeAreaView, TextInput, ScrollView, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { Icon, CheckBox } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';

const ProfileScreen = () => {
    const navigation = useNavigation();

    const [selected, setSelected] = useState([false, false, false, false]);

    const handlePress = index => {
        const newSelected = [...selected];
        newSelected[index] = !newSelected[index];
        setSelected(newSelected);
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
                        source={require('../assets/Profile.png')}
                        style={styles.profileIcon}
                    />
                </View>
                <ScrollView>
                    <View style={styles.formContainer}>
                        <Text style={styles.textTitle}>Personal information</Text>
                        <Text style={styles.textSubTitle}>Avatar</Text>
                        <View style={styles.profileContainer}>
                            <Image
                                source={require('../assets/Profile.png')}
                                style={styles.profile}
                            />
                            <Button
                                description="Change"
                                onPress={() => navigation.navigate('Profile')}
                                width={'auto'}
                                backgroundColor="#495E57"
                                borderColor="#495E57"
                                color="#FFFFFF"
                            />
                            <Button
                                description="Remove"
                                onPress={() => navigation.navigate('Profile')}
                                width={'auto'}
                                backgroundColor="#FFFFFF"
                                borderColor="#495E57"
                                color="gray"
                            />
                        </View>
                        <Text style={styles.textSubTitle}>First name</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter your name"
                        />
                        <Text style={styles.textSubTitle}>Last name</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter your email"
                        />
                        <Text style={styles.textSubTitle}>Email</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter your name"
                        />
                            <Text style={styles.textSubTitle}>Phone number</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter your email"
                            />
                            <Text style={[styles.textTitle, { marginVertical: '5%' }]}>Email notification</Text>
                            <View style={{ marginBottom: '8%' }}>
                                {['Order statuses', 'Password changes', 'Special offers', 'Newsletter'].map((checkbox, index) => (
                                    <CheckBox
                                        key={index}
                                        title={checkbox}
                                        checked={selected[index]}
                                        onPress={() => handlePress(index)}
                                        containerStyle={styles.checkbox}
                                        checkedColor='#495E57'
                                        textStyle={{ fontWeight: 500 }}
                                    />
                                ))}
                            </View>
                        <Button
                            description="Log out"
                            onPress={() => navigation.navigate('Profile')}
                            width={'100%'}
                            backgroundColor="#F4CE14"
                            borderColor="#EE9972"
                            color="#000000"
                        />
                        <View style={styles.buttonContainer}>
                            <Button
                                description="Discard changes"
                                onPress={() => navigation.navigate('Profile')}
                                width={'auto'}
                                backgroundColor="#FFFFFF"
                                borderColor="#495E57"
                                color="gray"
                            />
                            <Button
                                description="Save changes"
                                onPress={() => navigation.navigate('Profile')}
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
        height: '10%',
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