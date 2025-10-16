import React from 'react';
import { View, FlatList, Image, Text, StyleSheet } from 'react-native';

const imageData = [
{ id: '1', mode: 'cover', description: 'Cover Mode' },
{ id: '2', mode: 'contain', description: 'Contain Mode' },
{ id: '3', mode: 'stretch', description: 'Stretch Mode' },
{ id: '4', mode: 'repeat', description: 'Repeat Mode' },
{ id: '5', mode: 'center', description: 'Center Mode' },
];

const ImageItem = ({ mode, description }) => {
return (
<View style={styles.imageContainer}>
<Image
source={{ uri: 'https://picsum.photos/600/400' }}
style={styles.image}
resizeMode={mode}
/>
<Text style={styles.text}>{description}</Text>
</View>
);
};

const ImagesScreen = () => {
return (
<View style={styles.container}>
<FlatList
data={imageData}
renderItem={({ item }) => (
<ImageItem mode={item.mode} description={item.description} />
)}
keyExtractor={(item) => item.id}
contentContainerStyle={styles.list}
/>
</View>
);
};

export default ImagesScreen;

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#fff',
paddingHorizontal: 10,
paddingVertical: 20,
},
list: {
paddingBottom: 20,
},
imageContainer: {
alignItems: 'center',
marginBottom: 20,
},
image: {
width: 300,
height: 200,
borderRadius: 10,
},
text: {
marginTop: 10,
fontSize: 16,
fontWeight: 'bold',
color: '#333',
},
});