async function runTests() {
  const base = 'http://localhost:5000/api';

  console.log('--- 1. Testing Auth: Login with Seeded Admin ---');
  const loginRes = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@orbitworks.com', password: 'AdminPassword123!' }),
  });
  const loginData = await loginRes.json();
  console.log('Login Status:', loginRes.status, loginData.user ? `Logged in as ${loginData.user.name} (${loginData.user.role})` : loginData);
  const token = loginData.token;

  console.log('\n--- 2. Testing Auth: Profile ---');
  const profileRes = await fetch(`${base}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const profileData = await profileRes.json();
  console.log('Profile Status:', profileRes.status, profileData.user?.email);

  console.log('\n--- 3. Testing Contact Submission ---');
  const contactRes = await fetch(`${base}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Tester',
      email: 'tester@example.com',
      phone: '1234567890',
      subject: 'Test Subject',
      message: 'Hello, this is a test message.',
    }),
  });
  const contactData = await contactRes.json();
  console.log('Contact Submit Status:', contactRes.status, contactData.message);

  console.log('\n--- 4. Testing Quote Submission ---');
  const quoteRes = await fetch(`${base}/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Enterprise Client',
      email: 'client@enterprise.com',
      phone: '9998887777',
      serviceRequired: 'AI Integration',
      budget: '$15,000 - $50,000',
      message: 'Need help building AI pipelines.',
    }),
  });
  const quoteData = await quoteRes.json();
  console.log('Quote Submit Status:', quoteRes.status, quoteData.message);

  console.log('\n--- 5. Testing Newsletter Subscribe (First Time & Duplicate) ---');
  const newEmail = `subscriber_${Date.now()}@example.com`;
  const subRes1 = await fetch(`${base}/newsletter/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: newEmail }),
  });
  const subData1 = await subRes1.json();
  console.log('Newsletter 1st Try Status:', subRes1.status, subData1.message);

  // Duplicate try
  const subRes2 = await fetch(`${base}/newsletter/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: newEmail }),
  });
  const subData2 = await subRes2.json();
  console.log('Newsletter 2nd Try Status:', subRes2.status, subData2.error);

  console.log('\n--- 6. Testing Admin Endpoints ---');
  const adminContactsRes = await fetch(`${base}/admin/contacts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const adminContacts = await adminContactsRes.json();
  console.log('Admin Contacts Count:', adminContacts.count);

  const adminUsersRes = await fetch(`${base}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const adminUsers = await adminUsersRes.json();
  console.log('Admin Users Count:', adminUsers.count);

  const adminQuotesRes = await fetch(`${base}/admin/quotes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const adminQuotes = await adminQuotesRes.json();
  console.log('Admin Quotes Count:', adminQuotes.count);

  console.log('\n--- 7. Testing Admin Delete Contact ---');
  if (adminContacts.contacts && adminContacts.contacts.length > 0) {
    const contactToDelete = adminContacts.contacts[0];
    const delRes = await fetch(`${base}/admin/contacts/${contactToDelete.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const delData = await delRes.json();
    console.log('Delete Contact Status:', delRes.status, delData.message);
  }

  console.log('\n--- 8. Testing Protected Admin Endpoint without Token (Should be 401) ---');
  const unauthRes = await fetch(`${base}/admin/contacts`);
  console.log('Unauth Status (Expect 401):', unauthRes.status);

  console.log('\nALL BACKEND API TESTS COMPLETED!');
}

runTests().catch(console.error);
