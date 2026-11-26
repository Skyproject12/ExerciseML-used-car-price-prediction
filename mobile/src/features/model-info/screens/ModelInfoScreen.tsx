import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function ModelInfoScreen() {
  return (
    <View style={styles.container}>
      <Text>Model Information Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});