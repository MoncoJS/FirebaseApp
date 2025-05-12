import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProductItem = ({ name }) => {
  return (
    <View style={styles.productItem}>
      <Text style={styles.productText}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  productItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ProductItem;