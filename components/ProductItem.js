import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db, auth } from '../firebase';

const ProductItem = ({ name }) => {
  const handleAddToCart = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to add items to the cart.');
      return;
    }
    try {
      await db.collection('cart').add({ name });
      Alert.alert('Success', `${name} added to cart!`);
    } catch (error) {
      Alert.alert('Error', `Failed to add to cart: ${error.message}`);
      console.log('Add to cart error:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.productItem} onPress={handleAddToCart}>
      <Text style={styles.productText}>{name}</Text>
    </TouchableOpacity>
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