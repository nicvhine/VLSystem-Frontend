export function getRequirements(type: string, language: 'en' | 'ceb') {
    switch (type) {
      case language === 'en'
        ? 'Regular Loan Without Collateral'
        : 'Regular nga Pahulam (Walay Kolateral)':
        return [
          language === 'en' ? 'Valid Government-issued ID' : 'Validong Gobyerno nga ID',
          language === 'en' ? 'Proof of Income' : 'Prueba sa Kita',
          language === 'en' ? 'Certificate of Employment / Business Permit' : 'Sertipiko sa Trabaho / Permit sa Negosyo',
          language === 'en' ? 'Proof of Billing' : 'Prueba sa Pagbayad',
        ];
  
      case language === 'en'
        ? 'Regular Loan With Collateral'
        : 'Regular nga Pahulam (Naay Kolateral)':
        return [
          language === 'en' ? 'Valid Government-issued ID' : 'Validong Gobyerno nga ID',
          language === 'en' ? 'Proof of Income' : 'Prueba sa Kita',
          language === 'en' ? 'Certificate of Employment / Business Permit' : 'Sertipiko sa Trabaho / Permit sa Negosyo',
          language === 'en' ? 'Proof of Billing' : 'Prueba sa Pagbayad',
          language === 'en' ? 'Collateral Document' : 'Dokumento sa Kolateral',
          language === 'en' ? 'Appraisal Report of Collateral' : 'Report sa Pagtimbang-timbang sa Kolateral',
        ];
  
      case language === 'en' ? 'Open-Term Loan' : 'Open-Term nga Pahulam':
        return [
          language === 'en' ? 'Valid Government-issued ID' : 'Validong Gobyerno nga ID',
          language === 'en' ? 'Proof of Income' : 'Prueba sa Kita',
          language === 'en' ? 'Certificate of Employment / Business Permit' : 'Sertipiko sa Trabaho / Permit sa Negosyo',
          language === 'en' ? 'Proof of Billing' : 'Prueba sa Pagbayad',
          language === 'en' ? 'Collateral Document' : 'Dokumento sa Kolateral',
          language === 'en' ? 'Appraisal Report of Collateral' : 'Report sa Pagtimbang-timbang sa Kolateral',
        ];
  
      default:
        return [];
    }
  }
  