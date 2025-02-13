import ImageComponent from '@/src/components/image-component';
import { Card, CardContent } from '@/src/components/ui/card';
import { ProductInterface } from '../clients/home/home.interface';

const ProductCard = ({ product }: { product: ProductInterface }) => {
  return (
    <Card
      key={product.id}
      className="h-40 relative overflow-hidden hover:border-blue-500 cursor-pointer group"
    >
      <CardContent className="p-4 flex items-center justify-center h-full relative">
        <ImageComponent src={product.image} alt={product.name} fill priority />
        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <span className="text-sm">{product.name}</span>
          <span className="bg-blue-600 text-white px-3 py-0.5 rounded-md text-xs">
            {product.price}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
