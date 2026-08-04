import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ColumnDef } from '@tanstack/react-table';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Search,
  Plus,
  TrendingUp,
  MoreHorizontal,
  Bell,
  CheckCircle2,
  Clock,
  Truck,
  Download,
  LayoutDashboard,
  Package,
  UserCheck,
  BarChart3,
  Settings,
  ArrowUpRight,
  Trash2,
} from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/avatar';
import { Badge } from '@/components/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/breadcrumb';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/card';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/command';
import { DataTable } from '@/components/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu';
import { Input } from '@/components/input';
import { Progress } from '@/components/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/sheet';
import { Switch } from '@/components/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import { Toaster, toast } from '@/components/toast';

export type OrderStatus = 'Completed' | 'Pending' | 'Shipped';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: string;
  date: string;
  status: OrderStatus;
  itemsCount: number;
}

const initialOrders: Order[] = [
  {
    id: 'ORD-7001',
    customerName: 'Sophia Montgomery',
    customerEmail: 'sophia.m@example.com',
    amount: '$349.00',
    date: 'Aug 03, 2026',
    status: 'Completed',
    itemsCount: 3,
  },
  {
    id: 'ORD-7002',
    customerName: 'Alexander Wright',
    customerEmail: 'alex.wright@example.com',
    amount: '$129.50',
    date: 'Aug 03, 2026',
    status: 'Pending',
    itemsCount: 1,
  },
  {
    id: 'ORD-7003',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.r@example.com',
    amount: '$890.00',
    date: 'Aug 02, 2026',
    status: 'Shipped',
    itemsCount: 5,
  },
  {
    id: 'ORD-7004',
    customerName: 'Liam Chen',
    customerEmail: 'liam.chen@example.com',
    amount: '$45.00',
    date: 'Aug 02, 2026',
    status: 'Completed',
    itemsCount: 1,
  },
  {
    id: 'ORD-7005',
    customerName: 'Amara Okafor',
    customerEmail: 'amara.o@example.com',
    amount: '$210.75',
    date: 'Aug 01, 2026',
    status: 'Pending',
    itemsCount: 2,
  },
  {
    id: 'ORD-7006',
    customerName: 'Lucas Vance',
    customerEmail: 'lucas.v@example.com',
    amount: '$560.20',
    date: 'Aug 01, 2026',
    status: 'Shipped',
    itemsCount: 4,
  },
];

