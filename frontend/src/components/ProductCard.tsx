import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  sizes: Array<{
    sizeLabel: string;
    measurements: { chest?: number; waist?: number; hips?: number; inseam?: number };
  }>;
  colors: string[];
  stock: number;
  rating: number;
  sellerId: {
    _id: string;
    storeName: string;
    verifiedStatus?: boolean;
  } | string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (p: Product) => void;
  onSelect?: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onSelect }) => {
  const storeName = typeof product.sellerId === 'object' ? product.sellerId?.storeName : 'Verified Seller';
  const isVerified = typeof product.sellerId === 'object' ? product.sellerId?.verifiedStatus : true;

  return (
    <div className="group bg-white border border-[#C4A484]/20 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Product Image */}
      <div 
        onClick={() => onSelect && onSelect(product)} 
        className="relative overflow-hidden aspect-[4/5] bg-[#F5F1EB] cursor-pointer"
      >
        <img 
          src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=60'} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {isVerified && (
          <span className="absolute top-3 left-3 bg-[#8B5E3C] text-white text-[10px] font-bold tracking-widest uppercase py-1 px-2.5 rounded-full shadow-sm">
            VERIFIED
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-[#8B5E3C] tracking-wide uppercase mb-1">{storeName}</span>
        
        <h3 
          onClick={() => onSelect && onSelect(product)}
          className="font-poppins text-base font-semibold text-[#2E1F16] hover:text-[#8B5E3C] cursor-pointer transition-colors duration-200 line-clamp-1 mb-1"
        >
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-[#2E1F16]">{product.rating.toFixed(1)}</span>
        </div>

        {/* Sizes and Colors preview */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.sizes.map((s, idx) => (
            <span key={idx} className="text-[10px] font-medium border border-[#C4A484]/30 text-[#4A2C2A] px-1.5 py-0.5 rounded">
              {s.sizeLabel}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-[#F5F1EB] flex items-center justify-between">
          <span className="font-poppins font-bold text-lg text-[#2E1F16]">${product.price.toLocaleString()}</span>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart && onAddToCart(product);
            }}
            className="p-2.5 bg-[#2E1F16] hover:bg-[#8B5E3C] text-white rounded-full transition-all duration-300 hover:scale-110 shadow-sm"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
