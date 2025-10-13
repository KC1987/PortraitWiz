'use client';

import {useState} from 'react';
import {useAtomValue} from "jotai";
import {authAtom} from "@/lib/atoms";


export default function ButtonCheckout({ amount, credits }) {
  const { user } = useAtomValue(authAtom);

  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);


    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          amount,
          credits,
          userId: user?.id,
          email: user?.email || "no.email.found@sample.com"
        }),
      });

      const {url} = await response.json();

      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <button className='text-xl bg-lime-200 p-6 rounded-md' onClick={handleCheckout} disabled={isLoading}>
      {isLoading ? 'Loading...' : `Stripe Test: Buy ${credits}`}
    </button>
  );
}