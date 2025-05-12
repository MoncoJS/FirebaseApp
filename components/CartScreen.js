import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import CustomButton from './CustomButton';
import { db, auth } from '../firebase';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) {
      console.log('No user logged in for cart');
      setCartItems([]);
      return;
    }
    const unsubscribe = db.collection('cart').onSnapshot(
      (snapshot) => {
        const cartData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCartItems(cartData);
      },
      (error) => {
        console.log('Cart snapshot error:', error);
        Alert.alert('Error', `Failed to load cart: ${error.message}`);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleDeleteItem = async (itemId, itemName) => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to delete items from the cart.');
      return;
    }
    try {
      await db.collection('cart').doc(itemId).delete();
      Alert.alert('Success', `${itemName} removed from cart!`);
    } catch (error) {
      Alert.alert('Error', `Failed to delete item: ${error.message}`);
      console.log('Delete item error:', error);
    }
  };

  const handleOrder = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to place an order.');
      return;
    }
    if (cartItems.length === 0) {
      Alert.alert('Error', 'Your cart is empty.');
      return;
    }
    try {
      // Delete all items in the cart as a simple "purchase" action
      const batch = db.batch();
      cartItems.forEach((item) => {
        const itemRef = db.collection('cart').doc(item.id);
        batch.delete(itemRef);
      });
      await batch.commit();
      Alert.alert('Success', 'Order placed successfully! Your cart has been cleared.');
    } catch (error) {
      Alert.alert('Error', `Failed to place order: ${error.message}`);
      console.log('Order error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cartItem}
            onPress={() => handleDeleteItem(item.id, item.name)}
          >
            <Text style={styles.cartText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Cart is empty</Text>}
      />
      <CustomButton title="Place Order" onPress={handleOrder} />
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