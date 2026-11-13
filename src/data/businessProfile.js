export const BUSINESS_PROFILE_STORAGE_KEY = 'pharmacy-business-profile';

export const defaultBusinessProfile = {
  pharmacyName: 'Kampala Care Pharmacy',
  address: 'Plot 18, Jinja Road, Kampala, Uganda',
  contactPhone: '+256 772 420 110',
  email: 'hello@kampalacarepharmacy.ug',
  currency: 'UGX',
  receiptFooter: 'Thank you for choosing Kampala Care Pharmacy',
};

export function getBusinessProfile() {
  try {
    const rawValue = localStorage.getItem(BUSINESS_PROFILE_STORAGE_KEY);

    if (!rawValue) {
      return defaultBusinessProfile;
    }

    return { ...defaultBusinessProfile, ...JSON.parse(rawValue) };
  } catch (error) {
    console.error('Unable to load business profile', error);
    return defaultBusinessProfile;
  }
}

export function saveBusinessProfile(profile) {
  const nextProfile = { ...defaultBusinessProfile, ...profile };

  localStorage.setItem(BUSINESS_PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
  return nextProfile;
}