function AdminDashboardPage({ autoToast = false }: { autoToast?: boolean }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewOrderSheetOpen, setIsNewOrderSheetOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('orders');
  const [timeRange, setTimeRange] = useState('30d');

  // New Order Form State
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newItemsCount, setNewItemsCount] = useState('1');
  const [newStatus, setNewStatus] = useState<OrderStatus>('Pending');

  // Store Settings Toggle States
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoFulfill, setAutoFulfill] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K' || e.code === 'KeyK')) {
        e.preventDefault();
        e.stopPropagation();
        setIsSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (autoToast) {
      const timer = setTimeout(() => {
        toast.success('Order ORD-7003 marked as Shipped.', {
          description: 'Carrier: FedEx Express (#FX-884920)',
        });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [autoToast]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord)),
    );
    toast.success(`Order ${orderId} updated to ${newStatus}.`, {
      description: 'Customer notified by email.',
    });
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    toast.error(`Order ${orderId} removed.`, {
      description: 'Order record deleted.',
    });
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName || !newCustomerEmail || !newAmount) {
      toast.warning('Please fill out all required fields.');
      return;
    }

    const nextId = `ORD-${7000 + orders.length + 1}`;
    const formattedAmount = newAmount.startsWith('$') ? newAmount : `$${newAmount}`;

    const newOrderObj: Order = {
      id: nextId,
      customerName: newCustomerName,
      customerEmail: newCustomerEmail,
      amount: formattedAmount,
      date: 'Aug 03, 2026',
      status: newStatus,
      itemsCount: parseInt(newItemsCount, 10) || 1,
    };

    setOrders([newOrderObj, ...orders]);
    setIsNewOrderSheetOpen(false);

    // Reset Form
    setNewCustomerName('');
    setNewCustomerEmail('');
    setNewAmount('');
    setNewItemsCount('1');
    setNewStatus('Pending');

    toast.success(`Order ${nextId} created.`, {
      description: `${newCustomerName} • ${formattedAmount}`,
    });
  };

  const handleExportCSV = () => {
    const headers = 'Order ID,Customer Name,Customer Email,Items,Date,Amount,Status\n';
    const rows = filteredOrders
      .map(
        (o) =>
          `${o.id},"${o.customerName}",${o.customerEmail},${o.itemsCount},${o.date},"${o.amount}",${o.status}`,
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sinhatsu_orders_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info('Orders CSV downloaded.');
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'all') return true;
    return order.status.toLowerCase() === activeTab.toLowerCase();
  });

  const totalRevenueNum = orders.reduce((sum, o) => {
    const val = parseFloat(o.amount.replace('$', '').replace(',', '')) || 0;
    return sum + val;
  }, 0);

  const columns: ColumnDef<Order, unknown>[] = [
    {
      accessorKey: 'id',
      header: 'Order ID',
      cell: ({ row }) => (
        <span className="font-semibold text-foreground tracking-tight">{row.original.id}</span>
      ),
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-foreground">{row.original.customerName}</p>
          <p className="text-xs text-muted-foreground">{row.original.customerEmail}</p>
        </div>
      ),
    },
    {
      accessorKey: 'itemsCount',
      header: 'Items',
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {row.original.itemsCount} {row.original.itemsCount === 1 ? 'item' : 'items'}
        </span>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <span className="text-muted-foreground text-xs">{row.original.date}</span>,
    },
    {
      accessorKey: 'amount',
      header: 'Total',
      cell: ({ row }) => <span className="font-bold text-foreground">{row.original.amount}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        if (status === 'Completed') {
          return (
            <Badge variant="success" icon={<CheckCircle2 className="size-3" />}>
              Completed
            </Badge>
          );
        }
        if (status === 'Pending') {
          return (
            <Badge variant="warning" icon={<Clock className="size-3" />}>
              Pending
            </Badge>
          );
        }
        return (
          <Badge variant="secondary" icon={<Truck className="size-3" />}>
            Shipped
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const order = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="size-8" aria-label="Order actions">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Update Status</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleStatusChange(order.id, 'Shipped')}
                disabled={order.status === 'Shipped'}
              >
                <Truck className="size-3.5 mr-2 text-muted-foreground" />
                Mark as Shipped
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange(order.id, 'Completed')}
                disabled={order.status === 'Completed'}
              >
                <CheckCircle2 className="size-3.5 mr-2 text-muted-foreground" />
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.info(`Viewing ${order.id}`)}>
                <ArrowUpRight className="size-3.5 mr-2 text-muted-foreground" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDeleteOrder(order.id)}
              >
                <Trash2 className="size-3.5 mr-2 text-destructive" />
                Delete Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans antialiased">
      {/* Toast Viewport */}
      <Toaster />

      {/* Left Navigation Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/30 shrink-0 min-h-screen sticky top-0 h-screen">
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-border flex items-center gap-3 shrink-0">
          <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-extrabold text-lg shadow-sm">
            S
          </div>
          <div>
            <h1 className="text-sm font-bold leading-none tracking-tight">Sinhatsu</h1>
            <p className="text-[11px] text-muted-foreground mt-1">Admin Workspace</p>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Menu
            </p>
            <button
              onClick={() => setActiveNav('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeNav === 'overview'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <LayoutDashboard className="size-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveNav('orders')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeNav === 'orders'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <ShoppingCart className="size-4" />
                <span>Orders</span>
              </span>
              <Badge
                variant={activeNav === 'orders' ? 'outline' : 'secondary'}
                size="sm"
                className="px-1.5 text-[10px]"
              >
                {orders.length}
              </Badge>
            </button>

            <button
              onClick={() => setActiveNav('products')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeNav === 'products'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Package className="size-4" />
              <span>Products</span>
            </button>

            <button
              onClick={() => setActiveNav('customers')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeNav === 'customers'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <UserCheck className="size-4" />
              <span>Customers</span>
            </button>

            <button
              onClick={() => setActiveNav('analytics')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeNav === 'analytics'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <BarChart3 className="size-4" />
              <span>Analytics</span>
            </button>
          </div>

          <div className="pt-4 border-t border-border space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Settings
            </p>
            <button
              onClick={() => setActiveNav('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeNav === 'settings'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Settings className="size-4" />
              <span>Settings</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-border bg-background/95 backdrop-blur-md px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shrink-0">
          {/* Search Trigger */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-3 text-muted-foreground w-64 md:w-80 justify-between h-9 px-3 bg-muted/30 border-border hover:bg-muted/50"
            >
              <span className="flex items-center gap-2 text-xs">
                <Search className="size-3.5" />
                <span>Search orders, customers...</span>
              </span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </Button>
          </div>

          {/* Right User & Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="relative size-9"
                  aria-label="Notifications"
                >
                  <Bell className="size-4" />
                  <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-background" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="p-3 border-b border-border flex items-center justify-between">
                  <p className="text-sm font-semibold">Notifications</p>
                  <Badge variant="outline" size="sm">
                    2 New
                  </Badge>
                </div>
                <div className="divide-y divide-border/60 text-xs">
                  <div
                    className="p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => toast.info('Selected order ORD-7003.')}
                  >
                    <p className="font-semibold text-foreground">High Value Order Received</p>
                    <p className="text-muted-foreground mt-0.5">
                      Order ORD-7003 ($890.00) pending review.
                    </p>
                    <span className="text-[10px] text-muted-foreground/80 mt-1 block">5m ago</span>
                  </div>
                  <div
                    className="p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => toast.success('Products updated.')}
                  >
                    <p className="font-semibold text-foreground">Catalog Synced</p>
                    <p className="text-muted-foreground mt-0.5">
                      142 items updated in store inventory.
                    </p>
                    <span className="text-[10px] text-muted-foreground/80 mt-1 block">1h ago</span>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* New Order Drawer */}
            <Sheet open={isNewOrderSheetOpen} onOpenChange={setIsNewOrderSheetOpen}>
              <SheetTrigger asChild>
                <Button size="sm" className="h-9 px-3.5 shadow-xs font-semibold">
                  <Plus className="size-4 mr-1.5" />
                  New Order
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Create Order</SheetTitle>
                  <SheetDescription>Enter order details to add a new record.</SheetDescription>
                </SheetHeader>
                <form onSubmit={handleCreateOrder} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="c-name" className="text-xs font-semibold text-foreground">
                      Customer Name *
                    </label>
                    <Input
                      id="c-name"
                      placeholder="e.g. Marcus Vance"
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="c-email" className="text-xs font-semibold text-foreground">
                      Customer Email *
                    </label>
                    <Input
                      id="c-email"
                      type="email"
                      placeholder="marcus@example.com"
                      value={newCustomerEmail}
                      onChange={(e) => setNewCustomerEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label htmlFor="c-amount" className="text-xs font-semibold text-foreground">
                        Amount ($) *
                      </label>
                      <Input
                        id="c-amount"
                        placeholder="299.00"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="c-items" className="text-xs font-semibold text-foreground">
                        Items Count
                      </label>
                      <Input
                        id="c-items"
                        type="number"
                        min="1"
                        value={newItemsCount}
                        onChange={(e) => setNewItemsCount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground">Status</label>
                    <Select
                      value={newStatus}
                      onValueChange={(val) => setNewStatus(val as OrderStatus)}
                    >
                      <SelectTrigger className="w-full" aria-label="Initial order status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <SheetFooter className="pt-4">
                    <SheetClose asChild>
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                    </SheetClose>
                    <Button type="submit">Create Order</Button>
                  </SheetFooter>
                </form>
              </SheetContent>
            </Sheet>

            {/* Profile Menu (Matching Top Left Brand 'Sinhatsu' -> 'S') */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="size-9 rounded-full p-0 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Avatar size="sm" className="size-9 border border-primary/20">
                    <AvatarFallback className="font-bold text-xs bg-primary text-primary-foreground">
                      S
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2.5 p-2">
                  <Avatar size="sm">
                    <AvatarFallback className="font-bold text-xs bg-primary text-primary-foreground">
                      S
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold leading-none text-foreground">
                      Sinhatsu Admin
                    </p>
                    <p className="text-[11px] text-muted-foreground">admin@sinhatsu.com</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => toast.info('Account Settings')}>
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info('Store Preferences')}>
                    Store Preferences
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => toast.warning('Signed out.')}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Breadcrumb Header */}
          <Breadcrumb>
            <BreadcrumbList className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Dashboards</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {activeNav === 'orders' || activeNav === 'overview'
                    ? 'Orders'
                    : activeNav === 'settings'
                      ? 'Settings'
                      : activeNav === 'products'
                        ? 'Products'
                        : activeNav === 'customers'
                          ? 'Customers'
                          : 'Analytics'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Nav View 1: Orders (Default Workspace View) */}
          {activeNav === 'orders' || activeNav === 'overview' ? (
            <>
              {/* Page Title & Time Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Store Overview
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Track sales, manage orders, and monitor store activity.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-36 h-9 text-xs" aria-label="Select time period">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                      <SelectItem value="90d">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 text-xs"
                    onClick={handleExportCSV}
                  >
                    <Download className="size-3.5 mr-1.5" />
                    Export CSV
                  </Button>
                </div>
              </div>

              {/* 3 Metric Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Card className="shadow-xs border-border">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Total Revenue
                    </CardTitle>
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <DollarSign className="size-4" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-3xl font-extrabold tracking-tight text-foreground">
                      ${totalRevenueNum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-success font-semibold mt-2">
                      <span className="inline-flex items-center rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-bold text-success">
                        <TrendingUp className="size-3 mr-1" />
                        +14.2%
                      </span>
                      <span className="text-muted-foreground font-normal">
                        vs. {timeRange === '7d' ? 'last week' : 'last month'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-xs border-border">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Total Orders
                    </CardTitle>
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <ShoppingCart className="size-4" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-3xl font-extrabold tracking-tight text-foreground">
                      {orders.length}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-success font-semibold mt-2">
                      <span className="inline-flex items-center rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-bold text-success">
                        <TrendingUp className="size-3 mr-1" />
                        +8.1%
                      </span>
                      <span className="text-muted-foreground font-normal">
                        vs. {timeRange === '7d' ? 'last week' : 'last month'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-xs border-border">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Active Customers
                    </CardTitle>
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <Users className="size-4" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-3xl font-extrabold tracking-tight text-foreground">
                      8,942
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-success font-semibold mt-2">
                      <span className="inline-flex items-center rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-bold text-success">
                        <TrendingUp className="size-3 mr-1" />
                        +5.4%
                      </span>
                      <span className="text-muted-foreground font-normal">
                        vs. {timeRange === '7d' ? 'last week' : 'last month'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Orders Section */}
              <Card className="shadow-xs border-border">
                <CardHeader className="border-b border-border/60 pb-4">
                  <CardTitle className="text-lg font-bold">Orders</CardTitle>
                  <CardDescription className="text-xs">
                    Manage customer purchases and fulfillment status.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
                      <TabsTrigger value="pending">
                        Pending ({orders.filter((o) => o.status === 'Pending').length})
                      </TabsTrigger>
                      <TabsTrigger value="shipped">
                        Shipped ({orders.filter((o) => o.status === 'Shipped').length})
                      </TabsTrigger>
                      <TabsTrigger value="completed">
                        Completed ({orders.filter((o) => o.status === 'Completed').length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="mt-0">
                      <DataTable
                        data={filteredOrders}
                        columns={columns}
                        getRowId={(row) => row.id}
                        caption="Customer store orders table"
                        enableColumnVisibility
                        defaultPageSize={10}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          ) : activeNav === 'settings' ? (
            /* Nav View 2: Settings */
            <Card className="max-w-2xl shadow-xs border-border">
              <CardHeader>
                <CardTitle>Store Settings</CardTitle>
                <CardDescription>
                  Manage notification preferences and fulfillment rules.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                  <div>
                    <p className="text-sm font-semibold">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Send automatic updates to customers when orders are shipped.
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={(val) => {
                      setEmailNotifications(val);
                      toast.info(`Email notifications ${val ? 'enabled' : 'disabled'}.`);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                  <div>
                    <p className="text-sm font-semibold">Auto-Fulfillment</p>
                    <p className="text-xs text-muted-foreground">
                      Mark digital orders as completed upon payment.
                    </p>
                  </div>
                  <Switch
                    checked={autoFulfill}
                    onCheckedChange={(val) => {
                      setAutoFulfill(val);
                      toast.info(`Auto-fulfillment ${val ? 'enabled' : 'disabled'}.`);
                    }}
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label htmlFor="store-currency" className="text-xs font-semibold">
                    Currency
                  </label>
                  <Select defaultValue="usd">
                    <SelectTrigger
                      id="store-currency"
                      aria-label="Primary store currency"
                      className="w-full"
                    >
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Nav View 3: Products / Customers / Analytics View */
            <Card className="shadow-xs border-border p-8 text-center">
              <CardHeader>
                <CardTitle className="capitalize">{activeNav}</CardTitle>
                <CardDescription>Data view for {activeNav}.</CardDescription>
              </CardHeader>
              <CardContent className="py-6 space-y-4 max-w-sm mx-auto">
                <Progress value={75} aria-label="Module sync progress" />
                <p className="text-xs text-muted-foreground">Syncing data...</p>
                <Button size="sm" onClick={() => setActiveNav('orders')}>
                  Back to Orders
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Command Palette */}
      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <CommandInput placeholder="Type a command or search orders..." />
        <CommandList>
          <CommandEmpty>No matching orders or commands found.</CommandEmpty>
          <CommandGroup heading="Orders">
            {orders.map((ord) => (
              <CommandItem
                key={ord.id}
                onSelect={() => {
                  setIsSearchOpen(false);
                  toast.info(`Selected ${ord.id}`, {
                    description: `${ord.customerName} • ${ord.amount}`,
                  });
                }}
              >
                <ShoppingCart className="mr-2 size-4 text-muted-foreground" />
                <span className="font-semibold">{ord.id}</span>
                <span className="ml-2 text-muted-foreground font-normal">— {ord.customerName}</span>
                <span className="ml-auto font-bold text-foreground">{ord.amount}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => {
                setIsSearchOpen(false);
                setIsNewOrderSheetOpen(true);
              }}
            >
              <Plus className="mr-2 size-4 text-muted-foreground" />
              <span>Create Order</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setIsSearchOpen(false);
                handleExportCSV();
              }}
            >
              <Download className="mr-2 size-4 text-muted-foreground" />
              <span>Export CSV</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}

const meta = {
  title: 'Pages/Admin Dashboard',
  component: AdminDashboardPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A complete E-Commerce Admin Dashboard page demonstrating the assembly of Breadcrumb, Avatar, DropdownMenu, Button, Card, Badge, DataTable, Tabs, Command, Sheet, Select, Switch, Progress, and Toast components.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AdminDashboardPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <AdminDashboardPage />,
};

export const WithNotifications: Story = {
  render: () => <AdminDashboardPage autoToast />,
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => <AdminDashboardPage />,
};
