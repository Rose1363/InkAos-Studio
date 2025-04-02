import React from "react";


const ProductWiseCategory = ({ products, onProductSelect }) => {
  

  const handleProductClick = (product) => {
    onProductSelect(product);
  };

  return (
    <div className="m-3 w-full">
      <div className="flex gap-10 items-center">
        <div className="flex gap-2">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="w-16 h-16 border border-gray-300 rounded overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => handleProductClick(product)}
              >
                <img
                  src={product.image?.[0] || "/images/product-placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/images/product-placeholder.png";
                  }}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">Không có sản phẩm nào.</p>
          )}
        </div>

       
      </div>
      
    </div>
  );
};



export default ProductWiseCategory;