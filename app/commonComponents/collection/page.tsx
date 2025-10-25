'use client';

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar, FiDollarSign, FiCheckCircle } from "react-icons/fi";
import { LoadingSpinner } from "@/app/commonComponents/utils/loading";
import { useCollectionPage } from "./hooks";
import PaymentModal from "./modals/paymentModal";
import NoteModal from "./modals/noteModal";
import ErrorModal from "@/app/commonComponents/modals/errorModal";
import { formatCurrency } from "../utils/formatters";
import { CollectionsPageProps, Collection } from "../utils/Types/collection";
import Filter from "../utils/sortAndSearch";
import {
  handleSaveNote,
  handlePrint,
  handleMakePayment,
  handleAddNote,
  handleNoteModalClose,
  handleConfirmPayment,
  handlePaymentModalClose
} from "./functions";

// Main collections page component
export default function CollectionsPage() {
  const {
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    selectedDate, setSelectedDate,
    collections, setCollections,
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
    isPaymentModalVisible, setIsPaymentModalVisible, isPaymentModalAnimating, setIsPaymentModalAnimating,
    isNoteModalVisible, setIsNoteModalVisible, isNoteModalAnimating, setIsNoteModalAnimating,
    tableRef, Wrapper,
    totalCollected, totalTarget, targetAchieved,
    totalPayments, completedPayments, collectionRate,
    overallTotalCollected, overallTotalTarget, overallTargetAchieved,
    overallTotalPayments, overallCompletedPayments, overallCollectionRate
  } = useCollectionPage();

  const [paymentLoading, setPaymentLoading] = React.useState(false); 
  const [loading, setLoading] = useState(false);

  return (
    <Wrapper>
      <div className="min-h-screen bg-gray-50">
        <div className={isMobile ? "mx-auto px-2 py-4" : "mx-auto px-6 py-8"}>

          {/* Calendar & Stats Section */}
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
                      const colDate = new Date(col.dueDate || new Date());
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

          {/* Filter & Search */}
          <Filter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOptions={[
              { value: "amount", label: t.l9 },
              { value: "balance", label: t.l14 },
              { value: "status", label: t.l15 },
            ]}
            t={t}
            isMobile={isMobile}
          />

          {/* Print Button */}
          <div className={isMobile ? "flex justify-end mb-2" : "flex justify-end mb-4"}>
          <button
            onClick={() => handlePrint(setPrintMode)}
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
                          <button
                            onClick={() =>
                              handleMakePayment(
                                col, 
                                setSelectedCollection,
                                setPaymentAmount,
                                setShowModal
                              )
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium"
                          >
                            Make Payment
                          </button>
                        ) : (
                          <span className="text-green-600 text-xs">Paid</span>
                        )}
                        <button
                          onClick={() =>
                            handleAddNote(
                              col,
                              setSelectedCollection,
                              setNoteText,
                              setShowNoteModal
                            )
                          }
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium"
                        >
                          {col.note?.trim() ? "Edit Note" : "Add Note"}
                        </button>
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
            paymentLoading={paymentLoading}
            handleClose={() => handlePaymentModalClose(
              setIsPaymentModalAnimating,
              setShowModal,
              setIsPaymentModalVisible,
              setSelectedCollection,
              setPaymentAmount
            )}
            handleConfirmPayment={() => handleConfirmPayment(
              selectedCollection,
              paymentAmount,
              setCollections,
              setPaymentLoading,
              setShowPaymentConfirm,
              setErrorMsg,
              setShowErrorModal,
              () => handlePaymentModalClose(
                setIsPaymentModalAnimating,
                setShowModal,
                setIsPaymentModalVisible,
                setSelectedCollection,
                setPaymentAmount
              )
            )}
          />

          <NoteModal
            isOpen={isNoteModalVisible}
            isAnimating={isNoteModalAnimating}
            selectedCollection={selectedCollection}
            noteText={noteText}
            setNoteText={setNoteText}
            handleClose={() => handlePaymentModalClose(
              setIsPaymentModalAnimating,
              setShowModal,
              setIsPaymentModalVisible,
              setSelectedCollection,
              setPaymentAmount
            )}
            handleSaveNote={() => handleSaveNote(
              selectedCollection,
              noteText,
              setCollections,
              setErrorMsg,
              setShowErrorModal,
              () => handleNoteModalClose(
                setIsNoteModalAnimating,
                setShowNoteModal,
                setIsNoteModalVisible,
                setSelectedCollection,
                setNoteText
              )
            )}
          />

          {showErrorModal && <ErrorModal isOpen={showErrorModal} message={errorMsg} onClose={() => setShowErrorModal(false)} />}
        </div>
      </div>
    </Wrapper>
  );
}
