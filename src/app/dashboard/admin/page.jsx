import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BarChart3, Package, ShoppingBag, Users } from "lucide-react";

// Dashboard data constants
const STAT_CARDS = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    icon: ShoppingBag,
  },
  {
    title: "Products",
    value: "+2350",
    change: "+180 new products",
    icon: Package,
  },
  {
    title: "Orders",
    value: "+12,234",
    change: "+19% from last month",
    icon: ShoppingBag,
  },
  {
    title: "Active Users",
    value: "+573",
    change: "+201 since last hour",
    icon: Users,
  },
];

const RECENT_ORDERS = Array.from({ length: 5 }).map((_, i) => ({
  id: 1000 + i,
  status: i % 2 === 0 ? "Pending" : "Completed",
  amount: `$${(Math.random() * 100).toFixed(2)}`,
}));

async function getDetails(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch (err) {
    console.error(`Error fetching: ${url}`, err);
    return null;
  }
}
export default async function AdminDashboard() {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://45.117.153.186/api";

  const [venderDetail] = await Promise.all([
    getDetails(`${baseUrl}/getvendordash`),
  ]);

  console.log(venderDetail);
  return (
    <div className="flex flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center gap-4 px-4 max-w-7xl  mx-auto">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="max-w-7xl  mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STAT_CARDS.map((card) => (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  You made 265 sales this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] rounded-md border bg-muted/50 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>You have 12 pending orders.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {RECENT_ORDERS.map((order) => (
                    <div key={order.id} className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-md bg-muted/50 flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Order #{order.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.status}
                        </div>
                      </div>
                      <div className="font-medium">{order.amount}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
