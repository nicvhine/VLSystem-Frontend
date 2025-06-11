"use client";

import { useState, useEffect } from 'react';
import Navbar from '../../navbar';
import { FiUser, FiDollarSign, FiFileText, FiPaperclip, FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import Link from 'next/link';

const API_URL = "http://localhost:3001/loan-applications";

interface Application {
  applicationId: string;
  appName: string;
  appDob: string;
  appContact: string;
  appEmail: string;
  appMarital: string;
  appChildren: number;
  appSpouseName: string;
  appSpouseOccupation: string;
  appAddress: string;
  appEmploymentStatus: string;
  appOccupation: string;
  appCompanyName: string;
  appMonthlyIncome: string;
  appLoanPurpose: string;
  appLoanAmount: string;
  appLoanTerms: string;
  appInterest: Int32Array;
  companyName: string;
  companyAddress: string;
  monthlyIncome: number;
  lengthOfService: string;
  otherIncome: number;
  appTypeBusiness: string;
  appDateStarted: string;
  appBusinessLoc: string
  loanPurpose: string;
  loanAmount: number;
  loanType: string;
  loanTerm: string;
  interestRate: number;
  paymentSchedule: string;
  uploadedDocuments: string[]; 
  sourceOfIncome: string;
}


interface Note {
  text: string;
  date: string;
}

export default function ApplicationDetailsPage({ params }: { params: { id: string } }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
   
     useEffect(() => {
       const fetchApplications = async () => {
         try {
           const response = await fetch (API_URL);
           const data = await response.json();
           setApplications(data);
         } catch (error) {
           console.error("Failed to fetch applications:", error);
         } finally {
           setLoading(false);
         }
       };
   
       fetchApplications();
     }, []);



  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const application = applications.find(app => app.applicationId === params.id);

  if (!application && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-10 text-center text-gray-600 text-lg">
          Application not found.
        </div>
      </div>
    );
  }

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment: Note = {
        text: comment,
        date: new Date().toLocaleDateString('en-PH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setComments([newComment, ...comments]);
      setComment('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <Link
              href="/components/loanOfficer/applications"
              className="inline-flex items-center text-black hover:text-gray-600 mb-2 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Applications
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{params.id} - {application?.loanType}</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap">
              Generate Loan Agreement
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap">
              Deny Application
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left and center columns combined for larger screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <section className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FiUser className="w-5 h-5 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-base text-gray-800 mt-1">
                  {application?.appName || '—'}
                </p>
              </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="text-base text-gray-800 mt-1">
                  {application?.appDob || '—'}
                </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact Number</p>
                  <p className="text-base text-gray-800 mt-1">
                  {application?.appContact || '—'}
                </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="text-base text-gray-800 mt-1">
                  {application?.appEmail || '—'}
                </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Marital Status</p>
                  <p className="text-base text-gray-800 mt-1">
                  {application?.appMarital || '—'}
                </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Number of Children</p>
                   <p className="text-base text-gray-800 mt-1">
                  {application?.appChildren || '—'}
                </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Home Address</p>
                   <p className="text-base text-gray-800 mt-1">
                  {application?.appAddress || '—'}
                </p>
                </div>
              </div>
            </section>

          {/* Source of Income */}
<section className="bg-white rounded-lg shadow-sm p-6">
  <div className="flex items-center mb-4">
    <FiDollarSign className="w-5 h-5 text-green-500 mr-2" />
    <h2 className="text-xl font-semibold text-gray-800">Source of Income</h2>
  </div>

  {application?.sourceOfIncome === 'business' ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <p className="text-sm font-medium text-gray-500">Type of Business</p>
        <p className="text-base text-gray-800 mt-1">
          {application?.appTypeBusiness || '—'}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Date Started</p>
        <p className="text-base text-gray-800 mt-1">
          {application?.appDateStarted || '—'}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Business Location</p>
        <p className="text-base text-gray-800 mt-1">
          {application?.appBusinessLoc || '—'}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Monthly Income</p>
        <p className="text-base text-gray-800 mt-1">
          {formatCurrency(application?.appMonthlyIncome)}
        </p>
      </div>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <p className="text-sm font-medium text-gray-500">Employment Status</p>
        <p className="text-base text-gray-800 mt-1">
          {application?.appEmploymentStatus || '—'}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Occupation</p>
        <p className="text-base text-gray-800 mt-1">
          {application?.appOccupation || '—'}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Company Name</p>
        <p className="text-base text-gray-800 mt-1">
          {application?.appCompanyName || '—'}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Company Address</p>
        <p className="text-base text-gray-800 mt-1">
          {application?.companyAddress || '—'}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Monthly Income</p>
        <p className="text-base text-gray-800 mt-1">
          {formatCurrency(application?.monthlyIncome || 0)}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Length of Service</p>
        <p className="text-base text-gray-800 mt-1">
          {application?.lengthOfService || '—'}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Other Income</p>
        <p className="text-base text-gray-800 mt-1">
          {formatCurrency(application?.otherIncome || 0)}
        </p>
      </div>
    </div>
  )}
</section>

      

            {/* Loan Details */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <FiFileText className="w-5 h-5 text-purple-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Loan Details</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Purpose of Loan</p>
              <p className="text-base text-gray-800 mt-1">
                  {application?.appLoanPurpose|| '—'}
                </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Loan Amount</p>
              <p className="text-base text-gray-800 mt-1">
                  {application?.appLoanAmount|| '—'}
                </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Loan Type</p>
              <p className="text-base text-gray-800 mt-1">
                  {application?.loanType|| '—'}
                </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Loan Terms</p>
              <p className="text-base text-gray-800 mt-1">
                  {application?.appLoanTerms|| '—'}
                </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Interest Rate</p>
              <p className="text-base text-gray-800 mt-1">
                  {application?.appInterest|| '—'}
                </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Payment Schedule</p>
            </div>
          </div>
        </section>
      </div>

             {/* Right Column */}
      <div className="space-y-6">
        {/* Uploaded Documents */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <FiPaperclip className="w-5 h-5 text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Uploaded Documents</h2>
          </div>
          <ul className="space-y-2">
            
          </ul>
        </section>

        {/* Comments / Notes */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <FiMessageSquare className="w-5 h-5 text-pink-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Comments / Notes</h2>
          </div>
          <textarea
            className="w-full border rounded-md p-3 mb-2 text-sm"
            placeholder="Write a comment or note..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Add Comment
          </button>
          <ul className="mt-4 space-y-2 max-h-64 overflow-y-auto">
            {comments.map((c, idx) => (
              <li key={idx} className="bg-gray-100 p-3 rounded-md">
                <p className="text-sm text-gray-800">{c.text}</p>
                <p className="text-xs text-gray-500 mt-1">{c.date}</p>
              </li>
            ))}
          </ul>
        </section>
          </div>
        </div>
      </div>
    </div>
  );
}
