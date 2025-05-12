import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { db, auth } from '../firebase';

const ProductItem = ({ title, price, description, category, image, rating }) => {
  const handleAddToCart = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to add items to the cart.');
      return;
    }
    try {
      await db.collection('cart').add({
        title: title || 'Unknown Product',
        price: price || 0,
        description: description || '',
        category: category || 'Unknown',
        image: image || '',
        rating: rating || { rate: 0, count: 0 },
      });
      Alert.alert('Success', `${title} added to cart!`);
    } catch (error) {
      Alert.alert('Error', `Failed to add to cart: ${error.message}`);
      console.log('Add to cart error:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.productItem} onPress={handleAddToCart}>
      {image ? (
        <Image source={{ uri: image }} style={styles.productImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text>No Image</Text>
        </View>
      )}
      <View style={styles.productDetails}>
        <Text style={styles.productTitle}>{title || 'Unknown Product'}</Text>
        <Text style={styles.productPrice}>${(price || 0).toFixed(2)}</Text>
        <Text style={styles.productCategory}>{category || 'Unknown'}</Text>
        <Text style={styles.productRating}>
          Rating: {(rating?.rate || 0).toFixed(1)} ({rating?.count || 0} reviews)
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productItem: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  productRating: {
    fontSize: 12,
    color: '#666',
  },
});

export default ProductItem;