"use client";

import { useState } from 'react';
import Navbar from '../../navbar';
import { FiUser, FiDollarSign, FiFileText, FiPaperclip, FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import Link from 'next/link';

interface ApplicationDetails {
  basicInfo: {
    name: string;
    dateOfBirth: string;
    contactNumber: string;
    emailAddress: string;
    maritalStatus: string;
    numberOfChildren: number;
    homeAddress: string;
    houseStatus: string;
  };
  incomeSource: {
    employmentStatus: string;
    occupation: string;
    employmentType: string;
    companyName: string;
    companyAddress: string;
    monthlyIncome: number;
    lengthOfService: string;
    otherIncome: string;
  };
  loanDetails: {
    purpose: string;
    amount: number;
    type: string;
    terms: number;
    interestRate: number;
    paymentSchedule: string;
  };
  documents: {
    name: string;
  }[];
}

interface Note {
  text: string;
  date: string;
}

export default function ApplicationDetailsPage({ params }: { params: { id: string } }) {
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<Note[]>([]);

  const applicationDetails: ApplicationDetails = {
    basicInfo: {
      name: "John Doe",
      dateOfBirth: "2002-03-25",
      contactNumber: "97152116241",
      emailAddress: "johndoe@gmail.com",
      maritalStatus: "Single",
      numberOfChildren: 2,
      homeAddress: "Cebu North Road, Lantawan, Cebu, Central Visayas, 6607, Philippines",
      houseStatus: "Rented"
    },
    incomeSource: {
      employmentStatus: "Employed",
      occupation: "Sales Lady",
      employmentType: "Irregular",
      companyName: "Gaisano Bogo",
      companyAddress: "Dela Vina St., Bogo City",
      monthlyIncome: 15000,
      lengthOfService: "3 months",
      otherIncome: "none"
    },
    loanDetails: {
      purpose: "Tuition Fee",
      amount: 30000,
      type: "Regular Loan Without Collateral",
      terms: 10,
      interestRate: 10,
      paymentSchedule: "Monthly"
    },
    documents: [
      { name: "Proof of Identity" },
      { name: "Proof of Address" },
      { name: "Income Verification" }
    ]
  };

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
      <div className=" mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link 
              href="/components/loanOfficer/applications"
              className="inline-flex items-center text-black hover:text-gray-600 mb-4 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Applications
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Application {params.id}</h1>
            <p className="text-gray-500 mt-1">Review application details and documents</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Generate Loan Agreement
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Deny Application
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center mb-4">
                <FiUser className="w-5 h-5 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-gray-900">{applicationDetails.basicInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="text-gray-900">{formatDate(applicationDetails.basicInfo.dateOfBirth)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact Number</p>
                  <p className="text-gray-900">{applicationDetails.basicInfo.contactNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="text-gray-900">{applicationDetails.basicInfo.emailAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Marital Status</p>
                  <p className="text-gray-900">{applicationDetails.basicInfo.maritalStatus}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Number of Children</p>
                  <p className="text-gray-900">{applicationDetails.basicInfo.numberOfChildren}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Home Address</p>
                  <p className="text-gray-900">{applicationDetails.basicInfo.homeAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">House Status</p>
                  <p className="text-gray-900">{applicationDetails.basicInfo.houseStatus}</p>
                </div>
              </div>
            </div>

            {/* Source of Income */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center mb-4">
                <FiDollarSign className="w-5 h-5 text-green-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Source of Income</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Employment Status</p>
                  <p className="text-gray-900">{applicationDetails.incomeSource.employmentStatus}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Occupation/Position</p>
                  <p className="text-gray-900">{applicationDetails.incomeSource.occupation}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Employment Type</p>
                  <p className="text-gray-900">{applicationDetails.incomeSource.employmentType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Company Name</p>
                  <p className="text-gray-900">{applicationDetails.incomeSource.companyName}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Company Address</p>
                  <p className="text-gray-900">{applicationDetails.incomeSource.companyAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Monthly Income</p>
                  <p className="text-gray-900">{formatCurrency(applicationDetails.incomeSource.monthlyIncome)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Length of Service</p>
                  <p className="text-gray-900">{applicationDetails.incomeSource.lengthOfService}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Other Source of Income</p>
                  <p className="text-gray-900">{applicationDetails.incomeSource.otherIncome}</p>
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FiFileText className="w-5 h-5 text-purple-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Loan Details</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Loan Purpose</p>
                  <p className="text-gray-900">{applicationDetails.loanDetails.purpose}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Loan Amount</p>
                  <p className="text-gray-900">{formatCurrency(applicationDetails.loanDetails.amount)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Loan Type</p>
                  <p className="text-gray-900">{applicationDetails.loanDetails.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Loan Terms</p>
                  <p className="text-gray-900">{applicationDetails.loanDetails.terms} months</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Interest Rate</p>
                  <p className="text-gray-900">{applicationDetails.loanDetails.interestRate}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Payment Schedule</p>
                  <p className="text-gray-900">{applicationDetails.loanDetails.paymentSchedule}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Supporting Documents and Notes */}
          <div className="col-span-1 space-y-9">
            {/* Supporting Documents section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FiPaperclip className="w-5 h-5 text-orange-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Supporting Documents</h2>
              </div>
              <div className="space-y-4">
                {applicationDetails.documents.map((doc, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    </div>
                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                      View Document
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FiMessageSquare className="w-5 h-5 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Notes</h2>
              </div>
              <div className="relative">
                <div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a note about this application..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleCommentSubmit}
                    className="mt-2 w-30 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Note
                  </button>
                </div>
                <div className="space-y-3 mt-4">
                  {comments.map((note, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-800">{note.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{note.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
