import React from 'react';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import type {
  RootStackParamList,
} from '../types/navigation.types';

import HomeScreen from
  '../features/home/screens/HomeScreen';

import PredictionScreen from
  '../features/prediction/screens/PredictionScreen';

import PredictionResultScreen from
  '../features/prediction/screens/PredictionResultScreen';

import ModelInfoScreen from
  '../features/model-info/screens/ModelInfoScreen';

import {colors} from '../theme';

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTintColor: colors.textPrimary,
          headerStyle: {
            backgroundColor: colors.surface,
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}>

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Prediction"
          component={PredictionScreen}
          options={{
            title: 'Prediksi Harga',
          }}
        />

        <Stack.Screen
          name="PredictionResult"
          component={PredictionResultScreen}
          options={{
            title: 'Hasil Prediksi',
          }}
        />

        <Stack.Screen
          name="ModelInfo"
          component={ModelInfoScreen}
          options={{
            title: 'Informasi Model AI',
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}