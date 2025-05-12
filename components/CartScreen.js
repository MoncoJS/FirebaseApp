import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import CustomButton from './CustomButton';
import { db, auth, firebase } from '../firebase';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        console.log('No user logged in for cart');
        setCartItems([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user || loading) return; // Wait for user authentication and loading to complete

    const unsubscribeSnapshot = db.collection('cart').onSnapshot(
      (snapshot) => {
        const cartData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCartItems(cartData);
      },
      (error) => {
        console.log('Cart snapshot error:', error);
        Alert.alert('Error', `Failed to load cart: ${error.message}`);
      }
    );

    return () => unsubscribeSnapshot();
  }, [user, loading]);

  const handleDeleteItem = async (itemId, itemTitle) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to delete items from the cart.');
      return;
    }
    try {
      await db.collection('cart').doc(itemId).delete();
      Alert.alert('Success', `${itemTitle} removed from cart!`);
    } catch (error) {
      Alert.alert('Error', `Failed to delete item: ${error.message}`);
      console.log('Delete item error:', error);
    }
  };

  const handleOrder = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to place an order.');
      return;
    }
    if (cartItems.length === 0) {
      Alert.alert('Error', 'Your cart is empty.');
      return;
    }
    try {
      await db.collection('orders').add({
        userId: user.uid,
        items: cartItems,
        total: cartItems.reduce((sum, item) => sum + (item.price || 0), 0),
      });
      const batch = db.batch();
      cartItems.forEach((item) => {
        const itemRef = db.collection('cart').doc(item.id);
        batch.delete(itemRef);
      });
      await batch.commit();
      Alert.alert('Success', 'Order placed successfully!');
    } catch (error) {
      Alert.alert('Error', `Failed to place order: ${error.message}`);
      console.log('Order error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cartItem}
            onPress={() => handleDeleteItem(item.id, item.title || 'Unknown Item')}
          >
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.itemImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text>No Image</Text>
              </View>
            )}
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle}>{item.title || 'Unknown Item'}</Text>
              <Text style={styles.itemPrice}>${(item.price || 0).toFixed(2)}</Text>
              <Text style={styles.itemCategory}>{item.category || 'Unknown'}</Text>
              <Text style={styles.itemRating}>
                Rating: {(item.rating?.rate || 0).toFixed(1)} ({item.rating?.count || 0} reviews)
              </Text>
            </View>
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
    justifyContent: 'center',
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
  itemImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  itemRating: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default CartScreen;