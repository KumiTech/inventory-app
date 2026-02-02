import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { InventoryItem } from "../types";
import {
  LogOut,
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Menu,
  X,
  User,
} from "lucide-react";
import ItemForm from "./ItemForm";
import api from "../lib/axios";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Load items from API
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const res = await api.get("api/products/");
        setItems(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products from server");
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  // Save (create/update) item
  const handleSave = async (
    itemData: Omit<
      InventoryItem,
      "_id" | "created_at" | "updated_at" | "createdBy"
    >,
  ) => {
    try {
      if (editingItem) {
        // Update
        const res = await api.put(`api/products/${editingItem._id}`, itemData);
        setItems((prev) =>
          prev.map((item) =>
            item._id === editingItem._id ? res.data.data : item,
          ),
        );
      } else {
        // Create
        const res = await api.post("api/products/", itemData);
        setItems((prev) => [res.data.data, ...prev]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save item");
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`api/products/${id}`);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  // Filtered items for search
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalValue = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 transition-all">
      {/* NAVBAR */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-md hover:bg-blue-500 transition"
              >
                {menuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <Package className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold">Inventory Manager</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* HAMBURGER MENU PANEL */}
      <div
        className={`fixed inset-0 z-40 transition-all ${
          menuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        ></div>

        {/* Side Panel */}
        <div
          className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } flex flex-col justify-between p-6`}
        >
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-6 h-6 text-blue-500" />
              <h2 className="text-lg font-semibold">Profile</h2>
            </div>
            <p className="text-gray-700 mb-1 truncate">{user?.username}</p>
            <p className="text-gray-700 mb-6 truncate">{user?.email}</p>
          </div>

          <button
            onClick={() => signOut()}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Items</p>
                <p className="text-3xl font-extrabold text-gray-900">
                  {items.length}
                </p>
              </div>
              <div className="bg-gradient-to-tr from-blue-400 to-blue-600 p-3 rounded-full text-white">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Stock</p>
                <p className="text-3xl font-extrabold text-gray-900">
                  {totalItems}
                </p>
              </div>
              <div className="bg-gradient-to-tr from-green-400 to-green-600 p-3 rounded-full text-white">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Value</p>
                <p className="text-3xl font-extrabold text-gray-900">
                  ${totalValue.toFixed(2)}
                </p>
              </div>
              <div className="bg-gradient-to-tr from-indigo-400 to-indigo-600 p-3 rounded-full text-white">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH + ADD BUTTON */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center space-x-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:scale-105 transition-transform shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Add Item</span>
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* INVENTORY TABLE */}
        <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm
                  ? "No items found matching your search"
                  : "No inventory items yet"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Add your first item
                </button>
              )}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.name}
                      </div>
                      {item.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.sku || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {item.category && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${
                          item.quantity < 10
                            ? "text-red-600"
                            : item.quantity < 50
                              ? "text-yellow-600"
                              : "text-green-600"
                        }`}
                      >
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition"
                        title="Edit item"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* ITEM FORM MODAL */}
      {showForm && (
        <ItemForm
          item={editingItem}
          onClose={handleFormClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
