import { ProductInterface } from '@/src/@types';
import { Card, CardContent, CardFooter } from '@/src/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

const ProductCard = ({ product }: { product: ProductInterface }) => {
  return (
    <Link href={`/search/${product.slug}`}>
      <Card className="group overflow-hidden border rounded-lg transition-all hover:border-blue-500">
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <div className="relative w-28 h-28">
            <Image
              src={product.image.url}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
          </div>
        </CardContent>

        <CardFooter className="p-4 flex flex-col items-center">
          <h3 className="font-semibold text-sm text-center">{product.name}</h3>
          <p className="font-bold text-sm">
            &#8377;{product.price?.toFixed(2)}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
