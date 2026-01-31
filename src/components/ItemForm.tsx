/* ---------------- IMPORTS ---------------- */
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/* ---------------- TYPES ---------------- */

type InventoryItem = {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
  sku: string;
};

type ItemFormProps = {
  item: InventoryItem | null;
  onClose: () => void;
};

/* ---------------- COMPONENT ---------------- */

export default function ItemForm({ item, onClose }: ItemFormProps) {
  const { user } = useAuth(); // still useful later for API
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    category: '',
    sku: '',
  });

  /* ---------------- PREFILL FORM (EDIT MODE) ---------------- */

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        category: item.category,
        sku: item.sku,
      });
    }
  }, [item]);

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter a product name');
      return;
    }

    if (formData.quantity < 0 || formData.price < 0) {
      alert('Quantity and price cannot be negative');
      return;
    }

    setLoading(true);

    try {
      // 🔹 MOCK SAVE (simulates backend request)
      await new Promise((resolve) => setTimeout(resolve, 800));

      console.log(item ? 'Updating item:' : 'Creating item:', {
        ...formData,
        user: user?.email,
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {item ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">SKU</label>
              <input
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Saving...' : item ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
