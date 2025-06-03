'use client';

import { useEffect, useState } from 'react';

export default function ApiTest() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  return <h1>{message}</h1>;
}
