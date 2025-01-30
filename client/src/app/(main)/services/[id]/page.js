import SingleServiceComponent from "@/components/services/SingleService";

export default async function SingleServicePage({ params }) {
  const { id } = await params;
  return <SingleServiceComponent id={id} />;
}
