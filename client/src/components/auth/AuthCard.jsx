import Image from "next/image";

export default function AuthCard() {
  return (
    <div className='h-full flex flex-col justify-between bg-primary-default rounded-md px-8 py-4 text-secondary-100'>
      <Image
        src='/primary_logo_white.svg'
        alt='Ghar Sahayog'
        width={180}
        height={38}
        priority
      />
      <div>
        <h3 className='text-5xl font-semibold'>
          Experience comfort and convenience with us
        </h3>
        <p className='mt-8 text-xl'>
          Explore Nepal’s finest home services providers and order your
          necessary needs from the tap of your finger
        </p>
      </div>
      <div className='flex flex-col gap-5 px-8 py-4 rounded-md bg-primary-500'>
        <p>
          I found this website really useful. I was really satisfied with the
          electrical repairing service that they provided at a very ecomonical
          rate.
        </p>
        <div className='flex gap-4 items-center'>
          {/* <div className='w-16 h-16 rounded-[50%] bg-gray-300'></div> */}
          <p>Prasanna Jung Thapa</p>
        </div>
      </div>
    </div>
  );
}
