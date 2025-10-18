'use client';

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiSearch, FiChevronDown, FiCalendar, FiDollarSign, FiCheckCircle } from "react-icons/fi";

import { useCollectionPage } from "./hooks";
import PaymentModal from "./modals/paymentModal";
import NoteModal from "./modals/noteModal";
import ErrorModal from "@/app/commonComponents/modals/errorModal/modal";
import { formatCurrency } from "../utils/formatters";
import { CollectionsPageProps, Collection} from "./types";

const LoadingSpinner = () => <div className="py-6 text-center">Loading...</div>;

export default function CollectionsPage({ onModalStateChange }: CollectionsPageProps) {
  const {
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    selectedDate, setSelectedDate,
    collections, loading,
    filteredCollections,
    selectedCollection, setSelectedCollection,
    paymentAmount, setPaymentAmount,
    showPaymentConfirm, setShowPaymentConfirm,
    showModal, setShowModal,
    showNoteModal, setShowNoteModal,
    noteText, setNoteText,
    role, t, s, b, isMobile,
    printMode, setPrintMode,
    showErrorModal, setShowErrorModal,
    errorMsg, setErrorMsg,
    isPaymentModalVisible, isPaymentModalAnimating,
    isNoteModalVisible, isNoteModalAnimating,
    tableRef, Wrapper,
    totalCollected, totalTarget, targetAchieved,
    totalPayments, completedPayments, collectionRate,
    overallTotalCollected, overallTotalTarget, overallTargetAchieved,
    overallTotalPayments, overallCompletedPayments, overallCollectionRate
  } = useCollectionPage(onModalStateChange);

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 100);
  };

  const handleMakePayment = (col: Collection) => {
    setSelectedCollection(col);
    setPaymentAmount(col.periodBalance);
    setShowModal(true);
  };

  const handleAddNote = (col: Collection) => {
    setSelectedCollection(col);
    setNoteText(col.note || "");
    setShowNoteModal(true);
  };

  const handlePaymentModalClose = () => setShowModal(false);
  const handleNoteModalClose = () => setShowNoteModal(false);

  const handleConfirmPayment = () => {
    console.log("Confirm payment for:", selectedCollection);
    setShowPaymentConfirm(false);
    setShowModal(false);
  };

  const handleSaveNote = () => {
    console.log("Save note for:", selectedCollection, noteText);
    setShowNoteModal(false);
  };

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-50">
        <div className={isMobile ? "mx-auto px-2 py-4" : "mx-auto px-6 py-8"}>
          {/* Calendar & Stats */}
          <div className={isMobile ? "flex flex-col gap-4 mb-4" : "grid grid-cols-12 gap-6 mb-6"}>
            {/* Calendar */}
            <div className={isMobile ? "bg-white rounded-xl p-4 shadow-sm" : "col-span-4 bg-white rounded-xl p-6 shadow-sm"}>
              <div className="flex items-center gap-2 mb-4">
                <FiCalendar className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-800">{t.Collection}</h2>
              </div>
              <div className="flex flex-col items-center gap-4">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => date && setSelectedDate(date)}
                  inline
                  dayClassName={(date) => {
                    const hasCollection = collections.some(col => {
                      const colDate = new Date(col.dueDate);
                      return colDate.toDateString() === date.toDateString();
                    });
                    return hasCollection ? 'relative has-collection bg-blue-100 text-blue-800 font-semibold rounded-full' : '';
                  }}
                  calendarClassName="rounded-lg border border-gray-200 shadow-sm"
                  wrapperClassName="w-full"
                />
                <div className="text-blue-600 font-medium">{selectedDate.toDateString()}</div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className={isMobile ? "flex flex-col gap-4" : "col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6"}>
              {/* Daily Progress */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg flex items-center gap-4 hover:shadow-xl transition">
                <div className="bg-blue-100 p-4 rounded-full shadow-sm">
                  <FiCheckCircle className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{s.h5}</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">{collectionRate}%</h3>
                  <p className="text-sm text-gray-400">{completedPayments} of {totalPayments} payments</p>
                </div>
              </div>

              {/* Daily Amount */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg flex items-center gap-4 hover:shadow-xl transition">
                <div className="bg-green-100 p-4 rounded-full shadow-sm">
                  <FiDollarSign className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{s.h6}</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">{formatCurrency(totalCollected)}</h3>
                  <p className="text-sm text-gray-400">of {formatCurrency(totalTarget)} ({targetAchieved}%)</p>
                </div>
              </div>

              {/* Overall Progress */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg flex items-center gap-4 hover:shadow-xl transition">
                <div className="bg-purple-100 p-4 rounded-full shadow-sm">
                  <FiCheckCircle className="text-purple-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{s.h7}</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">{overallCollectionRate}%</h3>
                  <p className="text-sm text-gray-400">{overallCompletedPayments} of {overallTotalPayments} payments</p>
                </div>
              </div>

              {/* Overall Amount */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg flex items-center gap-4 hover:shadow-xl transition">
                <div className="bg-indigo-100 p-4 rounded-full shadow-sm">
                  <FiDollarSign className="text-indigo-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{s.h8}</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">{formatCurrency(overallTotalCollected)}</h3>
                  <p className="text-sm text-gray-400">of {formatCurrency(overallTotalTarget)} ({overallTargetAchieved}%)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className={isMobile ? "flex flex-col gap-2 mb-4" : "flex gap-4 mb-6"}>
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder={t.l22}
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-200 text-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className={isMobile ? "relative w-full" : "relative min-w-[160px]"}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-gray-600"
              >
                <option value="">Sort By</option>
                <option value="amount">{t.l9}</option>
                <option value="balance">{t.l14}</option>
                <option value="status">{t.l15}</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <FiChevronDown className="text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Print Button */}
          <div className={isMobile ? "flex justify-end mb-2" : "flex justify-end mb-4"}>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm sm:text-base"
            >
              {b.b11}
            </button>
          </div>

          {/* Collections Table */}
          <div ref={tableRef} className={isMobile ? "bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto" : "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"}>
            <table className="min-w-[700px] w-full divide-y divide-gray-200 text-xs sm:text-sm">
              <thead>
                <tr>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">{t.l43}</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">{t.l11}</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">{t.l12}</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">{t.l14}</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">{t.l9}</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">{t.l42}</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">{t.l41}</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">{t.l15}</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">{t.l44}</th>
                  {role === "collector" && <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-600">{t.l16}</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={role === "collector" ? 11 : 10}><LoadingSpinner /></td></tr>
                ) : filteredCollections.length === 0 ? (
                  <tr><td colSpan={role === "collector" ? 11 : 10} className="text-center py-6 text-gray-500">No collections found.</td></tr>
                ) : filteredCollections.map((col: Collection) => (
                  <tr key={col.referenceNumber} className="hover:bg-blue-50/60">
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{col.referenceNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{col.loanId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{col.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(col.loanBalance)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(col.periodAmount)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(col.paidAmount)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(col.periodBalance)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        col.status === "Paid" ? "bg-green-100 text-green-800" :
                        col.status === "Partial" ? "bg-yellow-100 text-yellow-800" :
                        col.status === "Overdue" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-600"
                      }`}>{col.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{col.note}</td>
                    {role === "collector" && (
                      <td className="px-6 py-4 flex flex-col gap-1">
                        {col.periodBalance > 0 ? (
                          <button onClick={() => handleMakePayment(col)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium">Make Payment</button>
                        ) : <span className="text-green-600 text-xs">Paid</span>}
                        <button onClick={() => handleAddNote(col)} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium">{col.note?.trim() ? "Edit Note" : "Add Note"}</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modals */}
          <PaymentModal
            isOpen={isPaymentModalVisible}
            isAnimating={isPaymentModalAnimating}
            selectedCollection={selectedCollection}
            paymentAmount={paymentAmount}
            setPaymentAmount={setPaymentAmount}
            showPaymentConfirm={showPaymentConfirm}
            setShowPaymentConfirm={setShowPaymentConfirm}
            handleClose={handlePaymentModalClose}
            handleConfirmPayment={handleConfirmPayment}
            paymentLoading={false}
          />
          <NoteModal
            isOpen={isNoteModalVisible}
            isAnimating={isNoteModalAnimating}
            selectedCollection={selectedCollection}
            noteText={noteText}
            setNoteText={setNoteText}
            handleClose={handleNoteModalClose}
            handleSaveNote={handleSaveNote}
          />
          {showErrorModal && <ErrorModal isOpen={showErrorModal} message={errorMsg} onClose={() => setShowErrorModal(false)} />}
        </div>
      </div>
    </Wrapper>
  );
}
