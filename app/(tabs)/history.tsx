import { StyleSheet, FlatList, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HistoryItem from "../../components/HistoryItem";
import { Colors } from "../../constants/Colors";
import { useCallback, useState } from "react";
import { connectToDatabase, getHistoryRecords } from "../../db/db";
import { useFocusEffect } from "expo-router";

export default function History() {
  const colorScheme = useColorScheme();
  const [data, setData] = useState<ImageType[]>([]);

  const getData = useCallback(async () => {
    const db = connectToDatabase();
    const history = await getHistoryRecords(db);
    setData(history);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  return (
    <SafeAreaView
      style={{flex:1, backgroundColor: Colors[colorScheme ?? "light"].background }}
    >
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <HistoryItem
            item={item}
            setData={setData}
          />
        )}
        numColumns={2}
        keyExtractor={(item) => item.id!}
      />
    </SafeAreaView>
  );
}
