interface LoginParams {
  username: string;
  password: string;
  onClose: () => void;
  router: any;
}

export async function loginHandler({ username, password, onClose, router }: LoginParams) {
  if (!username || !password) {
    alert('Please enter both username and password.');
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
      localStorage.setItem('role', 'borrower');
      
      if (data.borrowersId) localStorage.setItem('borrowersId', data.borrowersId);

      if (data.profilePic) {
  const fullPicUrl = `http://localhost:3001${data.profilePic}`;
  localStorage.setItem('profilePic', fullPicUrl);
}
      if (data.borrowersId) localStorage.setItem('borrowersId', data.borrowersId);
      data.isFirstLogin
        ? localStorage.setItem('forcePasswordChange', 'true')
        : localStorage.removeItem('forcePasswordChange');
      onClose();
      router.push('/components/borrower/dashboard');
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
    head: '/headPage/dashboard',
    manager: '/components/manager/dashboard',
    'loan officer': '/components/loanOfficer/dashboard', 
    collector: '/components/collector',
  };

  router.push(redirectMap[user.role?.toLowerCase()] || '/');
  return;
}


    alert('Invalid credentials or user not found.');
  } catch (error) {
    console.error('Login error:', error);
    alert('Error connecting to the server.');
  }
}
