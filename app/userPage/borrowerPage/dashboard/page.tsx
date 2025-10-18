'use client';

import React from 'react';
import Borrower from '../page';
import ErrorModal from '@/app/commonComponents/modals/errorModal/modal';
import TermsGateModal from '@/app/commonComponents/modals/termsPrivacy/TermsGateModal';
import TermsContentModal from '@/app/commonComponents/modals/termsPrivacy/TermsContentModal';
import PrivacyContentModal from '@/app/commonComponents/modals/termsPrivacy/PrivacyContentModal';
import PaymentHistoryModal from '@/app/commonComponents/modals/paymentHistoryModal/modal';

import useBorrowerDashboard from './hooks';
import translations from '@/app/commonComponents/Translation';

// Cards
import LoanDetailsCard from './cards/loanDetailsCard';
import PaymentHistoryCard from './cards/paymentHistoryCard';
import PaymentProgressCard from './cards/paymentProgressCard';
import UpcomingCollectionCard from './cards/upcomingCard';
import PaidCollectionCard from './cards/paidCollectionCard';

export default function BorrowerDashboard() {
  const borrowersId = typeof window !== 'undefined' ? localStorage.getItem('borrowersId') : null;
  const dashboard = useBorrowerDashboard(borrowersId);

  const {
    activeLoan,
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
    language
  } = dashboard;

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const upcoming = activeLoan ? collections.filter(c => c.borrowersId === borrowersId && c.loanId === activeLoan.loanId && c.status !== 'Paid') : [];
  const paid = activeLoan ? collections.filter(c => c.borrowersId === borrowersId && c.loanId === activeLoan.loanId && c.status === 'Paid') : [];

  return (
    <Borrower>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4">
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <LoanDetailsCard activeLoan={activeLoan} />
          <div className="flex gap-4">
            <PaymentHistoryCard paidPayments={paidPayments} setIsPaymentModalOpen={setIsPaymentModalOpen} />
            <PaymentProgressCard collections={collections} paymentProgress={paymentProgress} />
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
                  activeLoan={activeLoan!}
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
              {paid.map(c => <PaidCollectionCard key={c.collectionNumber} collection={c} />)}
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
          <ErrorModal isOpen={showErrorModal} message={errorMsg} onClose={() => setShowErrorModal(false)} />
        )}

        {showTermsModal && (
          <TermsGateModal
            language={language}
            onCancel={() => { setShowTermsModal(false); try { localStorage.setItem('termsReminderSeenAt', String(Date.now())); } catch {} }}
            onOpenTos={() => setShowTosContent(true)}
            onOpenPrivacy={() => setShowPrivacyContent(true)}
            tosRead={tosRead}
            privacyRead={privacyRead}
            onAccept={() => { setShowTermsModal(false); try { localStorage.setItem('termsReminderSeenAt', String(Date.now())); } catch {} }}
          />
        )}

        {showTosContent && <TermsContentModal language={language} onClose={() => setShowTosContent(false)} onReadComplete={() => setTosRead(true)} />}
        {showPrivacyContent && <PrivacyContentModal language={language} onClose={() => setShowPrivacyContent(false)} onReadComplete={() => setPrivacyRead(true)} />}
      </div>
    </Borrower>
  );
}
