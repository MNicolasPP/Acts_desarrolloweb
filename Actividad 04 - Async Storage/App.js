import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountSettings = () => {
  const [pushNotifications, setPushNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [latestNews, setLatestNews] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false); 

  const PUSH_NOTIFICATIONS_KEY = 'PUSH_NOTIFICATIONS';
  const MARKETING_EMAIL_KEY = 'MARKETING_EMAILS';
  const LATEST_NEWS_KEY = 'LATEST_NEWS';
  const DARK_THEME_KEY = 'DARK_THEME';

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const pushNotiValue = await AsyncStorage.getItem(PUSH_NOTIFICATIONS_KEY);
      const marketingEmailValue = await AsyncStorage.getItem(MARKETING_EMAIL_KEY);
      const latestNewsValue = await AsyncStorage.getItem(LATEST_NEWS_KEY);
      const darkThemeValue = await AsyncStorage.getItem(DARK_THEME_KEY);

      if (pushNotiValue !== null) setPushNotifications(JSON.parse(pushNotiValue));
      if (marketingEmailValue !== null) setMarketingEmails(JSON.parse(marketingEmailValue));
      if (latestNewsValue !== null) setLatestNews(JSON.parse(latestNewsValue));
      if (darkThemeValue !== null) setDarkTheme(JSON.parse(darkThemeValue));
    } catch (error) {
      console.error('Error loading preferences', error);
    }
  };

  const savePreference = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving preference', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Settings</Text>

      <View style={styles.row}>
        <Text>Marketing Emails</Text>
        <Switch
          value={marketingEmails}
          onValueChange={(value) => {
            setMarketingEmails(value);
            savePreference(MARKETING_EMAIL_KEY, value);
          }}
        />
      </View>

      <View style={styles.row}>
        <Text>Push Notifications</Text>
        <Switch
          value={pushNotifications}
          onValueChange={(value) => {
            setPushNotifications(value);
            savePreference(PUSH_NOTIFICATIONS_KEY, value);
          }}
        />
      </View>

      <View style={styles.row}>
        <Text>Latest News</Text>
        <Switch
          value={latestNews}
          onValueChange={(value) => {
            setLatestNews(value);
            savePreference(LATEST_NEWS_KEY, value);
          }}
        />
      </View>

      {}
      <View style={styles.row}>
        <Text>Dark Theme</Text>
        <Switch
          value={darkTheme}
          onValueChange={(value) => {
            setDarkTheme(value);
            savePreference(DARK_THEME_KEY, value);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 3,
  },
});

export default AccountSettings;