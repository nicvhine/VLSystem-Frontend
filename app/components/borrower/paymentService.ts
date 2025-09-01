export interface PaymentData {
  loanId: string;
  amount: number;
  paymentMethod: 'card' | 'gcash' | 'qrph';
}

export interface PaymentResponse {
  success: boolean;
  paymentData: any;
  clientSecret?: string;
  checkoutUrl?: string;
}

export interface LoanPaymentDetails {
  loan: any;
  payments: any[];
  nextPaymentAmount: number;
  canMakePayment: boolean;
}

class PaymentService {
  private baseUrl = 'http://localhost:3001';

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getLoanPaymentDetails(loanId: string): Promise<LoanPaymentDetails> {
    const response = await fetch(`${this.baseUrl}/payments/loan/${loanId}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch loan payment details');
    }

    return response.json();
  }

  async createPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    const response = await fetch(`${this.baseUrl}/payments/create-payment-intent`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Payment creation failed');
    }

    return response.json();
  }

  async checkPaymentStatus(paymentId: string) {
    const response = await fetch(`${this.baseUrl}/payments/status/${paymentId}`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to check payment status');
    }

    return response.json();
  }
}

export default new PaymentService();