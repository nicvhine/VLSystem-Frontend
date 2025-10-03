const headTranslations = {
  en: {
    // Navigation
    loans: 'Loans',
    applications: 'Applications',
    collections: 'Collections',
    users: 'Users',
    dashboard: 'Dashboard',
    
    // Common UI
    search: 'Search',
    filter: 'Filter',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    create: 'Create',
    update: 'Update',
    confirm: 'Confirm',
    close: 'Close',
    
    // User Management
    createUser: 'Create User',
    addUser: 'Add User',
    editUser: 'Edit User',
    deleteUser: 'Delete User',
    userDetails: 'User Details',
    name: 'Name',
    email: 'Email',
    phoneNumber: 'Phone Number',
    role: 'Role',
    status: 'Status',
    lastActive: 'Last Active',
    active: 'Active',
    inactive: 'Inactive',
    suspended: 'Suspended',
    
    // Roles
    head: 'Head',
    manager: 'Manager',
    loanOfficer: 'Loan Officer',
    collector: 'Collector',
    borrower: 'Borrower',
    
    // Dashboard
    loanStats: 'Loan Statistics',
    auditLog: 'Audit Log',
    totalLoans: 'Total Loans',
    activeLoans: 'Active Loans',
    completedLoans: 'Completed Loans',
    overdueLoans: 'Overdue Loans',
    totalAmount: 'Total Amount',
    collectedAmount: 'Collected Amount',
    pendingAmount: 'Pending Amount',
    
    // Audit Log
    recentActivity: 'Recent Activity',
    userAction: 'User Action',
    timestamp: 'Timestamp',
    details: 'Details',
    
    // Messages
    confirmDelete: 'Are you sure you want to delete this user?',
    userCreated: 'User created successfully',
    userUpdated: 'User updated successfully',
    userDeleted: 'User deleted successfully',
    errorOccurred: 'An error occurred',
    noUsersFound: 'No users found',
    noDataAvailable: 'No data available',
    
    // Language
    english: 'English',
    cebuano: 'Cebuano',
    
    // Account Settings
    accountSettings: 'Account Settings',
    profile: 'Profile',
    notifications: 'Notifications',
    security: 'Security',
    logout: 'Logout',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    emailNotifications: 'Email Notifications',
    smsNotifications: 'SMS Notifications',
    
    // Form Validation
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    passwordMismatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 8 characters',
    
    // Filters
    all: 'All',
    filterByRole: 'Filter by Role',
    filterByStatus: 'Filter by Status',
    sortBy: 'Sort By',
    ascending: 'Ascending',
    descending: 'Descending',
    
    // Application Status Values
    applied: 'Applied',
    pending: 'Pending',
    approved: 'Approved',
    denied: 'Denied',
    cleared: 'Cleared',
    disbursed: 'Disbursed',
    onHold: 'On Hold',
    accepted: 'Accepted',
    
    // Chart Labels
    month: 'Month',
    count: 'Count',
    amount: 'Amount',
    statistics: 'Statistics',
    overview: 'Overview',
    
    // Table Headers
    applicationId: 'Application ID',
    applicantName: 'Applicant Name',
    loanType: 'Loan Type',
    applicationDate: 'Application Date',
    principal: 'Principal',
    interest: 'Interest',
    collectable: 'Collectable',
    actions: 'Actions',
    
    // Loan Types
    regularLoanWithCollateral: 'Regular Loan With Collateral',
    regularLoanWithoutCollateral: 'Regular Loan Without Collateral',
    openTermLoan: 'Open-Term Loan',
    
    // Action Buttons
    setSchedule: 'Set Schedule',
    dismiss: 'Dismiss',
    clear: 'Clear',
    createAccount: 'Create Account',
    approve: 'Approve',
    reject: 'Reject',
    view: 'View',
    
    // Messages
    noApplicationsFound: 'No applications found',
    loadingData: 'Loading data...',
    
    // Audit Log Actions
    createUser: 'CREATE USER',
    deleteUser: 'DELETE USER',
    createLoan: 'CREATE LOAN',
    deleteLoan: 'DELETE LOAN',
    updateLoan: 'UPDATE LOAN',
    unknown: 'Unknown',
    
    // Collections
    referenceNumber: 'Reference #',
    loanId: 'Loan ID',
    balance: 'Balance',
    periodAmount: 'Period Amount',
    paidAmount: 'Paid Amount',
    periodBalance: 'Period Balance',
    note: 'Note',
    action: 'Action',
    printCollectionSheet: 'Print Collection Sheet',
    collectionCalendar: 'Collection Calendar',
    dailyProgress: 'Daily Progress',
    dailyCollection: 'Daily Collection',
    overallProgress: 'Overall Progress',
    overallCollection: 'Overall Collection',
    searchHere: 'Search here...',
    sortBy: 'Sort by',
    makePayment: 'Make Payment',
    addNote: 'Add Note',
    editNote: 'Edit Note',
    paid: 'Paid',
    
    // Loans
    disburseDate: 'Disburse Date',
    all: 'All',
    active: 'Active',
    overdue: 'Overdue',
    closed: 'Closed',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
  },
  ceb: {
    // Navigation
    loans: 'Mga Utang',
    applications: 'Mga Aplikasyon',
    collections: 'Mga Koleksyon',
    users: 'Mga User',
    dashboard: 'Dashboard',
    
    // Common UI
    search: 'Pangita',
    filter: 'Filter',
    loading: 'Nag-load...',
    save: 'I-save',
    cancel: 'I-cancel',
    edit: 'I-edit',
    delete: 'I-delete',
    create: 'Himua',
    update: 'I-update',
    confirm: 'Kumpirma',
    close: 'Sirado',
    
    // User Management
    createUser: 'Himua og User',
    addUser: 'Idugang og User',
    editUser: 'I-edit ang User',
    deleteUser: 'I-delete ang User',
    userDetails: 'Mga Detalye sa User',
    name: 'Ngalan',
    email: 'Email',
    phoneNumber: 'Numero sa Telepono',
    role: 'Papel',
    status: 'Kahimtang',
    lastActive: 'Katapusang Aktibo',
    active: 'Aktibo',
    inactive: 'Dili Aktibo',
    suspended: 'Gi-suspend',
    
    // Roles
    head: 'Ulo',
    manager: 'Manager',
    loanOfficer: 'Loan Officer',
    collector: 'Kolector',
    borrower: 'Nangutang',
    
    // Dashboard
    loanStats: 'Mga Estadistika sa Utang',
    auditLog: 'Audit Log',
    totalLoans: 'Kinatibuk-ang Utang',
    activeLoans: 'Mga Aktibong Utang',
    completedLoans: 'Mga Nahuman nga Utang',
    overdueLoans: 'Mga Nalapas nga Utang',
    totalAmount: 'Kinatibuk-ang Kantidad',
    collectedAmount: 'Nakolekta nga Kantidad',
    pendingAmount: 'Naghulat nga Kantidad',
    
    // Audit Log
    recentActivity: 'Bag-ong Kalihokan',
    userAction: 'Aksyon sa User',
    timestamp: 'Oras',
    details: 'Mga Detalye',
    
    // Messages
    confirmDelete: 'Sigurado ka ba nga gusto nimo i-delete kini nga user?’,
    userCreated: 'Malampuson nga nahimo ang user',
    userUpdated: 'Malampuson nga na-update ang user',
    userDeleted: 'Malampuson nga na-delete ang user',
    errorOccurred: 'Adunay sayop nga nahitabo',
    noUsersFound: 'Walay mga user nga nakit-an',
    noDataAvailable: 'Walay datos nga makita',
    
    // Language
    english: 'English',
    cebuano: 'Cebuano',
    
    // Account Settings
    accountSettings: 'Mga Setting sa Account',
    profile: 'Profile',
    notifications: 'Mga Pahibalo',
    security: 'Seguridad',
    logout: 'Gawas',
    changePassword: 'Usba ang Password',
    currentPassword: 'Kasamtangan nga Password',
    newPassword: 'Bag-ong Password',
    confirmPassword: 'Kumpirma ang Password',
    emailNotifications: 'Mga Pahibalo sa Email',
    smsNotifications: 'Mga Pahibalo sa SMS',
    
    // Form Validation
    required: 'Kinahanglan kini nga field',
    invalidEmail: 'Palihug ibutang ang sakto nga email address',
    passwordMismatch: 'Dili pareho ang mga password',
    passwordTooShort: 'Ang password kinahanglan labing menos 8 ka karakter',
    
    // Filters
    all: 'Tanan',
    filterByRole: 'Filter pinaagi sa Papel',
    filterByStatus: 'Filter pinaagi sa Kahimtang',
    sortBy: 'I-sort pinaagi sa',
    ascending: 'Pagtaas',
    descending: 'Pagkunhod',
    
    // Application Status Values
    applied: 'Nag-apply',
    pending: 'Naghulat',
    approved: 'Gi-aprubahan',
    denied: 'Gi-balibaran',
    cleared: 'Gi-clear',
    disbursed: 'Gi-hatag',
    onHold: 'Gi-hold',
    accepted: 'Gi-dawat',
    
    // Chart Labels
    month: 'Buwan',
    count: 'Ihap',
    amount: 'Kantidad',
    statistics: 'Mga Estadistika',
    overview: 'Pangkitaan',
    
    // Table Headers
    applicationId: 'ID sa Aplikasyon',
    applicantName: 'Ngalan sa Nag-apply',
    loanType: 'Klase sa Utang',
    applicationDate: 'Petsa sa Pag-apply',
    principal: 'Principal',
    interest: 'Interest',
    collectable: 'Makolekta',
    actions: 'Mga Aksyon',
    
    // Loan Types
    regularLoanWithCollateral: 'Regular nga Utang nga Naay Kolateral',
    regularLoanWithoutCollateral: 'Regular nga Utang nga Walay Kolateral',
    openTermLoan: 'Open-Term nga Utang',
    
    // Action Buttons
    setSchedule: 'I-set ang Schedule',
    dismiss: 'I-dismiss',
    clear: 'I-clear',
    createAccount: 'Himua og Account',
    approve: 'I-aprubahan',
    reject: 'I-balibaran',
    view: 'Tan-awa',
    
    // Messages
    noApplicationsFound: 'Walay mga aplikasyon nga nakit-an',
    loadingData: 'Nag-load og datos...',
    
    // Audit Log Actions
    createUser: 'PAGHIMO OG USER',
    deleteUser: 'PAG-DELETE OG USER',
    createLoan: 'PAGHIMO OG UTANG',
    deleteLoan: 'PAG-DELETE OG UTANG',
    updateLoan: 'PAG-UPDATE SA UTANG',
    unknown: 'Wala Mailhi',
    
    // Collections
    referenceNumber: 'Numero sa Reperensya',
    loanId: 'ID sa Utang',
    balance: 'Balanse',
    periodAmount: 'Kantidad sa Panahon',
    paidAmount: 'Nabayad nga Kantidad',
    periodBalance: 'Balanse sa Panahon',
    note: 'Nota',
    action: 'Aksyon',
    printCollectionSheet: 'I-print ang Collection Sheet',
    collectionCalendar: 'Kalendaryo sa Koleksyon',
    dailyProgress: 'Adlaw-adlaw nga Pag-uswag',
    dailyCollection: 'Adlaw-adlaw nga Koleksyon',
    overallProgress: 'Kinatibuk-ang Pag-uswag',
    overallCollection: 'Kinatibuk-ang Koleksyon',
    searchHere: 'Pangita dinhi...',
    sortBy: 'I-sort pinaagi sa',
    makePayment: 'Paghimo og Bayad',
    addNote: 'Idugang og Nota',
    editNote: 'I-edit ang Nota',
    paid: 'Nabayad',
    
    // Loans
    disburseDate: 'Petsa sa Paghatag',
    all: 'Tanan',
    active: 'Aktibo',
    overdue: 'Nalapas',
    closed: 'Sirado',
    previous: 'Miagi',
    next: 'Sunod',
    page: 'Panid',
    of: 'sa',
  }
};

export default headTranslations;
