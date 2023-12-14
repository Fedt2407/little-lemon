import { View, Text, StyleSheet, Image, Pressable, SafeAreaView, SectionList, Alert } from 'react-native'
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import {
    createTable,
    getMenuItems,
    saveMenuItems,
    filterByQueryAndCategories,
} from '../database';
import { Searchbar } from 'react-native-paper';
import debounce from 'lodash.debounce';
import Filters from '../components/Filters';
import { getSectionListData, useUpdateEffect } from '../utils';

const API_URL =
    'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const sections = ['starters', 'mains', 'desserts', 'drinks', 'sides', 'specials']

const HomeScreen = () => {
    const navigation = useNavigation();
    const [profileImage, setProfileImage] = useState(require('../assets/profile-image.png'));

    const [data, setData] = useState([]);
    const [searchBarText, setSearchBarText] = useState('');
    const [query, setQuery] = useState('');
    const [filterSelections, setFilterSelections] = useState(
        sections.map(() => false)
    );

    // DONE BECAUSE THE LINK PROVIDED DON'T FETCH ALL THE PICTURES (Grilled Fish and Lemon Dessert are missing)
    const images = {
        'greekSalad.jpg': require('../assets/greekSalad.jpg'),
        'bruschetta.jpg': require('../assets/bruschetta.jpg'),
        'grilledFish.jpg': require('../assets/grilledFish.jpg'),
        'pasta.jpg': require('../assets/pasta.jpg'),
        'lemonDessert.jpg': require('../assets/lemonDessert.jpg'),
    };

    useFocusEffect(
        useCallback(() => {
            const getData = async () => {
                try {
                    const savedImage = await AsyncStorage.getItem('profileImage');
                    if (savedImage !== null) {
                        setProfileImage({ uri: savedImage });
                    }
                } catch (e) {
                    console.log('Failed to fetch the data')
                }
            }
            getData();
        }, [])
    );

    useEffect(() => {
        (async () => {
            try {
                // 1. Create table if it does not exist
                await createTable();
                // 2. Check if data was already stored
                let menuItems = await getMenuItems();

                if (menuItems.length === 0) {
                    // Fetching menu from URL
                    const response = await fetch(API_URL);
                    const json = await response.json();
                    menuItems = json.menu.map((item) => ({
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        image: item.image,
                        category: item.category,
                    }));
                    // Storing into database
                    saveMenuItems(menuItems);
                    // console.log(menuItems);
                }
                const sectionListData = getSectionListData(menuItems);
                setData(sectionListData);
            } catch (e) {
                // Handle error
                Alert.alert(e.message);
            }
        })();
    }, []);

    useUpdateEffect(() => {
        (async () => {
            try {
                const activeCategories = filterSelections
                    .map((selected, index) => {
                        if (selected) {
                            console.log(sections[index]);
                            return sections[index];
                        }
                        return null;
                    })
                    .filter(Boolean);

                const menuItems = await filterByQueryAndCategories(query, activeCategories);
                const sectionListData = getSectionListData(menuItems);
                setData(sectionListData);
            } catch (e) {
                Alert.alert(e.message);
            }
        })();
    }, [filterSelections, query]);

    // useUpdateEffect(() => {
    //     (async () => {
    //         const activeCategories = sections.filter((s, i) => {
    //             // If all filters are deselected, all categories are active
    //             if (filterSelections.every((item) => item === false)) {
    //                 return true;
    //             }
    //             // Return only categories that are active
    //             return !filterSelections[i];
    //         });
    //         try {
    //             const menuItems = await filterByQueryAndCategories(
    //                 query,
    //                 activeCategories
    //             );
    //             const sectionListData = getSectionListData(menuItems);
    //             setData(sectionListData);
    //         } catch (e) {
    //             Alert.alert(e.message);
    //         }
    //     })();
    // }, [filterSelections, query]);

    const lookup = useCallback((q) => {
        setQuery(q);
    }, []);

    const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

    const handleSearchChange = (text) => {
        setSearchBarText(text);
        debouncedLookup(text);
    };

    const handleFiltersChange = async (index) => {
        const updatedSelections = [...filterSelections];
        updatedSelections[index] = !updatedSelections[index];
        setFilterSelections(updatedSelections);
        console.log('Filter selections:', updatedSelections);
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <View style={{ height: 60, width: 60, backgroundColor: 'white' }}></View>
                    <Image
                        source={require('../assets/Logo.png')}
                        style={styles.logo}
                    />
                    <Pressable onPress={() => navigation.navigate('Profile')}>
                        <Image
                            source={profileImage}
                            style={styles.profileIcon}
                        />
                    </Pressable>
                </View>
                <View style={styles.homeArea}>
                    <Text style={styles.mainTitle}>Little Lemon</Text>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <View style={{ width: '60%' }}>
                            <Text style={styles.subtityle}>Chicago</Text>
                            <Text style={styles.homeText}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
                        </View>
                        <Image
                            source={require('../assets/Home.png')}
                            style={styles.homeImage}
                        />
                    </View>
                    <Searchbar
                        placeholderTextColor="black"
                        value={searchBarText}
                        onChangeText={handleSearchChange}
                        style={styles.searchBar}
                        iconColor="black"
                        elevation={0}
                    />
                </View>
                <Text style={styles.orderTitle}>ORDER FOR DELIVERY!</Text>
                <View style={styles.buttonContainer}>
                    <Filters
                        selections={filterSelections}
                        onChange={handleFiltersChange}
                        sections={sections}
                    />
                </View>
                <SectionList
                    sections={data}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <View style={{ width: '70%' }}>
                                <Text style={styles.itemTitle}>{item.name}</Text>
                                <Text style={styles.itemDescription} numberOfLines={2} ellipsizeMode='tail'>{item.description}</Text>
                                <Text style={styles.itemPrice}>${item.price}</Text>
                            </View>
                            <Image
                                source={images[item.image]}
                                style={styles.itemImage}
                            />
                        </View>
                    )}
                    renderSectionHeader={() => null}
                    SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
                    ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
                />
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
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
        height: 340,
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
        marginBottom: 20,
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
    orderTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        margin: 15,
    },
    buttonContainer: {
        width: '93%',
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingBottom: 20,
    },
    listSeparator: {
        height: 0.5,
        width: '93%',
        backgroundColor: '#545454',
        alignSelf: 'center',
    },
    sectionSeparator: {
        height: 0.3,
        width: '93%',
        backgroundColor: '#545454',
        alignSelf: 'center',
    },
    itemContainer: {
        width: '95%',
        alignSelf: 'center',
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    itemDescription: {
        fontSize: 16,
        color: '#545454',
        marginVertical: 10,
    },
    itemPrice: {
        fontSize: 20,
        color: '#545454',
        fontWeight: '500',
    },
    itemImage: {
        width: 100,
        height: 100,
        objectFit: 'cover',
        marginTop: 10,
    },
    searchBar: {
        marginTop: 10,
        backgroundColor: '#fefefe',
        borderRadius: 12,
        width: '100%',
        height: 50,
    },
})

export default HomeScreen;