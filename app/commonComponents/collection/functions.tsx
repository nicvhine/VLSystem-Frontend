import { Collection } from "./types";

// Printing Sheet
export const handlePrint = (setPrintMode: (v: boolean) => void) => {
  setPrintMode(true);
  setTimeout(() => {
    window.print();
    setPrintMode(false);
  }, 100);
};

// Open Payment Modal
export const handleMakePayment = (
  collection: Collection,
  setSelectedCollection: (col: Collection | null) => void,
  setPaymentAmount: (amount: number) => void,
  setShowModal: (v: boolean) => void
) => {
  setSelectedCollection(collection);
  setPaymentAmount(collection.periodAmount - collection.paidAmount);
  setShowModal(true);
};

// Open Note Modal
export const handleAddNote = (
  collection: Collection,
  setSelectedCollection: (col: Collection | null) => void,
  setNoteText: (text: string) => void,
  setShowNoteModal: (v: boolean) => void
) => {
  setSelectedCollection(collection);
  setNoteText(collection.note || "");
  setShowNoteModal(true);
};

// Close Payment Modal
export const handlePaymentModalClose = (
  setIsPaymentModalAnimating: (v: boolean) => void,
  setShowModal: (v: boolean) => void,
  setIsPaymentModalVisible: (v: boolean) => void,
  setSelectedCollection: (col: Collection | null) => void,
  setPaymentAmount: (amount: number) => void
) => {
  setIsPaymentModalAnimating(false);
  setTimeout(() => {
    setShowModal(false);
    setIsPaymentModalVisible(false);
    setSelectedCollection(null);
    setPaymentAmount(0);
  }, 150);
};

// Close Note Modal
export const handleNoteModalClose = (
  setIsNoteModalAnimating: (v: boolean) => void,
  setShowNoteModal: (v: boolean) => void,
  setIsNoteModalVisible: (v: boolean) => void,
  setSelectedCollection: (col: Collection | null) => void,
  setNoteText: (text: string) => void
) => {
  setIsNoteModalAnimating(false);
  setTimeout(() => {
    setShowNoteModal(false);
    setIsNoteModalVisible(false);
    setSelectedCollection(null);
    setNoteText("");
  }, 150);
};

// Confirm Payment
export const handleConfirmPayment = async (
  selectedCollection: Collection | null,
  paymentAmount: number,
  setCollections: (cb: (prev: Collection[]) => Collection[]) => void,
  setPaymentLoading: (v: boolean) => void,
  setShowPaymentConfirm: (v: boolean) => void,
  setErrorMsg: (msg: string) => void,
  setShowErrorModal: (v: boolean) => void,
  handleClose: () => void
) => {
  if (!selectedCollection) return;
  setPaymentLoading(true);

  try {
    const response = await fetch(
      `http://localhost:3001/payments/${selectedCollection.referenceNumber}/cash`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: paymentAmount }),
      }
    );

    if (!response.ok) throw new Error("Failed to post payment");

    const updatedCollection: Collection = await response.json();

    setCollections((prev) =>
      prev.map((col) =>
        col.referenceNumber === updatedCollection.referenceNumber
          ? updatedCollection
          : col
      )
    );
  } catch (err) {
    console.error("Payment failed:", err);
    setErrorMsg("Payment failed.");
    setShowErrorModal(true);
  } finally {
    setPaymentLoading(false);
    setShowPaymentConfirm(false);
    handleClose(); 
  }
};

// Save Note
export const handleSaveNote = async (
  selectedCollection: Collection | null,
  noteText: string,
  setCollections: (cb: (prev: Collection[]) => Collection[]) => void,
  setErrorMsg: (msg: string) => void,
  setShowErrorModal: (v: boolean) => void,
  handleClose: () => void
) => {
  if (!selectedCollection) return;

  try {
    const response = await fetch(
      `http://localhost:3001/collections/${selectedCollection.referenceNumber}/note`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: noteText }),
      }
    );

    if (!response.ok) throw new Error("Failed to save note");

    const updatedCollection: Collection = await response.json();

    setCollections((prev) =>
      prev.map((col) =>
        col.referenceNumber === updatedCollection.referenceNumber
          ? updatedCollection
          : col
      )
    );
  } catch (err) {
    console.error("Saving note failed:", err);
    setErrorMsg("Failed to save note.");
    setShowErrorModal(true);
  } finally {
    handleClose(); 
  }
};
