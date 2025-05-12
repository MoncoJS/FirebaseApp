import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import CustomButton from './CustomButton';
import ProductItem from './ProductItem';
import { db, auth } from '../firebase';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) {
      console.log('No user logged in for products');
      setProducts([]);
      return;
    }
    const unsubscribe = db.collection('products').onSnapshot(
      (snapshot) => {
        const productsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);
      },
      (error) => {
        console.log('Products snapshot error:', error);
        Alert.alert('Error', `Failed to load products: ${error.message}`);
      }
    );
    return () => unsubscribe();
  }, []);

  const fetchFromAPI = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'You must be logged in to fetch products.');
      return;
    }
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      // Clear existing products
      const existingProducts = await db.collection('products').get();
      const batch = db.batch();
      existingProducts.forEach((doc) => {
        batch.delete(db.collection('products').doc(doc.id));
      });
      await batch.commit();
      // Add API products to Firestore
      for (const product of data) {
        await db.collection('products').add({
          title: product.title || 'Unknown Product',
          price: product.price || 0,
          description: product.description || '',
          category: product.category || 'Unknown',
          image: product.image || '',
          rating: product.rating || { rate: 0, count: 0 },
        });
      }
      Alert.alert('Success', 'Products fetched and saved!');
    } catch (error) {
      Alert.alert('Error', `Failed to fetch products: ${error.message}`);
      console.log('Fetch error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home - Products</Text>
      <CustomButton title="Fetch Products from API" onPress={fetchFromAPI} />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductItem
            title={item.title}
            price={item.price}
            description={item.description}
            category={item.category}
            image={item.image}
            rating={item.rating}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No products found</Text>}
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
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default HomeScreen;