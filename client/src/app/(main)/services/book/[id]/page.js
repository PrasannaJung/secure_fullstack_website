import BookService from "@/components/services/BookService";

export default async function BookServicePage({ params }) {
  const { id } = await params;
  return <BookService id={id} />;
}
