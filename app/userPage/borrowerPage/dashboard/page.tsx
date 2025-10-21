'use client';

import React from 'react';
import Borrower from '../page';
import ErrorModal from '@/app/commonComponents/modals/errorModal/modal';
import TermsGateModal from '@/app/commonComponents/modals/termsPrivacy/TermsGateModal';
import TermsContentModal from '@/app/commonComponents/modals/termsPrivacy/TermsContentModal';
import PrivacyContentModal from '@/app/commonComponents/modals/termsPrivacy/PrivacyContentModal';
import PaymentHistoryModal from '@/app/commonComponents/modals/paymentHistoryModal/modal';
import { LoadingSpinner } from '@/app/commonComponents/utils/loading';

import useBorrowerDashboard from './hooks';

// Cards
import LoanDetailsCard from './cards/loanDetailsCard';
import PaymentHistoryCard from './cards/paymentHistoryCard';
import PaymentProgressCard from './cards/paymentProgressCard';
import UpcomingCollectionCard from './cards/upcomingCard';
import PaidCollectionCard from './cards/paidCollectionCard';

export default function BorrowerDashboard() {
  const borrowersId =
    typeof window !== 'undefined' ? localStorage.getItem('borrowersId') : null;

  const dashboard = useBorrowerDashboard(borrowersId);

  const {
    activeLoan,
    allLoans,
    collections,
    paidPayments,
    paymentProgress,
    loading,
    error,
    showErrorModal,
    setShowErrorModal,
    errorMsg,
    setErrorMsg,
    showTermsModal,
    setShowTermsModal,
    showTosContent,
    setShowTosContent,
    showPrivacyContent,
    setShowPrivacyContent,
    tosRead,
    setTosRead,
    privacyRead,
    setPrivacyRead,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    paymentModalAnimateIn,
    language,
    t,
  } = dashboard;

  // Reset terms reads each time modal opens
  React.useEffect(() => {
    if (showTermsModal) {
      setTosRead(false);
      setPrivacyRead(false);
    }
  }, [showTermsModal, setTosRead, setPrivacyRead]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    );

  if (error) return <p className="text-red-600">{error}</p>;

  // Pick active loan or fallback to latest loan
  const displayedLoan =
    activeLoan ||
    (allLoans?.length
      ? allLoans.reduce((prev, curr) =>
          new Date(prev.dateDisbursed || 0) > new Date(curr.dateDisbursed || 0)
            ? prev
            : curr
        )
      : null);

  const borrowerId = displayedLoan?.borrowersId || borrowersId || '';

  const upcoming = displayedLoan
    ? collections.filter(
        (c) =>
          c.borrowersId === borrowerId &&
          c.loanId === displayedLoan.loanId &&
          c.status !== 'Paid'
      )
    : [];

  const paid = displayedLoan
    ? collections.filter(
        (c) =>
          c.borrowersId === borrowerId &&
          c.loanId === displayedLoan.loanId &&
          c.status === 'Paid'
      )
    : [];

  return (
    <Borrower>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4">
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <LoanDetailsCard activeLoan={displayedLoan} language={language} />
          <div className="flex gap-4">
            <PaymentHistoryCard
              paidPayments={paidPayments}
              setIsPaymentModalOpen={setIsPaymentModalOpen}
            />
            {/* ✅ Pass borrowerId safely */}
            <PaymentProgressCard
              collections={collections}
              paymentProgress={paymentProgress}
              borrowerId={borrowerId}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-screen">
          <h3 className="text-xl font-semibold">Upcoming Bills</h3>
          {upcoming.length > 0 ? (
            upcoming.map((collection, i) => {
              const canPay = i === 0 || upcoming[i - 1].status === 'Paid';
              return (
                <UpcomingCollectionCard
                  key={collection.collectionNumber}
                  collection={collection}
                  activeLoan={displayedLoan!}
                  canPay={canPay}
                  setErrorMsg={setErrorMsg}
                  setShowErrorModal={setShowErrorModal}
                />
              );
            })
          ) : (
            <p>No upcoming bills.</p>
          )}

          {paid.length > 0 && (
            <>
              <h4 className="text-lg font-semibold mt-4">Paid Collections</h4>
              {paid.map((c) => (
                <PaidCollectionCard key={c.collectionNumber} collection={c} />
              ))}
            </>
          )}
        </div>

        <PaymentHistoryModal
          isOpen={isPaymentModalOpen}
          animateIn={paymentModalAnimateIn}
          onClose={() => setIsPaymentModalOpen(false)}
          paidPayments={paidPayments}
        />

        {showErrorModal && (
          <ErrorModal
            isOpen={showErrorModal}
            message={errorMsg}
            onClose={() => setShowErrorModal(false)}
          />
        )}

        {showTermsModal && (
          <TermsGateModal
            language={language}
            onCancel={() => {}}
            onOpenTos={() => setShowTosContent(true)}
            onOpenPrivacy={() => setShowPrivacyContent(true)}
            tosRead={tosRead}
            privacyRead={privacyRead}
            acceptLabel={
              language === 'en'
                ? 'Accept and continue'
                : 'Mouyon ug mopadayon'
            }
            onAccept={() => {
              setShowTermsModal(false);
              try {
                localStorage.setItem('termsReminderSeenAt', String(Date.now()));
              } catch {}
            }}
            showCloseIcon={false}
            showCancelButton={false}
          />
        )}

        {showTosContent && (
          <TermsContentModal
            language={language}
            onClose={() => setShowTosContent(false)}
            onReadComplete={() => setTosRead(true)}
          />
        )}
        {showPrivacyContent && (
          <PrivacyContentModal
            language={language}
            onClose={() => setShowPrivacyContent(false)}
            onReadComplete={() => setPrivacyRead(true)}
          />
        )}
      </div>
    </Borrower>
  );
}
