import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '../../components/navigation/TabBarIcon';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors[colorScheme ?? 'light'].navBackground},
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'camera' : 'camera-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'server' : 'server-outline'} color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="index"
        options={{
          title: 'Info',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'information-circle' : 'information-circle-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'map' : 'map-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{ 
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
          ),
        }}
      /> */}
    </Tabs>
  );
}
