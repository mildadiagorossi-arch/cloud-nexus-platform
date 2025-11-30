import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  stock: number;
}

export default function ProductCard({ id, name, price, image, category, rating, stock }: ProductCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <Link to={`/shop/${id}`}>
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Badge variant="secondary" className="mb-2">
          {category}
        </Badge>
        <Link to={`/shop/${id}`}>
          <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating ? 'fill-primary text-primary' : 'text-muted'
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-1">({rating})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-2xl text-primary">{price}€</span>
          <span className="text-sm text-muted-foreground">
            {stock > 0 ? `${stock} en stock` : 'Rupture'}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="accent" className="w-full" disabled={stock === 0}>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  );
}
