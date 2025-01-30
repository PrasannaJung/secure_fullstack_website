import OrderDetails from "@/components/services/OrderDetails";

export default async function OrderDetailPage({ params }) {
  const { id } = await params;

  return <OrderDetails id={id} />;
}
