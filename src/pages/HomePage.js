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

const paginationWrapStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '2rem',
  gap: '1rem',
  flexWrap: 'wrap'
};

const paginationButtonStyle = {
  border: '1px solid rgba(119, 119, 119, 0.35)',
  background: '#ffffff',
  color: '#1a1c1c',
  padding: '0.5rem 0.85rem',
  cursor: 'pointer',
  fontFamily: '"Manrope", sans-serif',
  fontSize: '0.85rem'
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
          {productStore.paginatedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {!productStore.isLoading && productStore.products.length > 0 && (
          <div style={paginationWrapStyle}>
            <div style={{ fontSize: '0.85rem', color: '#474747' }}>
              Page {productStore.currentPage} of {productStore.totalPages}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => productStore.setPage(productStore.currentPage - 1)}
                disabled={productStore.currentPage === 1}
                style={{
                  ...paginationButtonStyle,
                  opacity: productStore.currentPage === 1 ? 0.5 : 1,
                  cursor: productStore.currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => productStore.setPage(productStore.currentPage + 1)}
                disabled={productStore.currentPage === productStore.totalPages}
                style={{
                  ...paginationButtonStyle,
                  opacity: productStore.currentPage === productStore.totalPages ? 0.5 : 1,
                  cursor: productStore.currentPage === productStore.totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default observer(HomePage);
