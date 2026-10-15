"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { storeConfig } from "@/config/store.config";
import { sampleOrders } from "@/data/mockData";
import { useProductStore } from "@/store/useProductStore";
import { formatPrice } from "@/lib/utils";
import { Order, OrderStatus, Product } from "@/types/store";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  ExternalLink,
  Palette,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Image as ImageIcon,
  Database,
  Upload,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const addProduct = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "inventory" | "config">("inventory");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states for Product Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [formState, setFormState] = useState({
    title: "",
    category: "necklaces",
    price: "",
    salePrice: "",
    priceQatar: "",
    salePriceQatar: "",
    stockCount: "10",
    shortDescription: "",
    description: "",
    imageUrl: "",
    featured: false,
    isBestSeller: false,
    isNewArrival: true,
  });

  useEffect(() => {
    fetchProducts();

    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setOrders(data);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, [fetchProducts]);

  // Calculate high-level KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalOrdersCount = orders.length;
  const aov = totalRevenue / (totalOrdersCount || 1);
  const totalStockUnits = products.reduce((sum, p) => sum + p.stockCount, 0);

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleStockAdjust = async (productId: string, delta: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const newStock = Math.max(0, prod.stockCount + delta);
    await updateProduct(productId, {
      stockCount: newStock,
    });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormState({
      title: "",
      category: "necklaces",
      price: "",
      salePrice: "",
      priceQatar: "",
      salePriceQatar: "",
      stockCount: "10",
      shortDescription: "",
      description: "",
      imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
      featured: false,
      isBestSeller: false,
      isNewArrival: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    const suggestedQar = product.priceQatar !== undefined && product.priceQatar !== null
      ? product.priceQatar.toString()
      : Math.max(10, Math.round(product.price / 20)).toString();

    setFormState({
      title: product.title,
      category: product.category,
      price: product.price.toString(),
      salePrice: product.salePrice ? product.salePrice.toString() : "",
      priceQatar: suggestedQar,
      salePriceQatar: product.salePriceQatar ? product.salePriceQatar.toString() : "",
      stockCount: product.stockCount.toString(),
      shortDescription: product.shortDescription,
      description: product.description,
      imageUrl: product.images[0] || "",
      featured: !!product.featured,
      isBestSeller: !!product.isBestSeller,
      isNewArrival: !!product.isNewArrival,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product from your catalog?")) {
      await deleteProduct(productId);
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image is larger than 5MB. Please choose an optimized image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setFormState((prev) => ({ ...prev, imageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.title.trim() || !formState.price) {
      alert("Please fill in the product title and price.");
      return;
    }

    setIsSaving(true);
    try {
      const parsedPriceInr = parseFloat(formState.price);
      const parsedSalePriceInr = formState.salePrice ? parseFloat(formState.salePrice) : null;
      const parsedPriceQar = formState.priceQatar
        ? parseFloat(formState.priceQatar)
        : Math.max(10, Math.round(parsedPriceInr / 20));
      const parsedSalePriceQar = formState.salePriceQatar ? parseFloat(formState.salePriceQatar) : null;

      if (editingProduct) {
        // Update existing product in DB and Store
        await updateProduct(editingProduct.id, {
          title: formState.title,
          category: formState.category,
          price: parsedPriceInr,
          salePrice: parsedSalePriceInr,
          priceQatar: parsedPriceQar,
          salePriceQatar: parsedSalePriceQar,
          stockCount: parseInt(formState.stockCount) || 0,
          shortDescription: formState.shortDescription || formState.title,
          description: formState.description || formState.title,
          imageUrl: formState.imageUrl,
          images: [formState.imageUrl],
          featured: formState.featured,
          isBestSeller: formState.isBestSeller,
          isNewArrival: formState.isNewArrival,
        });
      } else {
        // Create new product in DB and Store
        await addProduct({
          title: formState.title,
          category: formState.category,
          price: parsedPriceInr,
          salePrice: parsedSalePriceInr,
          priceQatar: parsedPriceQar,
          salePriceQatar: parsedSalePriceQar,
          stockCount: parseInt(formState.stockCount) || 10,
          shortDescription: formState.shortDescription || formState.title,
          description: formState.description || formState.title,
          imageUrl: formState.imageUrl,
          images: [formState.imageUrl],
          tags: [formState.category, "New"],
          featured: formState.featured,
          isBestSeller: formState.isBestSeller,
          isNewArrival: formState.isNewArrival,
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Failed to save product: " + (err.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  const filteredInventory = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-muted/30 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-primary text-primary-foreground">
                Built-in Next.js CMS
              </span>
              <span className="text-xs text-muted-foreground">Product & Store Management Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-1">
              {storeConfig.brand.logo.text} Merchant Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:bg-primary/90 shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex gap-2 border-b border-border overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "inventory"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalog & Editing ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "overview"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Store Performance KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "orders"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Fulfillment ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("config")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "config"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Branding & Razorpay Config</span>
          </button>
        </div>

        {/* Tab: Product Catalog Management & Editing */}
        {activeTab === "inventory" && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Product Catalog ({filteredInventory.length})
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Add, edit prices, update stock levels, or remove pieces from your live catalog.
                </p>
              </div>

              {/* Search filter in catalog */}
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-muted/40 border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-3 font-semibold">Product</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Price</th>
                    <th className="pb-3 font-semibold">Stock</th>
                    <th className="pb-3 font-semibold">Tags</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredInventory.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/30">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt=""
                            className="w-10 h-12 object-cover rounded-md border border-border"
                          />
                          <div>
                            <span className="font-bold text-foreground block">{product.title}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">/{product.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 capitalize text-muted-foreground">{product.category}</td>
                      <td className="py-3 font-semibold text-foreground">
                        <div className="flex flex-col text-xs leading-tight">
                          <span className="text-foreground">
                            🇮🇳 {formatPrice(product.salePrice || product.price, "INR")}
                            {product.salePrice && (
                              <span className="text-[10px] text-muted-foreground line-through ml-1">
                                {formatPrice(product.price, "INR")}
                              </span>
                            )}
                          </span>
                          <span className="text-emerald-700 font-medium text-[11px] mt-0.5">
                            🇶🇦 {formatPrice(product.salePriceQatar || product.priceQatar || Math.max(10, Math.round((product.salePrice || product.price) / 20)), "QAR")}
                            {product.salePriceQatar && (
                              <span className="text-[10px] text-muted-foreground line-through ml-1">
                                {formatPrice(product.priceQatar || Math.max(10, Math.round(product.price / 20)), "QAR")}
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                            product.stockCount < 10
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {product.stockCount} units
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1 flex-wrap">
                          {product.featured && (
                            <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded">
                              Featured
                            </span>
                          )}
                          {product.isBestSeller && (
                            <span className="text-[10px] bg-accent/20 text-accent font-bold px-1.5 py-0.5 rounded">
                              Best Seller
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 rounded-md hover:bg-muted text-foreground flex items-center gap-1 font-semibold text-xs border border-border hover:border-primary transition-colors"
                            title="Edit Product Details"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-border transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Overview KPIs */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-foreground">
                  {formatPrice(totalRevenue)}
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold">
                  +18.4% from previous month
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-foreground">{totalOrdersCount}</p>
                <p className="text-[11px] text-muted-foreground">Processed with Razorpay & COD</p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value (AOV)</span>
                  <TrendingUp className="w-4 h-4 text-accent" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-foreground">{formatPrice(aov)}</p>
                <p className="text-[11px] text-muted-foreground">Elevated by free shipping threshold</p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-wider">Total In Stock</span>
                  <Package className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-foreground">{totalStockUnits}</p>
                <p className="text-[11px] text-muted-foreground">Across {products.length} catalog items</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Order Fulfillment */}
        {activeTab === "orders" && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Order Fulfillment Queue
            </h3>

            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-foreground">{order.orderNumber}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-primary/10 text-primary">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <p className="text-xs text-foreground font-medium">
                      {order.customer.fullName} • {order.customer.email}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {order.customer.address.street}, {order.customer.address.city}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="text-right sm:text-right">
                      <span className="text-xs text-muted-foreground">Total</span>
                      <p className="text-sm font-bold text-foreground">
                        {formatPrice(order.grandTotal)}
                      </p>
                    </div>

                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                      }
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-card border border-border focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Branding & Razorpay Config */}
        {activeTab === "config" && (
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Storefront & Payment Gateway Setup
              </span>
              <h3 className="text-lg font-black text-foreground mt-1">
                Active Client Configuration
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                All client configurations live inside <code className="text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded">config/store.config.ts</code> and <code className="text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded">.env</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
                <span className="text-xs font-bold text-foreground">Razorpay Integration Details</span>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <p>Key ID: <strong className="text-foreground font-mono">rzp_test_... (Set in .env)</strong></p>
                  <p>Payment Modes: <strong className="text-foreground">UPI (GPay/PhonePe), NetBanking, Cards</strong></p>
                  <p>Webhook Verification: <strong className="text-foreground">HMAC-SHA256 Ready</strong></p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
                <span className="text-xs font-bold text-foreground">Database Storage</span>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <p>Engine: <strong className="text-foreground">Prisma + SQLite (dev.db)</strong></p>
                  <p>Production: <strong className="text-foreground">PostgreSQL Ready via DATABASE_URL</strong></p>
                  <p>GUI Studio: <strong className="text-foreground font-mono">npx prisma studio</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {editingProduct ? "Edit Product Details" : "Add New Product to Catalog"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {editingProduct ? `Updating SKU: ${editingProduct.id}` : "Publish a new piece to your storefront"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Product Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 18K Gold Four-Leaf Clover Pearl Necklace"
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              {/* Category & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Category *</label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="necklaces">Necklaces</option>
                    <option value="earrings">Earrings</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="rings">Rings</option>
                    <option value="anklets">Anklets</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Inventory Units in Stock *</label>
                  <input
                    type="number"
                    required
                    value={formState.stockCount}
                    onChange={(e) => setFormState({ ...formState, stockCount: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              {/* Dual Country Pricing (India & Qatar) */}
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Product Pricing by Region</h4>
                    <p className="text-[10px] text-muted-foreground">Set separate retail and sale prices for India and Qatar</p>
                  </div>
                </div>

                {/* India (₹ INR) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <span>🇮🇳</span>
                    <span>India (₹ INR)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">Price (₹) *</label>
                      <input
                        type="number"
                        step="1"
                        required
                        placeholder="899"
                        value={formState.price}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormState((prev) => ({
                            ...prev,
                            price: val,
                            // Auto-suggest Qatar price if empty
                            priceQatar: prev.priceQatar ? prev.priceQatar : val ? Math.max(10, Math.round(parseFloat(val) / 20)).toString() : "",
                          }));
                        }}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">Sale Price (₹ Optional)</label>
                      <input
                        type="number"
                        step="1"
                        placeholder="699"
                        value={formState.salePrice}
                        onChange={(e) => setFormState({ ...formState, salePrice: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Qatar (QAR) */}
                <div className="space-y-2 pt-3 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <span>🇶🇦</span>
                      <span>Qatar (QAR)</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Free Delivery in Qatar Included
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">Price (QAR) *</label>
                      <input
                        type="number"
                        step="1"
                        required
                        placeholder="45"
                        value={formState.priceQatar}
                        onChange={(e) => setFormState({ ...formState, priceQatar: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-semibold text-emerald-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">Sale Price (QAR Optional)</label>
                      <input
                        type="number"
                        step="1"
                        placeholder="35"
                        value={formState.salePriceQatar}
                        onChange={(e) => setFormState({ ...formState, salePriceQatar: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Image (Upload from Device or Web URL) */}
              <div className="space-y-2 border border-border p-3.5 rounded-xl bg-muted/20">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-primary" />
                    <span>Product Image *</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground">Device upload or URL</span>
                </div>

                {/* File picker */}
                <div>
                  <label
                    htmlFor="admin-file-upload"
                    className="w-full px-3 py-2.5 rounded-lg border border-dashed border-border hover:border-primary bg-background hover:bg-muted/40 cursor-pointer flex items-center justify-center gap-2 text-xs font-medium text-foreground transition-colors"
                  >
                    <Upload className="w-4 h-4 text-primary" />
                    <span>Choose Photo from Device / Phone</span>
                  </label>
                  <input
                    id="admin-file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground">Or paste public Image URL:</label>
                  <input
                    type="url"
                    placeholder="https://... or bucket link"
                    value={formState.imageUrl.startsWith("data:") ? "" : formState.imageUrl}
                    onChange={(e) => setFormState({ ...formState, imageUrl: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-mono"
                  />
                </div>

                {/* Preview Thumbnail */}
                {formState.imageUrl && (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-16 h-20 rounded-md overflow-hidden border border-border bg-card">
                      <img src={formState.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="font-medium text-foreground">
                        {formState.imageUrl.startsWith("data:") ? "Photo Selected ✓" : "Web URL Linked ✓"}
                      </p>
                      <button
                        type="button"
                        onClick={() => setFormState({ ...formState, imageUrl: "" })}
                        className="text-[11px] text-red-600 hover:underline"
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Descriptions */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Short Summary</label>
                <input
                  type="text"
                  placeholder="e.g. 18K Gold Plated • Waterproof • Hypoallergenic"
                  value={formState.shortDescription}
                  onChange={(e) => setFormState({ ...formState, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Full Description & Story</label>
                <textarea
                  rows={3}
                  placeholder="Crafted with 316L medical-grade stainless steel with 18K gold PVD plating. 100% waterproof, sweatproof, and hypoallergenic."
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-4 pt-2 border-t border-border">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.featured}
                    onChange={(e) => setFormState({ ...formState, featured: e.target.checked })}
                    className="accent-primary rounded"
                  />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isBestSeller}
                    onChange={(e) => setFormState({ ...formState, isBestSeller: e.target.checked })}
                    className="accent-primary rounded"
                  />
                  <span>Mark Best Seller</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow-md disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : editingProduct ? "Save Changes" : "Publish Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
