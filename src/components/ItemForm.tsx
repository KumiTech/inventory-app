import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { InventoryItem } from "../types";

type ItemFormProps = {
  item: InventoryItem | null;
  onClose: () => void;
  onSave: (
    item: Omit<
      InventoryItem,
      "_id" | "created_at" | "updated_at" | "createdBy"
    >,
  ) => Promise<void>;
};

export default function ItemForm({ item, onClose, onSave }: ItemFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
    category: "",
    sku: "",
  });

  // Prefill form if editing
  useEffect(() => {
    if (item)
      setFormData({
        name: item.name,
        description: item.description,
        quantity: String(item.quantity),
        price: String(item.price),
        category: item.category,
        sku: item.sku,
      });
  }, [item]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? value : value,
    }));
    setErrorMessage(""); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim())
      return setErrorMessage("Product name is required");
    const qty = Number(formData.quantity);
    const pr = Number(formData.price);
    if (!formData.quantity || !formData.price)
      return setErrorMessage("Quantity and price are required");
    if (qty < 0 || pr < 0)
      return setErrorMessage("Quantity and price cannot be negative");

    setLoading(true);
    setErrorMessage("");
    try {
      const submitData = {
        ...formData,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
      };
      await onSave(submitData);
      setSuccess(true);

      // Auto-close after short delay
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || "Failed to save item";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {item ? "Edit Item" : "Add New Item"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded"
            title="Close form"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success Toast */}
        {success && (
          <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow">
            {item ? "Item updated successfully!" : "Item added successfully!"}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-600 text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Product Name *
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product name"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Enter product description"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Enter SKU"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                name="category"
                value={formData.category}
                placeholder="Enter category"
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                placeholder="Enter quantity"
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={0}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                placeholder="Enter price"
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={0}
                step={0.01}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition"
            >
              {loading ? (
                <span className="animate-pulse">Saving...</span>
              ) : item ? (
                "Update Item"
              ) : (
                "Add Item"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
