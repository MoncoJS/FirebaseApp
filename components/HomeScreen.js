import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import ProductItem from './ProductItem';
import { db } from '../firebase';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');

  useEffect(() => {
    const unsubscribe = db.collection('products').onSnapshot((snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    });
    return () => unsubscribe();
  }, []);

  const fetchFromAPI = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      // Clear existing products (optional)
      const existingProducts = await db.collection('products').get();
      for (const doc of existingProducts.docs) {
        await db.collection('products').doc(doc.id).delete();
      }
      // Add API products to Firestore
      for (const product of data) {
        await db.collection('products').add({
          name: product.title || 'Unknown Product',
        });
      }
      Alert.alert('Success', 'Products fetched from API and saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch products: ' + error.message);
    }
  };

  const addProduct = async () => {
    if (!productName) {
      Alert.alert('Error', 'Product name is required');
      return;
    }
    try {
      await db.collection('products').add({ name: productName });
      setProductName('');
      Alert.alert('Success', 'Product added!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home - Products</Text>
      <CustomInput
        value={productName}
        onChangeText={setProductName}
        placeholder="Enter Product Name"
      />
      <CustomButton title="Add Product" onPress={addProduct} />
      <CustomButton title="Fetch Products from API" onPress={fetchFromAPI} />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductItem name={item.name} />}
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