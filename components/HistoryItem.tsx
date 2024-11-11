import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { connectToDatabase, deleteHistoryRecord } from '../db/db';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, Image, View, Pressable, useColorScheme } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Colors } from '../constants/Colors';

type HistoryItemProps = {
  item: {
    id?: string,
    type: string,
    location: string,
    time: number,
    imagePath: string,
  },
  setData: React.Dispatch<React.SetStateAction<ImageType[]>>
}

const HistoryItem = ({ item, setData }: HistoryItemProps) => {

  const date = new Date(item.time).toLocaleDateString();
  const colorScheme = useColorScheme();
  const styles = useMemo(() => makeStyles(colorScheme == "dark" ? Colors.dark : Colors.light),[]);
  const backgroundColor = colorScheme == "dark" ? Colors.dark.itemBackground : Colors.light.itemBackground;
  const iconColor = colorScheme == "dark" ? Colors.dark.tabIconSelected : Colors.light.tabIconSelected;
  const deleteIconColor = colorScheme == "dark" ? Colors.dark.tabIconSelected : Colors.light.tabIconSelected;
  const handleDelete = async () => {
    if (!item.id) return;
    try {
      const db = await connectToDatabase();
      await deleteHistoryRecord(db, item.id);
      await FileSystem.deleteAsync(item.imagePath);
      setData((prev) => prev.filter((record) => record.id !== item.id));
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <ThemedView style={styles.container}>
      <View style={{ ...styles.item, backgroundColor: backgroundColor }}>
        <Image source={{ uri: item.imagePath }} style={styles.image} />
        <ThemedText>{item.type}</ThemedText>
        <View style={styles.info}>
          <Ionicons name="locate-outline" size={20} color={iconColor} />
          <ThemedText>{item.location}</ThemedText>
        </View>
        <View style={styles.info}>
          <Ionicons name="calendar-outline" size={20} color={iconColor}/>
          <ThemedText>{date}</ThemedText>
        </View>
        <Pressable onPress={handleDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={15} color={deleteIconColor}/>
        </Pressable>
      </View>
    </ThemedView>
  )
}

const makeStyles = (colors: typeof Colors.dark | typeof Colors.light) => StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1/2,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: "90%",
  },
  info: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.navBackground,
    padding: 3,
    borderRadius: 100,
  }
});

export default HistoryItem