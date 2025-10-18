import { Collection, Loan } from "./type";

const API_URL = 'http://localhost:3001';

// Payment handler
export async function handlePay(
  collection: Collection,
  activeLoan: Loan | null,
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>,
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (!activeLoan) return;

  const amountToPay = collection.periodAmount ?? 0;
  if (amountToPay <= 0) {
    setErrorMsg('This collection has no amount due.');
    setShowErrorModal(true);
    return;
  }

  try {
    const res = await fetch(`${API_URL}/payments/paymongo/gcash`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amountToPay,
        collectionNumber: collection.collectionNumber,
        referenceNumber: collection.referenceNumber,
        borrowersId: activeLoan.borrowersId,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      setErrorMsg(`Payment failed: ${errorData.error || 'Unknown error'}`);
      setShowErrorModal(true);
      return;
    }

    const data = await res.json();
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      setErrorMsg('Failed to create payment.');
      setShowErrorModal(true);
    }
  } catch (err) {
    console.error(err);
    setErrorMsg('Error connecting to payment gateway.');
    setShowErrorModal(true);
  }
}
