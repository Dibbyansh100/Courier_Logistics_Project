/**
 * User roles recognized across the platform.
 * Aligned with backend Spring Security Authority specifications.
 */
export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  CUSTOMER: 'ROLE_CUSTOMER',
  AGENT: 'ROLE_DELIVERY',
};

export const ROLE_NAMES = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.CUSTOMER]: 'Customer',
  [ROLES.AGENT]: 'Delivery Agent',
};

export default ROLES;
