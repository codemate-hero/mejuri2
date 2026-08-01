"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Filter, LoaderCircle, PackageSearch, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

type ShippingAddress = {
  fullName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

type Order = {
  _id: string;
  items?: Array<{ quantity?: number }>;
  shippingAddress?: ShippingAddress;
  totalAmount?: number;
  currency?: string;
  paymentStatus?: string;
  orderStatus?: string;
  createdAt?: string;
};

type Filters = {
  city: string;
  state: string;
  address: string;
};

const emptyFilters: Filters = {
  city: "",
  state: "",
  address: "",
};

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  processing: "bg-blue-50 text-blue-700 ring-blue-600/20",
  shipped: "bg-violet-50 text-violet-700 ring-violet-600/20",
  failed: "bg-red-50 text-red-700 ring-red-600/20",
  cancelled: "bg-red-50 text-red-700 ring-red-600/20",
  refunded: "bg-slate-100 text-slate-700 ring-slate-600/20",
};

function StatusBadge({ status }: { status?: string }) {
  const label = status || "unknown";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${
        statusStyles[label] || "bg-slate-100 text-slate-700 ring-slate-600/20"
      }`}
    >
      {label}
    </span>
  );
}

function formatMoney(amount = 0, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
  }
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatAddress(address?: ShippingAddress) {
  if (!address) return "—";

  return [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ") || "—";
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<Filters>(emptyFilters);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkAdminAccess() {
      const token = window.localStorage.getItem("token");

      if (!token) {
        router.replace("/");
        return;
      }

      try {
        const response = await fetch("/api/auth/admin", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (!response.ok) {
          router.replace("/");
          return;
        }

        setIsAdmin(true);
      } catch {
        router.replace("/");
      } finally {
        setCheckingAccess(false);
      }
    }

    void checkAdminAccess();
  }, [router]);

  const fetchOrders = useCallback(async (activeFilters: Filters) => {
    setLoading(true);
    setError("");

    const searchParams = new URLSearchParams();
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value.trim()) searchParams.set(key, value.trim());
    });

    try {
      const token = window.localStorage.getItem("token");
      const response = await fetch(
        `/api/admin/orders${
          searchParams.size ? `?${searchParams.toString()}` : ""
        }`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Unable to fetch orders."
        );
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (fetchError) {
      setOrders([]);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to fetch orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const timeoutId = window.setTimeout(() => {
      void fetchOrders(emptyFilters);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchOrders, isAdmin]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextFilters = { ...filters };
    setAppliedFilters(nextFilters);
    void fetchOrders(nextFilters);
  };

  const handleReset = () => {
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    void fetchOrders(emptyFilters);
  };

  const hasAppliedFilters = Object.values(appliedFilters).some(Boolean);

  if (checkingAccess || !isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f7f9]">
        <LoaderCircle
          aria-label="Checking admin access"
          className="animate-spin text-slate-700"
          size={28}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            Admin
          </p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Orders
              </h1>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                View and filter orders by their shipping destination.
              </p>
            </div>
            <div className="rounded-xl bg-white px-4 py-2 text-sm shadow-sm ring-1 ring-slate-200">
              <span className="text-slate-500">Results</span>{" "}
              <span className="font-bold text-slate-950">{orders.length}</span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <Filter aria-hidden="true" size={18} />
            <h2 className="font-semibold">Shipping address filters</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-[1fr_1fr_1.4fr_auto] xl:items-end">
            {(["city", "state", "address"] as const).map((name) => (
              <label key={name} className="block">
                <span className="mb-1.5 block text-sm font-medium capitalize text-slate-700">
                  {name}
                </span>
                <input
                  type="search"
                  value={filters[name]}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      [name]: event.target.value,
                    }))
                  }
                  placeholder={`Filter by ${name}`}
                  maxLength={name === "address" ? 200 : 100}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                />
              </label>
            ))}

            <div className="flex gap-2 md:col-span-3 xl:col-span-1">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <LoaderCircle
                    aria-hidden="true"
                    className="animate-spin"
                    size={17}
                  />
                ) : (
                  <Filter aria-hidden="true" size={17} />
                )}
                Apply
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={loading && !hasAppliedFilters}
                aria-label="Reset filters"
                title="Reset filters"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw aria-hidden="true" size={17} />
              </button>
            </div>
          </div>
        </form>

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          {error ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
              <PackageSearch
                aria-hidden="true"
                className="mb-3 text-red-500"
                size={38}
              />
              <h2 className="font-semibold">Couldn&apos;t load orders</h2>
              <p className="mt-1 max-w-md text-sm text-slate-600">{error}</p>
              <button
                type="button"
                onClick={() => void fetchOrders(appliedFilters)}
                className="mt-5 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
              >
                Try again
              </button>
            </div>
          ) : loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-600">
              <LoaderCircle
                aria-hidden="true"
                className="animate-spin"
                size={22}
              />
              Loading orders…
            </div>
          ) : orders.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
              <PackageSearch
                aria-hidden="true"
                className="mb-3 text-slate-400"
                size={42}
              />
              <h2 className="font-semibold">No orders found</h2>
              <p className="mt-1 text-sm text-slate-600">
                {hasAppliedFilters
                  ? "Try changing or resetting the shipping filters."
                  : "Orders will appear here once they are available."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px] border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Order</th>
                    <th className="px-5 py-4 font-semibold">Date</th>
                    <th className="px-5 py-4 font-semibold">Customer</th>
                    <th className="px-5 py-4 font-semibold">Shipping address</th>
                    <th className="px-5 py-4 font-semibold">Items</th>
                    <th className="px-5 py-4 font-semibold">Total</th>
                    <th className="px-5 py-4 font-semibold">Payment</th>
                    <th className="px-5 py-4 font-semibold">Order status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {orders.map((order) => {
                    const itemCount =
                      order.items?.reduce(
                        (total, item) => total + (item.quantity || 0),
                        0
                      ) || 0;

                    return (
                      <tr
                        key={order._id}
                        className="align-top transition hover:bg-slate-50/70"
                      >
                        <td className="whitespace-nowrap px-5 py-4 font-semibold">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          {order.shippingAddress?.fullName || "—"}
                        </td>
                        <td className="max-w-[330px] px-5 py-4 leading-5 text-slate-600">
                          {formatAddress(order.shippingAddress)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          {itemCount}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 font-semibold">
                          {formatMoney(order.totalAmount, order.currency)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={order.paymentStatus} />
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={order.orderStatus} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
