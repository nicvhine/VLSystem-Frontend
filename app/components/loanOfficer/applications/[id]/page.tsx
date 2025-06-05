'use client';
import { useState } from 'react';
import { FiLoader } from 'react-icons/fi';
import Navbar from '../../navbar';

interface Application {
  id: string;
  name: string;
  dateOfBirth: string;
  contactNumber: number;
  emailAddress: string;
  maritalStatus: string;
  noOfChildren: number;
  homeAddress: string;
  houseStatus: string;
  occupation: string;
  empStatus: string;
  companyName: string;
  companyAddress: string;
  monthlyIncome: number;
  lengthOfService: string;
  otherSource: string;
  purpose: string;
  loanAmount: number;
  loanType: string;
  loanTerms: number;
  interestRate: string;
  paymentSched: string;
  status: 'Pending' | 'Accepted' | 'Denied' | 'Onhold';
}

interface Comment {
  text: string;
  date: string;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );
}

export default function ApplicationDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const application: Application = {
    id,
    name: 'John Doe',
    dateOfBirth: '2002-03-25',
    contactNumber: 97152116241,
    emailAddress: 'johndoe@gmail.com',
    maritalStatus: 'Single',
    noOfChildren: 2,
    homeAddress: 'Cebu North Road, Lantawan, Cebu, Central Visayas, 6007, Philippines',
    houseStatus: 'Rented',
    occupation: 'Sales Lady',
    empStatus: 'Irregular',
    companyName: 'Gaisano Bogo',
    companyAddress: 'Dela Vina St., Bogo City',
    monthlyIncome: 15000,
    lengthOfService: '3 months',
    otherSource: 'none',
    purpose: 'Tuition Fee',
    loanAmount: 30000,
    loanType: 'Regular Loan Without Collateral',
    loanTerms: 10,
    interestRate: '10%',
    paymentSched: 'Monthly',
  };

  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [houseStatus, setHouseStatus] = useState<'Owned' | 'Rented'>(application.houseStatus);
  const [showModal, setShowModal] = useState<boolean>(false);
  const imageUrl = '../idPic.jpg';

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment = {
        text: comment,
        date: new Date().toLocaleString('en-PH', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      };
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  const handleApprove = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    window.location.href = '/loanofficer/applications'; // Navigate when "OK" is pressed
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className={`min-h-screen bg-gray-100 text-gray-900 ${showModal ? 'backdrop-blur-sm' : ''}`}>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold">Application ID: {id}</h1>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-500 text-white font-medium px-4 py-2 rounded-lg"
            >
              Generate Loan Agreement
            </button>
            <button className="bg-red-500 hover:bg-red-400 text-white font-medium px-4 py-2 rounded-lg">Deny</button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="bg-white shadow-md rounded-xl p-6 flex-1 relative">
  

            {/* Info */}
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-1 pl-4">
              <p><strong>Name:</strong> {application.name}</p>
              <p><strong>Date of Birth:</strong> {application.dateOfBirth}</p>
              <p><strong>Contact Number:</strong> {application.contactNumber}</p>
              <p><strong>Email Address:</strong> {application.emailAddress}</p>
              <p><strong>Marital Status:</strong> {application.maritalStatus}</p>
              <p><strong>Number of Children:</strong> {application.noOfChildren}</p>
              <p><strong>Home Address:</strong> {application.homeAddress}</p>
              <p><strong>House Status:</strong> {application.houseStatus}</p>
            </div>

            <h2 className="text-xl mt-10 font-semibold mb-4">Source of Income</h2>
            <div className="space-y-1 pl-4">
              <p><strong>Employed</strong></p>
              <p><strong>Occupation/Position:</strong> {application.occupation}</p>
              <p><strong>Employment Status:</strong> {application.empStatus}</p>
              <p><strong>Company Name:</strong> {application.companyName}</p>
              <p><strong>Company Address:</strong> {application.companyAddress}</p>
              <p><strong>Monthly Income:</strong> {application.monthlyIncome}</p>
              <p><strong>Length of Service:</strong> {application.lengthOfService}</p>
              <p><strong>Other Source of Income:</strong> {application.otherSource}</p>
            </div>

             <h2 className="text-xl mt-10 font-semibold mb-4">Loan Details</h2>
            <div className="space-y-1 pl-4">
              <p><strong>Loan Purpose:</strong> {application.purpose}</p>
              <p><strong>Loan Amount:</strong> {application.loanAmount}</p>
              <p><strong>Loan Type:</strong> {application.loanType}</p>
              <p><strong>Loan Terms:</strong> {application.loanTerms}</p>
              <p><strong>Interest Rate:</strong> {application.interestRate}</p>
              <p><strong>Payment Schedule:</strong> {application.paymentSched}</p>
            </div>
          
          

            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-3">Supporting Documents</h2>
              <ul className="list-disc pl-8 space-y-1 text-blue-600">
                <li><a href="#">Proof of Identity</a></li>
                <li><a href="#">Proof of Address</a></li>
                <li><a href="#">Income Verification</a></li>
                <li><a href="#">Bank Statement</a></li>
              </ul>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 w-full lg:max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Notes</h2>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Write your note..."
              className="w-full border border-gray-300 p-3 rounded-md shadow-sm resize-none"
            />

            <button
              onClick={handleCommentSubmit}
              className="mt-3 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
            >
              Submit Note
            </button>

            <div className="mt-6 space-y-4">
              {comments.map((c, idx) => (
                <div key={idx} className="border-t pt-2 text-sm">
                  <p className="text-gray-800">{c.text}</p>
                  <p className="text-gray-500 text-xs text-right mt-1">{c.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
    <div className="bg-white text-gray-900 rounded-xl p-10 max-w-6xl w-full  shadow-2xl transition-transform duration-300 ease-in-out scale-100 space-y-6 max-h-[80vh] overflow-y-auto">
      <h2 className="text-center text-xl font-bold mb-4">VISTULA LENDING</h2>
      <p className="text-center text-sm mb-1">BG Business Center, Cantecson, Gairan</p>
      <p className="text-center text-sm mb-6">Bogo City, Cebu</p>

      <h3 className="text-center text-lg font-semibold underline mb-6">LOAN AGREEMENT</h3>

      <p className="mb-4">
        This Loan Agreement is made and executed by and between:
      </p>

      <p className="mb-2">
        <strong>VISTULA LENDING CORPORATION</strong>, a business establishment with office address at Gairan, Bogo City, Cebu,
        represented in this instance by its owner <strong>DIVINA DAMAYO ALBURO</strong>, of legal age, Filipino and a resident
        of Don Pedro Rodriguez St., Bogo City, Cebu, hereinafter known as the <strong>LENDER</strong>.
      </p>

      <p className="mb-4">
        AND
      </p>

      <p className="mb-4">
        <strong>{application.name}</strong>, of legal age, Filipino and resident of <strong>{application.address}</strong>,
        hereinafter known as the <strong>BORROWER</strong>.
      </p>

      <p className="font-semibold underline mb-3">WITNESSETH:</p>
      <ol className="list-decimal list-inside space-y-2 mb-6">
        <li><strong>Loan Amount.</strong>The LENDER agrees to lend and the BORROWER agrees to borrow the sum of <strong>{formatCurrency(application.loanAmount)}</strong>.</li>
        <li><strong>Interest Rate.</strong>The loan shall accrue interest at a rate of <strong>{application.interestRate}</strong> calculated based on the principal amount.</li>
        <li>
          <strong>Repayment Terms.</strong>The BORROWER shall repay the loan according to the following terms:
          <ul className="list-disc list-inside ml-4 mt-1">
            <li>
              Repayment Schedule: Loan shall be paid in <strong>{application.loanTerms}</strong> installment(s) in the uniform amount of
              <strong> ₱ 3,300.00</strong>.

              The first payment of interest and principal shall be on <strong>May 13, 2025</strong>.
            </li>
            <li>
              Remaining amount shall be due every <strong>{application.paymentFrequency}</strong> for the succeeding months.
            </li>
          </ul>
        </li>
        <li>
          The BORROWER fails to pay the loan in default if any of the following occurs:
          <ul className="list-disc list-inside ml-4 mt-1">
            <li>Failure to make any payment under this agreement within 3 days after its due date.</li>
            <li>Any material term of the agreement is violated.</li>
          </ul>
        </li>
      </ol>

      <p className="mb-4">
        In case of default, the unpaid balance shall become due and demandable plus additional 10% monthly surcharges until fully paid.
        The periodic interest and surcharge are accumulated and unpaid penalty fees before the principal is honored.
      </p>

      <p className="mb-6">IN WITNESS WHEREOF, the parties here set their hands this _____ in Gālan, Bogo City, Cebu.</p>

      <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
        <div>
          <p className="font-semibold">LENDER</p>
          <p>DIVINA DAMAYO ALBURO</p>
          <p className="mt-4">Type of ID: ____________________</p>
          <p>ID Number: ______________________</p>
          <p>Valid Until: ______________________</p>
        </div>
        <div>
          <p className="font-semibold">BORROWER</p>
          <p>{application.name}</p>
          <p className="mt-4">Type of ID: ____________________</p>
          <p>ID Number: ______________________</p>
          <p>Valid Until: ______________________</p>
        </div>
      </div>

      <div className="flex gap-x-30 mb-2">
        <p className="mb-2">Signed in the presence of: _________________________</p>
        <p className="mb-2">Signed in the presence of: _________________________</p>
      </div>


      <p className="font-semibold mt-6 underline mb-2">ACKNOWLEDGEMENT</p>
      <p className="text-sm mb-6">
        Before me, a Notary Public for and in City of Bogo, Cebu, this day of ____________, personally appeared, indicated, known
        to me to be the same persons who executed the foregoing instrument and they acknowledged to me that the same is their free act
        and deed.
      </p>

      <p className="text-sm">
        WITNESS MY HAND AND SEAL on the date and place first written above.
      </p>

      <p className="text-sm mt-4">
        Doc. No. ______<br />
        Page No. ______<br />
        Book No. ______<br />
        Series of ______
      </p>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleModalClose}
          className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}



    </div>
  );
}
