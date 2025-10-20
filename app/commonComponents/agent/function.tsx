'use client';

import { Dispatch, SetStateAction } from 'react';
import { AddAgentParams, Agent, FieldErrors } from '../utils/Types/agent';

// Normalize agent object from API
export const normalizeAgent = (raw: any): Agent => ({
  agentId: String(raw?.agentId ?? ''),
  name: String(raw?.name ?? ''),
  phoneNumber: String(raw?.phoneNumber ?? ''),
  handledLoans: Number(raw?.handledLoans) || 0,
  totalLoanAmount: Number(raw?.totalLoanAmount) || 0,
  totalCommission: Number(raw?.totalCommission) || 0,
});

// Fetch all agents from API
export const fetchAgents = async (
  role: string | null,
  setAgents: Dispatch<SetStateAction<Agent[]>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<string>>
) => {
  if (!role) return;

  setLoading(true);
  setError('');

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in again.');
      setAgents([]);
      return;
    }

    const res = await fetch('http://localhost:3001/agents', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Failed to fetch agents');
    const data = await res.json();

    if (Array.isArray(data)) setAgents(data.map(normalizeAgent));
    else if (Array.isArray(data?.agents)) setAgents(data.agents.map(normalizeAgent));
    else setAgents([]);
  } catch (err) {
    setAgents([]);
    setError((err as Error).message || 'Server error');
  } finally {
    setLoading(false);
  }
};

// Add new agent to API
export const handleAddAgent = async ({
  newAgentName,
  newAgentPhone,
  agents,
  setAgents,
  setShowModal,
  setSuccessMessage,
  setLoading,
  setError,
  fetchAgents,
}: AddAgentParams): Promise<{ success: boolean; fieldErrors?: FieldErrors; message?: string }> => {
  const nameTrim = newAgentName.trim();
  const phoneTrim = newAgentPhone.trim();
  const normalizeName = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase();
  const normalizePhone = (s: string) => s.replace(/\D/g, '');

  const errors: FieldErrors = {};
  if (!nameTrim) errors.name = 'Name is required';
  if (!phoneTrim) errors.phoneNumber = 'Phone number is required';

  if (nameTrim && nameTrim.split(/\s+/).filter(Boolean).length < 2) {
    errors.name = 'Please enter at least two words (first and last name).';
  }

  const nameNorm = normalizeName(nameTrim);
  const phoneNorm = normalizePhone(phoneTrim);

  if (phoneNorm && (!phoneNorm.startsWith('09') || phoneNorm.length !== 11)) {
    errors.phoneNumber = 'Phone number must start with 09 and be exactly 11 digits.';
  }

  if (agents.some(a => normalizeName(a.name) === nameNorm)) {
    errors.name = errors.name || 'An agent with this name already exists.';
  }

  if (agents.some(a => normalizePhone(a.phoneNumber) === phoneNorm)) {
    errors.phoneNumber = errors.phoneNumber || 'This phone number is already used by another agent.';
  }

  if (errors.name || errors.phoneNumber) return { success: false, fieldErrors: errors };

  setLoading(true);
  setError('');

  try {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, message: 'No token found. Please log in again.' };

    const res = await fetch('http://localhost:3001/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: nameTrim, phoneNumber: phoneTrim }),
    });

    let data: any = null;
    try { data = await res.json(); } catch {}

    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || 'Failed to add agent';
      return { success: false, message: msg };
    }

    if (data?.agent) setAgents(prev => [...prev, normalizeAgent(data.agent)]);
    else await fetchAgents();

    setShowModal(false);
    setSuccessMessage('Agent added successfully');

    return { success: true };
  } catch (err) {
    setError('Server error');
    return { success: false, message: 'Server error' };
  } finally {
    setLoading(false);
  }
};
