interface LoginParams {
  username: string;
  password: string;
  onClose: () => void;
  router: any;
  setShowErrorModal?: (show: boolean) => void;
  setErrorMsg?: (msg: string) => void;
  setShowSMSModal?: (show: boolean) => void;
}

export async function loginHandler({ username, password, onClose, router, setShowErrorModal, setErrorMsg, setShowSMSModal }: LoginParams) {
  if (!username || !password) {
    if (typeof setErrorMsg === 'function') setErrorMsg('Please enter both username and password.');
    if (typeof setShowErrorModal === 'function') setShowErrorModal(true);
    return;
  }

  try {
    const borrowerRes = await fetch('http://localhost:3001/borrowers/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (borrowerRes.ok) {
      const data = await borrowerRes.json();
      localStorage.setItem('token', data.token || '');
      localStorage.setItem('fullName', data.fullName || data.name || data.username);
      localStorage.setItem('email', data.email);
      localStorage.setItem('role', 'borrower');
      
      if (data.borrowersId) localStorage.setItem('borrowersId', data.borrowersId);
    
      if (data.profilePic) {
        localStorage.setItem('profilePic', data.profilePic);
      }
      
    
      if (data.email) localStorage.setItem('email', data.email);
      if (data.phoneNumber) localStorage.setItem('phoneNumber', data.phoneNumber);
    
      data.isFirstLogin
        ? localStorage.setItem('forcePasswordChange', 'true')
        : localStorage.removeItem('forcePasswordChange');
      
      onClose();
      router.push('/userPage/borrowerPage/dashboard');
      return;
    }
    
    
    
    const staffRes = await fetch('http://localhost:3001/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

  if (staffRes.ok) {
  const data = await staffRes.json();
  const user = data.user; 

  localStorage.setItem('token', data.token);
  localStorage.setItem('fullName', user.name || user.username || user.email);
  localStorage.setItem('email', user.email);
  localStorage.setItem('phoneNumber', user.phoneNumber);
  localStorage.setItem('username', user.username);
  localStorage.setItem('role', user.role?.toLowerCase() || 'staff');
  localStorage.setItem('darkMode', user.darkMode?.toString() || 'false'); 

  if (user.profilePic) {
  const fullPicUrl = `http://localhost:3001${user.profilePic}`;
  localStorage.setItem('profilePic', fullPicUrl);
}


  if (user.role?.toLowerCase() === 'collector') {
    localStorage.setItem('collectorName', user.name);
  }

  if (user.userId) {
    localStorage.setItem('userId', user.userId);
  }

  user.isFirstLogin
    ? localStorage.setItem('forcePasswordChange', 'true')
    : localStorage.removeItem('forcePasswordChange');

  onClose();

  const redirectMap: Record<string, string> = {
    head: '/userPage/headPage/dashboard',
    manager: '/userPage/managerPage/dashboard',
    'loan officer': '/userPage/loanOfficerPage/dashboard', 
    collector: '/commonComponents/collection',
  };

  router.push(redirectMap[user.role?.toLowerCase()] || '/');
  return;
}


  if (typeof setErrorMsg === 'function') setErrorMsg('Invalid credentials or user not found.');
  if (typeof setShowErrorModal === 'function') setShowErrorModal(true);
  } catch (error) {
    console.error('Login error:', error);
    if (typeof setErrorMsg === 'function') setErrorMsg('Error connecting to the server.');
    if (typeof setShowErrorModal === 'function') setShowErrorModal(true);
  }
}
