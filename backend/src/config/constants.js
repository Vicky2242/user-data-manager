export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const MESSAGES = {
  SUCCESS: 'Operation successful',
  ERROR: 'An error occurred',
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  ALREADY_EXISTS: 'Resource already exists',
};

export const DOCUMENT_TYPES = [
  'aadhaar',
  'pan',
  'gst',
  'passport',
  'voter_id',
  'driving_license',
];

export const CUSTOM_FIELD_TYPES = [
  'text',
  'number',
  'email',
  'phone',
  'date',
  'checkbox',
  'select',
  'textarea',
];

export const ENCRYPTION_FIELDS = ['aadhaarNumber', 'panNumber', 'bankAccountNumber', 'gstin'];

export const BCRYPT_ROUNDS = 10;
