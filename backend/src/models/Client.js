import mongoose from 'mongoose';
import { encrypt, decrypt } from '../services/encryptionService.js';
import { ENCRYPTION_FIELDS } from '../config/constants.js';

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      match: [/^[0-9]{10}$/, 'Phone must be a valid 10-digit number'],
      index: true,
    },
    aadhaarNumber: {
      type: String,
      trim: true,
      match: [/^[0-9]{12}$/, 'Aadhaar must be a 12-digit number'],
    },
    panNumber: {
      type: String,
      uppercase: true,
      trim: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'PAN format: ABCDE1234F'],
    },
    bankDetails: {
      accountNumber: String,
      accountHolderName: String,
      bankName: String,
      ifscCode: String,
      accountType: {
        type: String,
        enum: ['savings', 'current', 'other'],
      },
    },
    gstin: {
      type: String,
      match: [
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        'Invalid GST number format',
      ],
    },
    incomeTax: {
      filingYear: Number,
      filedAmount: Number,
      status: {
        type: String,
        enum: ['filed', 'pending', 'not-filed'],
        default: 'not-filed',
      },
    },
    tds: {
      deductionAmount: Number,
      deductionYear: Number,
      status: String,
    },
    iecCode: String,
    importExportCode: String,
    businessName: String,
    businessType: {
      type: String,
      enum: ['sole-proprietor', 'partnership', 'pvt-ltd', 'llp', 'other'],
    },
    businessAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    digitalSignaturePassword: String,
    documents: [
      {
        type: {
          type: String,
          enum: ['aadhaar', 'pan', 'gst', 'passport', 'voter_id', 'other'],
        },
        fileName: String,
        filePath: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    customFields: mongoose.Schema.Types.Mixed,
    notes: String,
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true }
);

clientSchema.pre('save', function (next) {
  ENCRYPTION_FIELDS.forEach((field) => {
    if (this.isModified(field) && this[field]) {
      this[field] = encrypt(
        this[field],
        process.env.ENCRYPTION_KEY,
        process.env.ENCRYPTION_IV
      );
    }

    if (this.bankDetails && this.isModified('bankDetails.accountNumber')) {
      if (this.bankDetails.accountNumber) {
        this.bankDetails.accountNumber = encrypt(
          this.bankDetails.accountNumber,
          process.env.ENCRYPTION_KEY,
          process.env.ENCRYPTION_IV
        );
      }
    }

    if (this.isModified('digitalSignaturePassword') && this.digitalSignaturePassword) {
      this.digitalSignaturePassword = encrypt(
        this.digitalSignaturePassword,
        process.env.ENCRYPTION_KEY,
        process.env.ENCRYPTION_IV
      );
    }
  });

  next();
});

clientSchema.methods.decryptSensitiveFields = function () {
  const obj = this.toObject();

  ENCRYPTION_FIELDS.forEach((field) => {
    if (obj[field]) {
      obj[field] = decrypt(
        obj[field],
        process.env.ENCRYPTION_KEY,
        process.env.ENCRYPTION_IV
      );
    }
  });

  if (obj.bankDetails?.accountNumber) {
    obj.bankDetails.accountNumber = decrypt(
      obj.bankDetails.accountNumber,
      process.env.ENCRYPTION_KEY,
      process.env.ENCRYPTION_IV
    );
  }

  if (obj.digitalSignaturePassword) {
    obj.digitalSignaturePassword = decrypt(
      obj.digitalSignaturePassword,
      process.env.ENCRYPTION_KEY,
      process.env.ENCRYPTION_IV
    );
  }

  return obj;
};

clientSchema.query.findDecrypted = function (filter) {
  return this.find(filter).lean().transform((docs) => {
    return docs.map((doc) => {
      const client = new Client(doc);
      return client.decryptSensitiveFields();
    });
  });
};

export const Client = mongoose.model('Client', clientSchema);
