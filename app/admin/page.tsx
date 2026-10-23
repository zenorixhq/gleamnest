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
  Upload,
  MessageSquare,
  Video,
  Star,
  Play,
  Globe,
  Mail,
  User,
  Lock,
  KeyRound,
  LogOut,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

export default function AdminDashboardPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const addProduct = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "inventory" | "config" | "reviews">("inventory");
  const [searchQuery, setSearchQuery] = useState("");

  // Reviews & Video Reels State
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [videosList, setVideosList] = useState<any[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    author: "",
    location: "Kerala, India",
    piece: "",
    rating: 5,
    quote: "",
  });

  const [videoForm, setVideoForm] = useState({
    influencer: "",
    handle: "",
    title: "",
    videoUrl: "",
    poster: "",
    views: "18.4K views",
    productTitle: "",
    productSlug: "",
    productPrice: 150,
  });

  // Modal states for Product Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [formState, setFormState] = useState({
    title: "",
    category: "necklaces-and-chains",
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

  const fetchReviewsAndVideos = () => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) setReviewsList(data.reviews);
        if (data.videoReels) setVideosList(data.videoReels);
      })
      .catch((err) => console.error("Error fetching reviews:", err));
  };

  useEffect(() => {
    // Check if merchant is already authenticated
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("gleamnest_admin_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPassword = loginPassword.trim();

    // Accepted Merchant Credentials:
    // Username: admin@gleamnest.in or admin
    // Password: gleamnest@2026 or GleamNest@2026
    if (
      (cleanEmail === "admin@gleamnest.in" || cleanEmail === "admin") &&
      (cleanPassword === "gleamnest@2026" || cleanPassword === "GleamNest@2026")
    ) {
      localStorage.setItem("gleamnest_admin_auth", "true");
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid merchant credentials. Please verify your username and password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("gleamnest_admin_auth");
    setIsAuthenticated(false);
    setLoginPassword("");
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchReviewsAndVideos();

      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setOrders(data);
        })
        .catch((err) => console.error("Error fetching orders:", err));
    }
  }, [isAuthenticated, fetchProducts]);

  // Calculate high-level KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (o?.grandTotal || 0), 0);
  const totalOrdersCount = orders.length;
  const aov = totalRevenue / (totalOrdersCount || 1);
  const totalStockUnits = products.reduce((sum, p) => sum + p.stockCount, 0);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to persist order status:", err);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.author || !reviewForm.quote) {
      alert("Please enter author name and review quote.");
      return;
    }
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...reviewForm, type: "review" }),
      });
      if (res.ok) {
        setIsReviewModalOpen(false);
        setReviewForm({ author: "", location: "Kerala, India", piece: "", rating: 5, quote: "" });
        fetchReviewsAndVideos();
      }
    } catch (err) {
      alert("Error adding review");
    }
  };

  const handleDeleteReview = async (id: string | number) => {
    if (!confirm("Are you sure you want to remove this client review?")) return;
    try {
      await fetch(`/api/reviews?type=review&id=${id}`, { method: "DELETE" });
      fetchReviewsAndVideos();
    } catch (err) {
      alert("Error deleting review");
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.videoUrl) {
      alert("Please enter video title and URL.");
      return;
    }
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...videoForm, type: "video" }),
      });
      if (res.ok) {
        setIsVideoModalOpen(false);
        setVideoForm({
          influencer: "",
          handle: "",
          title: "",
          videoUrl: "",
          poster: "",
          views: "18.4K views",
          productTitle: "",
          productSlug: "",
          productPrice: 150,
        });
        fetchReviewsAndVideos();
      }
    } catch (err) {
      alert("Error adding video reel");
    }
  };

  const handleDeleteVideo = async (id: string | number) => {
    if (!confirm("Are you sure you want to remove this video reel?")) return;
    try {
      await fetch(`/api/reviews?type=video&id=${id}`, { method: "DELETE" });
      fetchReviewsAndVideos();
    } catch (err) {
      alert("Error deleting video reel");
    }
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
      category: "necklaces-and-chains",
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

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4 sm:p-6 text-[#1C1917] relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1C1917_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="w-full max-w-md bg-card border border-border/80 rounded-3xl p-8 sm:p-10 shadow-xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <span className="font-editorial text-3xl sm:text-4xl tracking-tight text-foreground font-normal">
              {storeConfig.brand.logo.text}
            </span>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#8F7234] font-medium">
              Merchant Management Portal
            </p>
          </div>

          <div className="border-t border-border/60 pt-2 text-center">
            <h2 className="text-base font-bold text-foreground">Sign In to Dashboard</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Enter your boutique administrator credentials to access catalog and order operations.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Admin Username or Email</span>
                <span className="text-[10px] text-muted-foreground font-mono">admin@gleamnest.in</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="admin@gleamnest.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-10 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none transition-all"
                />
                <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Secret Password</span>
                <span className="text-[10px] text-muted-foreground font-mono">gleamnest@2026</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-10 pr-10 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
                />
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

          <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <span>← Return to Store</span>
            </Link>
            <span className="flex items-center gap-1 text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Encrypted</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-primary text-primary-foreground">
                Authorized Merchant Portal
              </span>
              <span className="text-xs text-muted-foreground">Product, Order & Store Operations Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-1">
              {storeConfig.brand.logo.text} Boutique Management
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
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
            <button
              onClick={handleLogout}
              className="px-3.5 py-2.5 rounded-xl border border-destructive/30 bg-card text-destructive hover:bg-destructive/10 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Sign out of Admin Dashboard"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
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
            <span>Store Settings & Regional Setup</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "reviews"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Reviews & Videos ({reviewsList.length + videosList.length})</span>
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
                <p className="text-[11px] text-muted-foreground">Processed via WhatsApp & Online Orders</p>
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Order Fulfillment Queue
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage incoming customer orders, review deliveries, and update processing statuses.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {orders.length} Total Orders
              </span>
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-xs bg-muted/20 rounded-xl border border-border">
                  No orders found in fulfillment queue yet.
                </div>
              ) : (
                orders.map((order) => {
                  const customerName =
                    order.customer?.fullName ||
                    (order.customer as any)?.name ||
                    (order as any).customerName ||
                    "Valued Customer";
                  const customerEmail =
                    order.customer?.email ||
                    (order as any).customerEmail ||
                    "Direct WhatsApp";
                  const customerPhone =
                    order.customer?.phone ||
                    (order as any).customerPhone ||
                    "";
                  const streetAddress =
                    order.customer?.address?.street ||
                    (order.customer as any)?.shippingAddress?.line1 ||
                    (order as any).shippingAddress ||
                    "Direct delivery";
                  const cityAddress =
                    order.customer?.address?.city ||
                    (order.customer as any)?.shippingAddress?.city ||
                    "";

                  return (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition-colors"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-sm font-black text-foreground">
                            {order.orderNumber || order.id}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent"}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-primary/10 text-primary">
                            {order.paymentMethod || "WhatsApp Order"}
                          </span>
                        </div>
                        <p className="text-xs text-foreground font-medium">
                          {customerName} • {customerEmail} {customerPhone ? `• ${customerPhone}` : ""}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {streetAddress}
                          {cityAddress ? `, ${cityAddress}` : ""}
                        </p>
                        {order.items && order.items.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {order.items.map((item: any, i: number) => (
                              <span
                                key={i}
                                className="text-[10px] bg-background border border-border px-2 py-0.5 rounded text-foreground font-medium"
                              >
                                {item.quantity || 1}x {item.title || item.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
                        <div className="text-right sm:text-right">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">Total</span>
                          <p className="text-sm font-black text-foreground">
                            {formatPrice(order.grandTotal || 0)}
                          </p>
                        </div>

                        <select
                          value={order.status || "processing"}
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
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab: Store Settings & Regional Setup */}
        {activeTab === "config" && (
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Storefront & Regional Operations
              </span>
              <h3 className="text-lg font-black text-foreground mt-1">
                Active Storefront Configuration
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Official contact details, multi-currency regional pricing, and shipping policies active across your boutique.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Store Profile & Concierge */}
              <div className="p-5 rounded-xl bg-muted/30 border border-border space-y-3">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>Store Contact & Concierge</span>
                </div>
                <div className="text-xs space-y-1.5 text-muted-foreground">
                  <p>Brand Name: <strong className="text-foreground">{storeConfig.brand.logo.text}</strong></p>
                  <p>Customer Support Email: <strong className="text-foreground">{storeConfig.brand.contact.email}</strong></p>
                  <p>WhatsApp Hotline: <strong className="text-foreground">+{storeConfig.brand.contact.whatsappNumber}</strong></p>
                  <p>Operating Hours: <strong className="text-foreground">{storeConfig.brand.contact.hours}</strong></p>
                  <p>Dispatch Atelier: <strong className="text-foreground">{storeConfig.brand.contact.address}</strong></p>
                </div>
              </div>

              {/* Regional Pricing & Delivery */}
              <div className="p-5 rounded-xl bg-muted/30 border border-border space-y-3">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Dual Regional Pricing & Delivery</span>
                </div>
                <div className="text-xs space-y-1.5 text-muted-foreground">
                  <p>
                    🇮🇳 India (INR ₹):{" "}
                    <strong className="text-foreground">
                      Free Shipping on orders above ₹{storeConfig.commerce.freeShippingThreshold} (Flat ₹{storeConfig.commerce.flatShippingFee} below)
                    </strong>
                  </p>
                  <p>
                    🇶🇦 Qatar (QAR):{" "}
                    <strong className="text-emerald-700 font-bold">
                      100% Complimentary Express Delivery on all orders
                    </strong>
                  </p>
                  <p>Ordering Method: <strong className="text-foreground">Instant WhatsApp Order Direct Checkout</strong></p>
                  <p>Payment Modes: <strong className="text-foreground">Direct UPI (GPay/PhonePe/Paytm), COD & Direct Bank Transfer</strong></p>
                </div>
              </div>

              {/* Official Social Media Channels */}
              <div className="p-5 rounded-xl bg-muted/30 border border-border space-y-3">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <Globe className="w-4 h-4 text-primary" />
                  <span>Official Social Channels</span>
                </div>
                <div className="text-xs space-y-1.5 text-muted-foreground">
                  <p>
                    Instagram:{" "}
                    <a
                      href={storeConfig.brand.socials.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline font-mono text-[11px]"
                    >
                      @gleamnest.in ↗
                    </a>
                  </p>
                  <p>
                    Facebook:{" "}
                    <a
                      href={storeConfig.brand.socials.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline font-mono text-[11px]"
                    >
                      GleamNest Official Page ↗
                    </a>
                  </p>
                  <p>
                    WhatsApp Channel:{" "}
                    <a
                      href={`https://wa.me/${storeConfig.brand.contact.whatsappNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline font-mono text-[11px]"
                    >
                      +{storeConfig.brand.contact.whatsappNumber} ↗
                    </a>
                  </p>
                </div>
              </div>

              {/* Admin Portal Access Credentials */}
              <div className="p-5 rounded-xl bg-muted/30 border border-border space-y-3">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>Admin Access Credentials</span>
                </div>
                <div className="text-xs space-y-1.5 text-muted-foreground">
                  <p>Portal URL: <strong className="text-foreground font-mono">/admin</strong></p>
                  <p>Username / Email: <strong className="text-foreground font-mono">admin@gleamnest.in</strong> (or <span className="font-mono">admin</span>)</p>
                  <p>Default Password: <strong className="text-foreground font-mono">gleamnest@2026</strong></p>
                  <p>Session Security: <strong className="text-emerald-700">Encrypted Local Storage Authentication</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Reviews & Videos */}
        {activeTab === "reviews" && (
          <div className="space-y-8">
            {/* Header banner */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Social Proof & Media Management
                </span>
                <h3 className="text-xl font-black text-foreground mt-1">
                  Customer Reviews & Styling Video Reels
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                  Manage genuine customer reviews, unboxing testimonials, and high-fashion styling video reels displayed directly on your homepage.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:bg-primary/90 shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Client Review</span>
                </button>
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
                >
                  <Video className="w-4 h-4 text-primary" />
                  <span>Add Video Reel</span>
                </button>
              </div>
            </div>

            {/* Client Reviews Section */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>Customer Reviews ({reviewsList.length})</span>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quotes displayed on the homepage customer words carousel.
                  </p>
                </div>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  + Add Review
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-xl border border-border bg-muted/20 flex flex-col justify-between space-y-4 relative group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-foreground italic font-light leading-relaxed">
                        &ldquo;{rev.quote}&rdquo;
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="font-bold text-foreground">{rev.author}</span>
                        <span className="text-muted-foreground"> • {rev.location}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-medium text-[10px]">
                        {rev.piece}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Reels Section */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Video className="w-4 h-4 text-primary" />
                    <span>Styling & Client Video Reels ({videosList.length})</span>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Vertical video tests and unboxings with tagged products.
                  </p>
                </div>
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  + Add Video Reel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {videosList.map((video) => (
                  <div
                    key={video.id}
                    className="rounded-xl border border-border overflow-hidden bg-muted/20 flex flex-col justify-between group shadow-sm"
                  >
                    <div className="relative aspect-[9/14] bg-black overflow-hidden">
                      <img
                        src={video.poster}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-3 text-white">
                        <span className="text-[10px] bg-black/60 px-2 py-0.5 rounded-full font-medium self-start">
                          {video.views}
                        </span>

                        <a
                          href={video.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="self-center w-10 h-10 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </a>

                        <div>
                          <p className="text-xs font-bold line-clamp-1 text-white">{video.title}</p>
                          <p className="text-[10px] text-white/80">{video.handle}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-card border-t border-border flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-foreground block line-clamp-1">
                          {video.productTitle}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          ₹{video.productPrice}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete Video Reel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
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
                  placeholder="e.g. Four-Leaf Clover Pearl Necklace"
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
                    <option value="necklaces-and-chains">Necklaces and Chains</option>
                    <option value="rings">Rings</option>
                    <option value="earrings">Earrings</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="bangles-kada">Bangles Kada</option>
                    <option value="watches">Watches</option>
                    <option value="charms">Charms</option>
                    <option value="hip-chains">Hip Chains</option>
                    <option value="anklets">Anklets</option>
                    <option value="kids-collection">Kids Collection</option>
                    <option value="new-arrivals">New Arrivals</option>
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
                  placeholder="e.g. 304 & 306 Grade Steel • Waterproof • Hypoallergenic"
                  value={formState.shortDescription}
                  onChange={(e) => setFormState({ ...formState, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Full Description & Story</label>
                <textarea
                  rows={3}
                  placeholder="Crafted with premium 304 & 306 grade stainless steel with high-grade PVD plating. 100% waterproof, sweatproof, and hypoallergenic."
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

      {/* Client Review Add Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsReviewModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Add Verified Client Review</h3>
                <p className="text-xs text-muted-foreground">
                  Publish customer feedback on the homepage testimonial reel
                </p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pooja Hegde"
                  value={reviewForm.author}
                  onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">City / Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Kochi, Kerala"
                    value={reviewForm.location}
                    onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Purchased Jewelry Piece</label>
                <input
                  type="text"
                  placeholder="e.g. Statement Ring & Clover Bangle"
                  value={reviewForm.piece}
                  onChange={(e) => setReviewForm({ ...reviewForm, piece: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Customer Quote / Review *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write the customer's exact words..."
                  value={reviewForm.quote}
                  onChange={(e) => setReviewForm({ ...reviewForm, quote: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none resize-none"
                />
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow-md"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Reel Add Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsVideoModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Add Styling Video Reel</h3>
                <p className="text-xs text-muted-foreground">
                  Publish a client unboxing or styling video test to the storefront
                </p>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVideo} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Creator Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ananya Sanil"
                    value={videoForm.influencer}
                    onChange={(e) => setVideoForm({ ...videoForm, influencer: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Social Handle</label>
                  <input
                    type="text"
                    placeholder="e.g. @ananya.styling"
                    value={videoForm.handle}
                    onChange={(e) => setVideoForm({ ...videoForm, handle: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Video Title / Caption *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100% Waterproof Shower Test 💧"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Video URL (MP4 / Web Video) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://...mp4 or CDN video link"
                  value={videoForm.videoUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Poster / Thumbnail Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or public image URL"
                  value={videoForm.poster}
                  onChange={(e) => setVideoForm({ ...videoForm, poster: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-semibold text-foreground">Tagged Product Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Clover Bracelet - Gold"
                    value={videoForm.productTitle}
                    onChange={(e) => setVideoForm({ ...videoForm, productTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="150"
                    value={videoForm.productPrice}
                    onChange={(e) => setVideoForm({ ...videoForm, productPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Product Slug</label>
                  <input
                    type="text"
                    placeholder="clover-bracelet-gold"
                    value={videoForm.productSlug}
                    onChange={(e) => setVideoForm({ ...videoForm, productSlug: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Views Badge</label>
                  <input
                    type="text"
                    placeholder="18.4K views"
                    value={videoForm.views}
                    onChange={(e) => setVideoForm({ ...videoForm, views: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow-md"
                >
                  Save Video Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
