import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from '../store/StoreContext';
import ProductCard from '../components/ProductCard';
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '4rem',
  marginTop: '3rem'
};

class HomePage extends Component {
  static contextType = StoreContext;

  componentDidMount() {
    const productStore = this.context.productStore;
    if (productStore.categories.length === 0) {
      productStore.fetchCategories();
    }
    productStore.fetchProducts();
  }

  render() {
    const { productStore, uiStore } = this.context;
    const isMobile = uiStore.isMobile;

    const dynamicGridStyle = {
      ...gridStyle,
      gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(200px, 1fr))' : 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: isMobile ? '1rem' : '4rem',
      marginTop: isMobile ? '1rem' : '3rem'
    };
    
    return (
      <div>
        {productStore.isLoading && <div style={{ fontSize: '18px', padding: '2rem 0' }}>Curating collection...</div>}
        {productStore.error && <div style={{ color: '#ba1a1a', padding: '2rem 0' }}>Error: {productStore.error}</div>}

        {!productStore.isLoading && productStore.products.length === 0 && (
          <div style={{ padding: '2rem 0' }}>No products found.</div>
        )}

        {/* Display a grid of products */}
        <div style={dynamicGridStyle}>
          {productStore.products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  }
}

export default observer(HomePage);
