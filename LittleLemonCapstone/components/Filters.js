import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Filters = ({ onChange, selections, sections }) => {
  return (
    <ScrollView horizontal style={styles.filtersContainer} contentContainerStyle={styles.contentContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            onChange(index);
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 15,
            paddingHorizontal: 10,
            backgroundColor: selections[index] ? '#495E57' : '#dedede',
            borderRadius: 16,
            marginHorizontal: 5,
          }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: selections[index] ? 'white' : '#545454' }}>
            {section}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: 'row',
  },
  contentContainer: {
    alignItems: 'center',
  },
});

export default Filters;