import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import CustomButton from './CustomButton';
import { db } from '../firebase';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [itemName, setItemName] = useState('');

  useEffect(() => {
    const unsubscribe = db.collection('cart').onSnapshot((snapshot) => {
      const cartData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCartItems(cartData);
    });
    return () => unsubscribe();
  }, []);

  const addToCart = async () => {
    if (!itemName) {
      Alert.alert('Error', 'Item name is required');
      return;
    }
    try {
      await db.collection('cart').add({ name: itemName });
      setItemName('');
      Alert.alert('Success', 'Item added to cart!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      <CustomButton title="Add Item to Cart (Placeholder)" onPress={addToCart} />
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.cartText}>{item.name}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Cart is empty</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  cartItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cartText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default CartScreen;