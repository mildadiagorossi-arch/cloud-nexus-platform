import { useState } from 'react';
import { Plus, Edit, Trash2, Package, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useProducts, Product } from '@/contexts/ProductContext';

export default function ProductsManager() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        image: formData.image || '/placeholder.svg',
      });
      toast({ title: 'Produit modifié', description: 'Le produit a été mis à jour dans la boutique.' });
    } else {
      addProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        image: formData.image || '/placeholder.svg',
      });
      toast({ title: 'Produit ajouté', description: 'Le produit est maintenant visible dans la boutique.' });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', stock: '', category: '', image: '' });
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      image: product.image,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteProduct(id);
    toast({ title: 'Produit supprimé', description: 'Le produit a été retiré de la boutique.' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl mb-2">Mes Produits</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Store className="w-4 h-4" />
            Synchronisés avec la boutique publique
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingProduct(null); setFormData({ name: '', description: '', price: '', stock: '', category: '', image: '' }); }}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un produit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Modifier le produit' : 'Nouveau produit'}</DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Modifiez les informations du produit' : 'Ajoutez un nouveau produit à votre catalogue'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix (FCFA)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Réseau">Réseau</SelectItem>
                    <SelectItem value="Stockage">Stockage</SelectItem>
                    <SelectItem value="Sécurité">Sécurité</SelectItem>
                    <SelectItem value="Serveur">Serveur</SelectItem>
                    <SelectItem value="Cloud">Cloud</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>Annuler</Button>
                <Button type="submit">{editingProduct ? 'Enregistrer' : 'Ajouter'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Badge variant="secondary" className="text-sm">
          {products.length} produit{products.length > 1 ? 's' : ''} en ligne
        </Badge>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {product.image && product.image !== '/placeholder.svg' ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-primary font-medium">{product.price.toLocaleString()} FCFA</span>
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                      Stock: {product.stock}
                    </span>
                    <Badge variant="outline">{product.category}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}