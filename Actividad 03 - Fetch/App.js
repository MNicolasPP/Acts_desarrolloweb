import React, { useEffect, useState, useCallback } from 'react';
import {Text, View, StyleSheet, SectionList, ActivityIndicator, RefreshControl} from 'react-native';

const URL =
  'https://raw.githubusercontent.com/MarioDuran/react-native-course/refs/heads/main/Example3/TC2007B.json';

const Item = ({ name }) => (
  <View style={styles.item}>
    <Text style={styles.itemText}>{name}</Text>
  </View>
);

const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>{title}</Text>
  </View>
);

export default function App() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(URL); //traer el json
      const json = await res.json(); //convertirlo en objeto
      setSections(json.TC2007B || []); //guardar las secciones
    } catch (e) {
      console.log('Error cargando datos:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Cargando lista…</Text>
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <Item name={item.name} />}
      renderSectionHeader={({ section }) => (
        <SectionHeader title={section.title} />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <View style={styles.center}>
          <Text>No hay datos para mostrar.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    opacity: 0.7,
  },
  sectionHeader: {
    backgroundColor: '#f2f2f7',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '700',
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  itemText: {
    fontSize: 16,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e5ea',
    marginLeft: 16,
  },
  sectionSeparator: {
    height: 8,
    backgroundColor: 'transparent',
  },
});
