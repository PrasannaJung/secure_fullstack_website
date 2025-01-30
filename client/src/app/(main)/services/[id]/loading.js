export default function Loading() {
  return (
    <div className='container mx-auto p-4'>
      <div className='animate-pulse'>
        <div className='h-8 bg-gray-200 rounded w-1/4 mb-4'></div>
        <div className='h-4 bg-gray-200 rounded w-full mb-4'></div>
        <div className='h-4 bg-gray-200 rounded w-5/6 mb-4'></div>
        <div className='h-6 bg-gray-200 rounded w-1/6'></div>
      </div>
    </div>
  );
}
