import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  MapPin,
  Phone,
  User,
  Clock,
  Compass,
  Trash2,
  Plus,
  Minus,
  Send,
  Search,
  CheckCircle2,
  ListFilter,
  Inbox,
  Eye,
  Mail,
  X,
  Map,
  BadgeAlert,
  Lock,
  LogOut
} from 'lucide-react';
import { menuCategories, menuItems, getImageForDish } from './data';
import { CartItem, CustomerInfo, Order, MenuItem } from './types';

export default function App() {
  // State managers
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');

  // Checkout Form State
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<string>('');

  // Server orders state for monitoring/admin
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'admin'>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [selectedOrderForLog, setSelectedOrderForLog] = useState<Order | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);

  // Load orders on startup and set periodic refresh
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  // Helper code to show custom toast
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setIsToastOpen(true);
    setTimeout(() => setIsToastOpen(false), 5000);
  };

  // Cart operations
  const addToCart = (item: MenuItem) => {
    const existing = cart.find((i) => i.item.id === item.id);
    if (existing) {
      setCart(
        cart.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
    showToast(`تمت إضافة "${item.name}" إلى سلة طلبك!`, 'success');
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(
      cart
        .map((i) => {
          if (i.item.id === itemId) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter((i): i is CartItem => i !== null)
    );
  };

  const removeFromCart = (itemId: string) => {
    const target = cart.find((i) => i.item.id === itemId);
    setCart(cart.filter((i) => i.item.id !== itemId));
    if (target) {
      showToast(`تمت إزالة "${target.item.name}" من طلبك`, 'info');
    }
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => {
      const p = item.item.price || 0;
      return sum + p * item.quantity;
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Geolocation lookup
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showToast('مستعرض الويب الخاص بك لا يدعم تحديد الموقع الجغرافي GPS', 'error');
      return;
    }

    setIsGpsLoading(true);
    setGpsStatus('جاري الاتصال بالأقمار الصناعية...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        setLatitude(lat);
        setLongitude(lon);
        setGpsAccuracy(accuracy);
        setGpsStatus('تم تحديد الإحداثيات بنجاح!');

        showToast('تم الحصول على إحداثيات GPS بدقة عالية. جاري جلب تفاصيل العنوان...', 'info');

        // Reverse Geocode using free OpenStreetMap Nominatim API
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'ar',
                'User-Agent': 'WasatElbasataRestaurantOrderingFlowApp'
              }
            }
          );
          if (response.ok) {
            const geodata = await response.json();
            const formattedAddress = geodata.display_name || `${geodata.address?.road || ''} ${geodata.address?.suburb || ''}, ${geodata.address?.city || geodata.address?.town || ''}`;
            if (formattedAddress.trim()) {
              setCustomerAddress(formattedAddress);
              showToast('تم تحديث عنوان التوصيل تلقائياً وفقاً لموقعك الفعلي!', 'success');
            }
          }
        } catch (err) {
          console.error('Error reverse geocoding:', err);
          // Fallback to coordinates in text
          setCustomerAddress((prev) => 
            prev ? prev : `إحداثيات GPS: (${lat.toFixed(6)}, ${lon.toFixed(6)})`
          );
        } finally {
          setIsGpsLoading(false);
        }
      },
      (error) => {
        console.error('GPS error:', error);
        setIsGpsLoading(false);
        let errorMsg = 'فشل الحصول على موقعك الجغرافي.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'يرجى تفعيل صلاحية الوصول إلى الموقع الجغرافي في متصفحك.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'موقعك الجغرافي الحالي غير متاح.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'انتهت مهلة جلب الموقع الجغرافي.';
        }
        setGpsStatus('بالرجاء كتابة العنوان يدوياً');
        showToast(errorMsg, 'error');
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  // Submit order online
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('سلة المشتريات فارغة! يرجى إضافة عناصر أولاً.', 'error');
      return;
    }
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      showToast('يرجى ملء الاسم الكامل والهاتف وعنوان التوصيل لتأكيد الطلب.', 'error');
      return;
    }

    setIsSubmittingOrder(true);
    showToast('جاري إرسال وتأكيد الطلب عبر الخادم الداخلي...', 'info');

    const customerInfo: CustomerInfo = {
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
      coordinates: {
        latitude,
        longitude,
        accuracy: gpsAccuracy
      },
      notes: orderNotes
    };

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer: customerInfo,
          items: cart,
          totalPrice: getCartTotal()
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast(result.message, 'success');
        // Clear cart
        setCart([]);
        setIsCartOpen(false);
        // Clear checkout form
        setCustomerName('');
        setCustomerPhone('');
        setCustomerAddress('');
        setOrderNotes('');
        setLatitude(null);
        setLongitude(null);
        setGpsAccuracy(null);
        setGpsStatus('');

        // Fetch refreshed orders listing
        fetchOrders();
      } else {
        showToast(result.error || 'حدث خطأ غير متوقع في المعالجة.', 'error');
      }
    } catch (err) {
      console.error('Order submission failed:', err);
      showToast('تعذر الاتصال بالخادم. يرجى التحقق من اتصال الشبكة وإعادة المحاولة.', 'error');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Handle Admin Login submission
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === 'admin' && adminPassword === '123') {
      setIsAdminLoggedIn(true);
      setLoginError('');
      setCurrentView('admin');
      showToast('تم تسجيل الدخول بنجاح للوحة المراقبة!', 'success');
    } else {
      setLoginError('اسم المستخدم أو كلمة المرور غير صحيحة! يرجى المحاولة مرة أخرى.');
      showToast('فشل تسجيل الدخول للوحة الإدارة', 'error');
    }
  };

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.includes(searchQuery) ||
      (item.description && item.description.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#1a1410] text-[#f5ede6] min-h-screen font-sans antialiased pb-20 selection:bg-[#b8863a] selection:text-white" dir="rtl">
      
      {currentView === 'home' && (
        <>
          {/* Dynamic Header */}
          <nav id="mainNav" className="fixed top-0 left-0 right-0 z-100 bg-[#0f0b08] border-b-2 border-[#b8863a] shadow-[0_6px_24px_rgba(0,0,0,0.6)] h-16 flex items-center">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-black text-[#d4a24e] tracking-tight">وسط البساطة</span>
            <span className="hidden md:inline-block text-xs bg-[#b8863a]/20 border border-[#b8863a]/30 text-[#d4a24e] px-2 py-0.5 rounded-full font-bold">لفواكة اللحمة Match</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#section-menu" className="text-[#b8a392] hover:text-[#d4a24e] text-sm md:text-md font-bold transition">القائمة</a>
            <a href="#section-about" className="text-[#b8a392] hover:text-[#d4a24e] text-sm md:text-md font-bold transition">عن المطعم</a>
            <a href="#section-contact" className="text-[#b8a392] hover:text-[#d4a24e] text-sm md:text-md font-bold transition">اتصل بنا</a>
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('admin')}
                  className="text-white hover:text-[#d4a24e] text-[11px] md:text-xs font-bold bg-[#b8863a]/15 hover:bg-[#b8863a]/30 border border-[#b8863a] px-3 py-1.5 rounded-xl cursor-pointer transition-all duration-300 flex items-center gap-1.5 shadow-[0_0_12px_rgba(184,134,58,0.25)]"
                  title="لوحة مراقبة الطلبات"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>مراقبة الطلبات</span>
                  <span className="bg-[#b8863a] text-white text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">{orders.length}</span>
                </button>
                <button
                  onClick={() => {
                    setIsAdminLoggedIn(false);
                    setAdminUsername('');
                    setAdminPassword('');
                    setCurrentView('home');
                    showToast('تم تسجيل الخروج بنجاح!', 'info');
                  }}
                  className="text-stone-400 hover:text-red-200 text-[11px] md:text-xs font-bold bg-stone-900 border border-stone-850 hover:bg-red-950/30 hover:border-red-900/40 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all duration-300 flex items-center gap-1"
                  title="تسجيل الخروج"
                >
                  <LogOut size={13} />
                  <span className="hidden sm:inline">خروج</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="text-[#b8a392] hover:text-[#d4a24e] text-xs font-bold bg-[#0f0b08]/85 hover:bg-stone-900 border border-stone-800 hover:border-[#b8863a]/50 px-3.5 py-1.5 rounded-xl cursor-pointer transition-all duration-300 flex items-center gap-1.5 shadow-sm"
              >
                <Lock size={13} className="text-[#b8863a]" />
                <span>تسجيل دخول 🔒</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <header className="hero pt-24 pb-12 text-center bg-gradient-to-br from-[#0f0b08] to-[#2a1f18] border-b-3 border-[#b8863a] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(184,134,58,0.06),transparent_50%)] pointer-events-none" />
        <div className="container mx-auto px-4">
          <span className="inline-block bg-[#b8863a]/15 border border-[#b8863a]/30 px-4 py-1 rounded-full text-xs font-semibold text-[#d4a24e] mb-4">
            🇪🇬 مطعم مصري شعبي فاخر
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-2">
            وسط <span className="text-[#d4a24e]">البساطة</span>
          </h1>
          <p className="text-[#b8a392] text-md md:text-xl font-light">
            لفواكة <em className="text-[#d4a24e] not-italic font-bold">اللحمة والمخاصي والكوارع</em> · نكهات عريقة تجلب قلب القاهرة لعندك
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#b8863a] to-transparent mx-auto my-5" />
          <p className="text-xs text-[#8a7a6a] font-normal tracking-wide">
            🚚 متوفر التوصيل الفوري مع تقنية تتبع خريطة GPS للمندوب
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 mt-8">
        
        {/* Category Controls & Search bar */}
        <section id="section-menu" className="mb-12">
          
          <div className="bg-[#1f1712] p-4 rounded-2xl border border-[#b8863a]/10 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-auto flex items-center gap-2">
              <span className="text-[#b8a392] font-semibold text-sm whitespace-nowrap hidden sm:inline flex items-center gap-1">
                <ListFilter size={16} className="text-[#d4a24e]" />
                فرز وتصفية القائمة:
              </span>
              <select
                id="categorySelect"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-auto bg-[#241c16] text-[#f5ede6] border border-[#b8863a]/25 px-4 py-2 rounded-full font-bold cursor-pointer outline-none focus:border-[#b8863a] focus:ring-1 focus:ring-[#b8863a]"
              >
                <option value="all">كل الأقسام والمأكولات</option>
                {menuCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="ابحث عن كبدة، ممبار، طاجن..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1410] text-[#f5ede6] border border-[#b8863a]/20 pl-4 pr-10 py-2 rounded-full text-sm outline-none focus:border-[#d4a24e] transition"
              />
              <Search size={16} className="absolute right-3.5 top-3.5 text-[#b8863a]" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3.5 top-3 text-stone-500 hover:text-stone-300"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Render Categories */}
          {menuCategories.map((cat) => {
            // Check if this category has matches
            const categoryItems = filteredItems.filter((i) => i.category === cat.id);
            if (categoryItems.length === 0) return null;

            return (
              <div key={cat.id} className="mb-12 scroll-mt-20" id={cat.id}>
                
                {/* Visual Section Header */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl">{cat.icon}</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-white">{cat.label}</h2>
                  <div className="flex-1 h-[1px] bg-gradient-to-l from-[#b8863a]/30 to-transparent" />
                </div>
                <p className="text-xs text-[#b8a392] font-semibold -mt-3 mb-6">{cat.desc}</p>

                {/* Grid of Dishes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryItems.map((item) => {
                    const dishImg = getImageForDish(item.name);
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        className="bg-[#241c16] rounded-2xl border border-[#b8863a]/8 p-5 flex flex-col justify-between hover:border-[#b8863a]/30 hover:-translate-y-1 transition-all duration-300 relative group"
                      >
                        <div className="absolute top-0 right-0 w-1 h-full bg-[#b8863a] rounded-r-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div>
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <h3 className="font-bold text-md text-[#f5ede6] leading-tight group-hover:text-[#d4a24e] transition-colors">
                              {item.name}
                            </h3>
                            <span className="text-sm font-black text-[#d4a24e] bg-[#b8863a]/8 border border-[#b8863a]/12 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                              {item.price ? `${item.price} ج.م` : 'غير متوفر'}
                            </span>
                          </div>
                          
                          <p className="text-xs text-[#b8a392] font-light leading-relaxed mb-4">
                            {item.description}
                          </p>
                        </div>

                        <div>
                          <img
                            src={dishImg}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-36 object-cover rounded-xl border border-stone-800 mb-4 bg-stone-900 group-hover:scale-[1.02] transition duration-300"
                          />

                          <button
                            onClick={() => addToCart(item)}
                            className="w-full bg-[#b8863a] hover:bg-[#d4a24e] text-[#1a1410] font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 shadow-[0_4px_10px_rgba(184,134,58,0.15)]"
                          >
                            <Plus size={14} className="stroke-[3]" />
                            <span>أضف للطلب الآن</span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="text-center py-12 bg-[#241c16] rounded-2xl border border-dashed border-stone-800">
              <BadgeAlert className="mx-auto text-[#b8a392] mb-3" size={40} />
              <p className="text-[#b8a392] font-bold">عذراً، لم نعثر على أي مأكولات مطابقة لبحثك.</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="mt-4 text-xs font-bold text-[#d4a24e] underline cursor-pointer"
              >
                عرض كل القائمة مجدداً
              </button>
            </div>
          )}
        </section>

        {/* Info - About Section */}
        <section className="py-10 border-t border-stone-900" id="section-about">
          <div className="max-w-4xl mx-auto bg-[#241c16] rounded-2xl border border-[#b8863a]/8 p-8 hover:border-[#b8863a]/20 transition shadow-lg">
            <h2 className="text-xl md:text-2xl font-black text-white mb-4 flex items-center gap-2">
              <span className="text-[#d4a24e]">ℹ️</span>
              قصة مطعم وسط البساطة
            </h2>
            <div className="text-stone-300 space-y-4 font-light text-sm md:text-md leading-relaxed">
              <p>
                مطعم <strong className="text-[#d4a24e] font-semibold">وسط البساطة لفواكة اللحمة</strong> تم تأسيسه ليكون ملتقى عشاق الأكلات الشعبية من فواكه اللحوم والمخاصي والممبار لحلويات اللحوم الشرقية التي تبث الدفء والنشاط بقلوب زوارنا.
              </p>
              <p>
                نعمل بأدق المعايير الصحية ونشتهر بالتتبيلة الحارة المصنوعة يدوياً لتقدم يومياً طازجة. نحن لا نصنع فقط طعاماً، بل نرسل لك طبقاً يحمل ذكريات وتراث العراقة المصرية مع جودة وراحة طلبها لبيتك بلمسة واحدة.
              </p>
              <p className="pt-2 flex items-center gap-2 text-xs md:text-sm font-semibold text-[#d4a24e]">
                <Clock size={16} />
                <span>نستقبل طلباتكم يومياً من الساعة ١٢:٠٠ ظهراً حتى الساعة ١٢:٠٠ منتصف الليل.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Contact info and Maps Embed */}
        <section className="py-10 border-t border-stone-900" id="section-contact">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Contact details */}
            <div className="bg-[#241c16] rounded-2xl border border-[#b8863a]/8 p-6 hover:border-[#b8863a]/20 transition flex flex-col justify-between">
              <div>
                <h3 className="text-lg md:text-xl font-black text-white mb-4 flex items-center gap-2">
                  <span className="text-[#d4a24e]"><Phone size={18} /></span>
                  اتصل بنا للطلبات الهاتفية
                </h3>
                <div className="space-y-4 text-stone-300 text-sm font-light">
                  <p className="flex items-center gap-3">
                    <span className="bg-stone-900 p-2 rounded-full text-[#d4a24e]"><Phone size={16} /></span>
                    <span className="font-bold">012 3456 7890</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="bg-stone-900 p-2 rounded-full text-[#d4a24e]"><Phone size={16} /></span>
                    <span className="font-bold">010 9876 5432</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="bg-stone-900 p-2 rounded-full text-[#d4a24e]"><Mail size={16} /></span>
                    <span>info@wasat-elbasata.com</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-800 text-xs text-stone-400">
                📌 راسلنا عبر واتساب من الزر الأخضر بالأسفل لتلقي عروض الخدمة الممتازة الفورية.
              </div>
            </div>

            {/* Simulated Live Location details */}
            <div className="bg-[#241c16] rounded-2xl border border-[#b8863a]/8 p-6 hover:border-[#b8863a]/20 transition">
              <h3 className="text-lg md:text-xl font-black text-white mb-2 flex items-center gap-2">
                <span className="text-[#d4a24e]"><MapPin size={18} /></span>
                موقع المطعم الرئيسي
              </h3>
              <p className="text-xs text-stone-300 font-light mb-4">
                القاهرة، مصر - شارع مجمع المطابخ، متفرع من ميدان التحرير، بجوار الكورنيش.
              </p>
              <div className="rounded-xl overflow-hidden border border-stone-800 h-44">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27647.81734208798!2d31.2357257!3d30.0444196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840f3b9c2d0d3%3A0x6e7c2b6b6b6b6b6b!2sCairo%2C%20Egypt!5e0!3m2!1sen!2seg!4v1718888888888!5m2!1sen!2seg"
                  className="w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 transition duration-300"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#0f0b08] py-8 text-center text-xs text-stone-500 border-t border-stone-900 mt-16 px-4">
        <div className="container mx-auto space-y-2">
          <p className="font-bold">مطعم وسط البساطة لفواكة اللحمة وسندوتشات الكبدة والمخاصي والشعلة الكبرى</p>
          <p>© {new Date().getFullYear()} - جميع الحقوق محفوظة لجهة الطلب والمسجلة في جمهورية مصر العربية</p>
          <p className="text-[10px] text-stone-600">تم تهيئة هذا النظام بالكامل لخدمة الطلب السريع بالبريد والدبوس ومرافق GPS الجغرافي للعملاء.</p>
        </div>
      </footer>

      {/* FLOAT ACTION AREA: Cart Button (Floating) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/201234567890?text=%D8%A3%D9%87%D9%84%D8%A7%D9%8B%2C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%B7%D9%84%D8%A8%20%D9%85%D9%86%20%D9%85%D8%B7%D8%B9%D9%85%20%D9%88%D8%B3%D8%B7%20%D8%A7%D9%84%D8%A8%D8%B3%D8%A7%D8%B7%D8%A9"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-[#25d366] text-white w-14 h-14 rounded-full shadow-lg hover:scale-110 active:scale-95 transition cursor-pointer self-end"
          title="واتساب الطلبات الفورية"
        >
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.1 1.45 4.7 1.453 5.4 0 9.8-4.4 9.8-9.8.002-2.585-1.002-5.015-2.825-6.84-1.82-1.823-4.25-2.827-6.84-2.828-5.4 0-9.8 4.4-9.8 9.8-.001 2 .51 3.5 1.46 5.06l-.98 3.58 3.68-.96zM17.1 14.8c-.28-.14-1.65-.8-1.9-.9-.25-.09-.43-.14-.6.13-.18.27-.69.9-.85 1.07-.15.18-.32.2-.6.06-.28-.14-1.2-.44-2.28-1.4-.84-.75-1.4-1.68-1.57-1.96-.17-.28-.02-.43.12-.57.13-.13.28-.32.43-.48.14-.17.18-.28.28-.46.1-.18.05-.33-.02-.46-.07-.14-.6-1.45-.82-1.98-.22-.52-.47-.45-.64-.46-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.35-.26.27-1 .98-1 2.38s1 2.75 1.14 2.95c.14.2 2 3.03 4.8 4.2.67.28 1.2.45 1.6.58.68.21 1.3.18 1.8.1.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.2-.53-.34z" />
          </svg>
        </a>

        {/* Floating Cart Launcher */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center justify-center bg-[#b8863a] hover:bg-[#d4a24e] text-[#1a1410] w-16 h-16 rounded-full shadow-2xl scale-100 hover:scale-105 active:scale-95 transition cursor-pointer relative font-bold"
        >
          <ShoppingBag size={25} className="stroke-[2.5]" />
          {getCartItemsCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white font-mono text-[11px] h-6 w-6 rounded-full border-2 border-[#1a1410] flex items-center justify-center animate-bounce">
              {getCartItemsCount()}
            </span>
          )}
        </button>

      </div>

      {/* TOAST NOTIFICATION CONTAINER */}
      <AnimatePresence>
        {isToastOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-6 left-6 z-100 max-w-sm px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 border ${
              toastType === 'success'
                ? 'bg-emerald-950 text-emerald-200 border-emerald-800'
                : toastType === 'info'
                ? 'bg-[#241c16] text-[#d4a24e] border-[#b8863a]/30'
                : 'bg-rose-950 text-rose-200 border-rose-900'
            }`}
          >
            {toastType === 'success' && <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />}
            {toastType === 'info' && <Compass className="text-[#d4a24e] shrink-0" size={20} />}
            {toastType === 'error' && <BadgeAlert className="text-rose-400 shrink-0" size={20} />}
            <span className="text-xs md:text-sm font-semibold leading-snug">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHECKOUT CART PANEL (Drawer side overlay) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-500 cursor-pointer"
            />

            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#1f1712] z-501 shadow-[0_0_40px_rgba(0,0,0,0.8)] border-l border-[#b8863a]/15 flex flex-col justify-between overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 border-b border-stone-800 bg-[#0f0b08] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-[#d4a24e]" />
                  <h3 className="text-ld md:text-lg font-black text-white">سلة طلباتك المستعجلة</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-stone-900 hover:bg-stone-800 p-2 rounded-lg cursor-pointer transition text-stone-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body: Items & Checkout form */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                
                {/* Selected Items List */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider mb-3">عناصر السلة</h4>
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-stone-500">
                      <ShoppingBag className="mx-auto text-stone-600 mb-2" size={30} />
                      <p className="text-xs">السلة فارغة حالياً. انتقل للقائمة وأضف أطباقك المفضلة!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((cartItem) => (
                        <div
                          key={cartItem.item.id}
                          className="bg-[#241c16] rounded-xl p-3.5 border border-stone-800 flex items-center justify-between gap-4"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs md:text-sm font-bold text-white truncate">{cartItem.item.name}</p>
                            <p className="text-xs text-[#d4a24e] font-black mt-1">
                              {cartItem.item.price ? `${cartItem.item.price * cartItem.quantity} ج.م` : 'بدون سعر'}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Quantity buttons */}
                            <div className="flex items-center gap-1.5 bg-[#1a1410] border border-stone-800 px-2 py-1 rounded-lg">
                              <button
                                onClick={() => updateQuantity(cartItem.item.id, -1)}
                                className="text-stone-400 hover:text-white cursor-pointer"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="font-mono text-xs w-4 text-center text-white">{cartItem.quantity}</span>
                              <button
                                onClick={() => updateQuantity(cartItem.item.id, 1)}
                                className="text-stone-400 hover:text-white cursor-pointer"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            {/* Delete button */}
                            <button
                              onClick={() => removeFromCart(cartItem.item.id)}
                              className="text-stone-500 hover:text-red-400 cursor-pointer p-1 rounded transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Total Bar */}
                      <div className="border-t border-stone-800 pt-3 flex justify-between items-center text-sm md:text-base font-black">
                        <span>إجمالي القيمة:</span>
                        <span className="text-[#d4a24e] font-sans">{getCartTotal()} ج.م</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Checkout form if cart has elements */}
                {cart.length > 0 && (
                  <form onSubmit={handleSubmitOrder} className="border-t border-stone-800 pt-6 space-y-4">
                    <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider mb-2">بيانات مستلم وموقع التوصيل</h4>

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-stone-400 mb-1 flex items-center gap-1.5">
                        <User size={12} className="text-[#b8863a]" />
                        الاسم الكامل للمستلم: <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: أحمد محمد علي"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-[#1a1410] text-white border border-stone-800 rounded-xl px-3 py-2 text-xs md:text-sm outline-none focus:border-[#d4a24e] transition"
                      />
                    </div>

                    {/* Contact Phone */}
                    <div>
                      <label className="block text-xs font-bold text-stone-400 mb-1 flex items-center gap-1.5">
                        <Phone size={12} className="text-[#b8863a]" />
                        رقم الهاتف للتواصل للتأكيد: <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="مثال: 01234567890"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-[#1a1410] text-white border border-stone-800 rounded-xl px-3 py-2 text-xs md:text-sm outline-none focus:border-[#d4a24e] transition"
                        dir="ltr"
                      />
                    </div>

                    {/* Geolocation Pin and Accuracy Badge */}
                    <div className="bg-[#241c16] rounded-xl border border-stone-800 p-3.5 space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-stone-300 flex items-center gap-1">
                          <Compass size={14} className="text-[#d4a24e] spinner-slow" />
                          الحصول على موقع GPS الدقيق: <span className="text-red-500">*</span>
                        </span>
                        
                        {/* Get Location Button */}
                        <button
                          type="button"
                          onClick={handleGetLocation}
                          disabled={isGpsLoading}
                          className="bg-stone-900 border border-stone-700 hover:border-[#b8863a] disabled:opacity-50 text-[#d4a24e] px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition flex items-center gap-1"
                        >
                          <MapPin size={10} />
                          {isGpsLoading ? 'تحديد الموقع...' : 'احصل على موقعي'}
                        </button>
                      </div>

                      {gpsStatus && (
                        <div className="text-[10px] bg-stone-900/60 p-2 rounded border border-stone-800 text-stone-400 break-words flex flex-col gap-1">
                          <span className="font-semibold text-stone-300">حالة نظام التموضع: {gpsStatus}</span>
                          {latitude && longitude && (
                            <div className="font-mono flex flex-col text-[9px] gap-1 mt-1">
                              <span className="text-emerald-400">إحداثياتك: Latitude: {latitude.toFixed(6)}, Longitude: {longitude.toFixed(6)}</span>
                              {gpsAccuracy && <span className="text-[#b8a392]">مدى الدقة: ± {Math.round(gpsAccuracy)} متر</span>}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Address Detail Field */}
                    <div>
                      <label className="block text-xs font-bold text-stone-400 mb-1 flex items-center gap-1.5">
                        <Map size={12} className="text-[#b8863a]" />
                        العنوان بالتفصيل وصندوق البريد: <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={2}
                        placeholder="برجاء كتابة الحي والشارع ورقم البناية والشقة وملاحظات مرجعية..."
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        className="w-full bg-[#1a1410] text-white border border-stone-800 rounded-xl px-3 py-2 text-xs md:text-sm outline-none focus:border-[#d4a24e] transition resize-none"
                      />
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label className="block text-xs font-bold text-stone-400 mb-1">
                        تعليمات خاصة للمطبخ أو موظف التوصيل (اختياري)
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: اللحم مطهو جيداً / عدم إضافة الفلفل الحار"
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="w-full bg-[#1a1410] text-white border border-stone-800 rounded-xl px-3 py-2 text-xs md:text-sm outline-none focus:border-[#d4a24e] transition"
                      />
                    </div>

                    {/* Submit Order Action Button */}
                    <button
                      type="submit"
                      disabled={isSubmittingOrder}
                      className="w-full bg-[#b8863a] hover:bg-[#d4a24e] disabled:opacity-50 text-[#1a1410] font-black py-3 rounded-xl text-xs md:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(184,134,58,0.3)] mt-6"
                    >
                      {isSubmittingOrder ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#1a1410] border-t-transparent rounded-full animate-spin" />
                          <span>جاري تأكيد طلبك وإرسال البريد...</span>
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          <span>تأكيد وإرسال الطلب أوفيشالي</span>
                        </>
                      )}
                    </button>
                    
                  </form>
                )}

              </div>

              {/* Drawer Footer info */}
              <div className="p-4 border-t border-stone-800 bg-[#0f0b08] text-[10px] text-stone-500 text-center leading-relaxed">
                بمجرد ضغط تأكيد الطلب، سيتم إخطار مطبخ المطعم بطلبك وتفاصيل دبوس GPS الخاص بك فورياً عبر البريد الإلكتروني.
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

        </>
      )}

      {currentView === 'login' && (
        <div className="min-h-screen bg-[#0f0b08] flex flex-col justify-between" style={{ backgroundImage: "radial-gradient(circle at 50% 30%, #2a1f18 0%, #0f0b08 100%)" }}>
          {/* Header */}
          <header className="h-16 border-b border-[#b8863a]/30 bg-[#0f0b08]/80 backdrop-blur flex items-center px-4 md:px-8 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-black text-[#d4a24e] tracking-tight">وسط البساطة</span>
                <span className="hidden sm:inline-block text-[10px] bg-[#b8863a]/25 border border-[#b8863a]/30 text-[#d4a24e] px-2.5 py-0.5 rounded-full font-bold">بوابة الإشراف والمراقبة</span>
              </div>
              <button
                onClick={() => setCurrentView('home')}
                className="bg-stone-900 border border-stone-850 hover:bg-[#bba07a]/10 hover:border-[#b8863a]/40 text-[#bba07a] hover:text-[#d4a24e] px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm ml-auto"
              >
                <span>العودة للرئيسية 🏠</span>
              </button>
            </div>
          </header>

          {/* Login Form body */}
          <div className="flex-1 flex items-center justify-center p-6 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(184,134,58,0.03),transparent_60%)] pointer-events-none" />
            <form onSubmit={handleAdminLogin} className="w-full max-w-md bg-[#241c16] rounded-3xl border border-[#b8863a]/30 p-6 md:p-8 shadow-2xl space-y-6 relative z-10 animate-fade-in" dir="rtl">
              <div className="text-center">
                <div className="bg-[#b8863a]/15 text-[#d4a24e] w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#b8863a]/30 shadow-[0_0_15px_rgba(184,134,58,0.15)]">
                  <Lock size={28} />
                </div>
                <h4 className="text-lg md:text-xl font-black text-white">تسجيل دخول الإشراف والمراقبة 🔒</h4>
                <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">يرجى تسجيل الدخول للوصول إلى لوحة تتبع الطلبات والبريد الصادر للمطعم</p>
              </div>

              {loginError && (
                <div className="bg-red-950/50 border border-red-900/50 text-red-200 p-3 rounded-xl text-xs leading-relaxed text-center animate-pulse">
                  ⚠️ {loginError}
                </div>
              )}

              <div className="space-y-4">
                {/* Name input */}
                <div>
                  <label className="block text-xs font-bold text-stone-400 mb-1">
                    اسم المستخدم:
                  </label>
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="أدخل اسم المستخدم"
                    className="w-full bg-[#1a1410] text-white border border-stone-800 rounded-xl px-4 py-2.5 text-xs md:text-sm outline-none focus:border-[#d4a24e] transition-all !ring-0"
                  />
                </div>

                {/* Password input */}
                <div>
                  <label className="block text-xs font-bold text-stone-400 mb-1">
                    كلمة المرور:
                  </label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="w-full bg-[#1a1410] text-white border border-stone-800 rounded-xl px-4 py-2.5 text-xs md:text-sm outline-none focus:border-[#d4a24e] transition-all !ring-0"
                  />
                </div>
              </div>

              {/* Hint Box for Testing Credentials */}
              <div className="bg-stone-900/80 border border-stone-850 p-4 rounded-xl text-center">
                <p className="text-[10px] text-[#b8a392] font-semibold">🔑 لتسجيل الدخول الفوري ومعاينة لوحة استقبال الطلبات:</p>
                <div className="text-[11px] font-mono font-bold text-white mt-1.5 flex justify-center items-center gap-1.5 font-mono">
                  <span>اسم المستخدم: </span>
                  <span className="text-[#d4a24e] bg-[#b8863a]/10 px-1.5 py-0.5 rounded border border-[#b8863a]/25">admin</span>
                  <span className="text-stone-500 font-sans">|</span>
                  <span>كلمة المرور: </span>
                  <span className="text-[#d4a24e] bg-[#b8863a]/10 px-1.5 py-0.5 rounded border border-[#b8863a]/25">123</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#b8863a] hover:bg-[#d4a24e] text-[#1a1410] font-black py-3 rounded-xl text-xs md:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(184,134,58,0.25)]"
              >
                <span>سجل دخول الآن 🔓</span>
              </button>
            </form>
          </div>

          <footer className="py-4 text-center text-[11px] text-stone-600 border-t border-stone-900 bg-[#070504]">
            مطعم وسط البساطة © {new Date().getFullYear()} · نكهات عريقة ممتازة
          </footer>
        </div>
      )}

      {currentView === 'admin' && (
        <div className="min-h-screen bg-[#17110d] flex flex-col justify-between h-screen overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-[#0f0b08] border-b border-[#b8863a]/30 flex justify-between items-center px-4 md:px-8 shadow-md z-10 shrink-0 select-none">
            <div className="flex items-center gap-2">
              <Inbox className="text-[#d4a24e]" />
              <div>
                <h3 className="text-sm md:text-base font-black text-white">لوحة مراقبة واستقبال الطلبات (لوحة التحكم)</h3>
                <p className="text-[10px] text-[#b8a392] hidden sm:block font-medium">هنا يمكنك تتبع كافة الطلبات المستلمة والبريد الإلكتروني الصادر بالكامل لتجربة نظام Full-Stack</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('home')}
                className="bg-stone-900 border border-stone-850 hover:bg-[#bba07a]/10 hover:border-[#b8863a]/40 text-[#bba07a] hover:text-[#d4a24e] px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>العودة للرئيسية 🏠</span>
              </button>
              
              <button
                onClick={() => {
                  setIsAdminLoggedIn(false);
                  setAdminUsername('');
                  setAdminPassword('');
                  setCurrentView('home');
                  showToast('تم تسجيل الخروج بنجاح!', 'info');
                }}
                className="bg-red-950/60 hover:bg-red-900 border border-red-800/45 text-red-200 text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
              >
                تسجيل الخروج 🔒
              </button>
            </div>
          </header>

          {/* Double Pane Body */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
            
            {/* Left Pane - List of orders RECEIVED */}
            <div className="w-full md:w-1/2 border-l border-stone-850 bg-[#17110d] overflow-y-auto p-4 space-y-3">
              <h4 className="text-xs font-bold text-stone-400 flex items-center gap-1 mb-2">
                <span>قائمة الطلبات المستلمة</span>
                <span className="bg-[#b8863a]/25 text-[#d4a24e] px-1.5 py-0.2 rounded font-mono text-[9px]">{orders.length}</span>
              </h4>

              {orders.length === 0 ? (
                <div className="text-center py-20 text-stone-600">
                  <Inbox className="mx-auto mb-2 opacity-30" size={50} />
                  <p className="text-sm">لم يتم تسجيل أي طلبات بعد في نظام المطعم.</p>
                  <p className="text-xs text-stone-700 mt-2">قم بوضع طلب من السلة ليشرحه النظام هنا فورياً!</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderForLog(order)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-right select-none ${
                      selectedOrderForLog?.id === order.id
                        ? 'bg-[#b8863a]/10 border-[#b8863a]'
                        : 'bg-[#241c16] border-stone-850 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-extrabold text-[#d4a24e] font-sans">{order.id}</span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {new Date(order.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="space-y-1 text-stone-300 text-xs">
                      <p className="font-semibold"><strong className="text-stone-400 text-[10px]">العميل:</strong> {order.customer.name}</p>
                      <p className="font-semibold"><strong className="text-stone-400 text-[10px]">الهاتف:</strong> {order.customer.phone}</p>
                      <p className="text-[10px] text-stone-400 truncate"><strong className="text-stone-400 text-[9px]">العنوان:</strong> {order.customer.address}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-800/50 flex justify-between items-center">
                      <span className="text-[10px] bg-stone-900 border border-stone-800 px-2 py-0.5 rounded text-white">
                        {order.items.reduce((sum, i) => sum + i.quantity, 0)} أصناف
                      </span>
                      <span className="font-bold text-[#d4a24e] font-sans text-xs">{order.totalPrice} ج.م</span>
                    </div>

                    {/* Order Geolocation GPS coordinates */}
                    {order.customer.coordinates?.latitude && (
                      <div className="mt-2 text-[9px] bg-emerald-950/40 border border-emerald-900 text-emerald-300 px-2.5 py-1 rounded flex justify-between items-center">
                        <span>📍 تحديد موقع متاح (Latitude: {order.customer.coordinates.latitude.toFixed(4)})</span>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${order.customer.coordinates.latitude},${order.customer.coordinates.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="underline text-emerald-400 font-bold hover:text-emerald-300"
                        >
                          عرض الخريطة 🗺️
                        </a>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Right Pane - Specific Drafted Email Body Render */}
            <div className="w-full md:w-1/2 overflow-y-auto p-4 flex flex-col bg-[#130d0a] border-t md:border-t-0 md:border-r border-stone-850 h-full">
              <h4 className="text-xs font-bold text-stone-400 mb-3 flex items-center gap-1">
                <Eye size={12} className="text-[#d4a24e]" />
                <span>مخطَّط البريد الإلكتروني المرسل للمطعم (Email Body Preview)</span>
              </h4>

              {selectedOrderForLog ? (
                <div className="flex-1 flex flex-col gap-3 min-h-0">
                  
                  <div className="bg-[#241c16] border border-stone-800 rounded-xl p-3 text-[11px] text-stone-400 space-y-1">
                    <p><strong className="text-stone-300">من:</strong> وسط البساطة تلقائي &lt;wasat-elbasata-system&gt;</p>
                    <p><strong className="text-stone-300">إلى:</strong> بريد المطعم المعتمد &lt;binfof123@gmail.com&gt;</p>
                    <p><strong className="text-stone-300">الموضوع:</strong> 🔔 طلب جديد أونلاين: {selectedOrderForLog.id} - العميل: {selectedOrderForLog.customer.name}</p>
                  </div>

                  <div className="flex-1 bg-white rounded-2xl p-4 overflow-auto border-2 border-[#b8863a]/20 min-h-0 text-[#1a1410] text-sm leading-relaxed" style={{ direction: 'rtl' }}>
                    {selectedOrderForLog.emailLog ? (
                      <div dangerouslySetInnerHTML={{ __html: selectedOrderForLog.emailLog }} />
                    ) : (
                      <p className="text-center text-sm py-16 text-stone-500">جسم البريد الإلكتروني غير متوفر في السجل.</p>
                    )}
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-stone-600">
                  <Mail className="opacity-20 mb-3" size={50} />
                  <p className="text-xs">اضغط على أي من الطلبات في القائمة الجانبية لمعاينة شكل وجودة البريد الإلكتروني الذي تم إرساله للمطعم.</p>
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <footer className="bg-[#0f0b08] p-4 border-t border-stone-850 text-center text-[10px] text-stone-550 shrink-0 select-none">
            💡 تم بناء هذا المراقب لتوضيح الاتصال الحقيقي الكامل مع الخادم Node/Express وقدرة Geolocation على جلب الإحداثيات وتشكيل البريد الإلكتروني للمطاعم.
          </footer>
        </div>
      )}

    </div>
  );
}
