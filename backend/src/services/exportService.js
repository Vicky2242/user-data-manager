import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { decrypt } from './encryptionService.js';

const getDecryptedClients = (clients) => {
  return clients.map((doc) => {
    const client = doc.toObject ? doc.toObject() : doc;

    if (client.aadhaarNumber) {
      client.aadhaarNumber = decrypt(
        client.aadhaarNumber,
        process.env.ENCRYPTION_KEY,
        process.env.ENCRYPTION_IV
      );
    }
    if (client.panNumber) {
      client.panNumber = decrypt(
        client.panNumber,
        process.env.ENCRYPTION_KEY,
        process.env.ENCRYPTION_IV
      );
    }
    if (client.bankDetails?.accountNumber) {
      client.bankDetails.accountNumber = decrypt(
        client.bankDetails.accountNumber,
        process.env.ENCRYPTION_KEY,
        process.env.ENCRYPTION_IV
      );
    }

    return client;
  });
};

export const exportToCSV = async (clients, filename) => {
  try {
    const decryptedClients = getDecryptedClients(clients);

    const csvHeader = [
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
      { id: 'phone', title: 'Phone' },
      { id: 'aadhaarNumber', title: 'Aadhaar Number' },
      { id: 'panNumber', title: 'PAN Number' },
      { id: 'gstin', title: 'GST Number' },
      { id: 'businessName', title: 'Business Name' },
      { id: 'businessType', title: 'Business Type' },
      { id: 'iecCode', title: 'IEC Code' },
      { id: 'importExportCode', title: 'Import/Export Code' },
      { id: 'notes', title: 'Notes' },
      { id: 'createdAt', title: 'Created Date' },
    ];

    const csvWriter = createCsvWriter({
      path: filename,
      header: csvHeader,
    });

    const records = decryptedClients.map((client) => ({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      aadhaarNumber: client.aadhaarNumber || '',
      panNumber: client.panNumber || '',
      gstin: client.gstin || '',
      businessName: client.businessName || '',
      businessType: client.businessType || '',
      iecCode: client.iecCode || '',
      importExportCode: client.importExportCode || '',
      notes: client.notes || '',
      createdAt: client.createdAt ? new Date(client.createdAt).toLocaleDateString() : '',
    }));

    await csvWriter.writeRecords(records);
    return filename;
  } catch (error) {
    console.error('CSV export error:', error.message);
    throw error;
  }
};

export const exportToPDF = async (clients, filename) => {
  try {
    const decryptedClients = getDecryptedClients(clients);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40 });
      const stream = fs.createWriteStream(filename);

      doc.pipe(stream);

      doc.fontSize(20).font('Helvetica-Bold').text('Client Data Report', { align: 'center' });
      doc.fontSize(10).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
      doc.fontSize(10).text(`Total Clients: ${decryptedClients.length}`, { align: 'center' });
      doc.moveDown();

      const pageWidth = doc.page.width - 80;
      const tableTop = doc.y;
      const col1 = 40;
      const col2 = col1 + pageWidth * 0.2;
      const col3 = col2 + pageWidth * 0.2;
      const col4 = col3 + pageWidth * 0.3;
      const col5 = col4 + pageWidth * 0.15;

      const rowHeight = 20;
      const headerY = tableTop;

      doc.fontSize(9).font('Helvetica-Bold');
      doc.text('Name', col1, headerY);
      doc.text('Email', col2, headerY);
      doc.text('Phone', col3, headerY);
      doc.text('PAN', col4, headerY);
      doc.text('GST', col5, headerY);

      doc.moveTo(40, headerY + 15).lineTo(550, headerY + 15).stroke();

      let yPosition = headerY + 25;
      const maxYPosition = doc.page.height - 40;

      doc.fontSize(8).font('Helvetica');

      decryptedClients.forEach((client, index) => {
        if (yPosition > maxYPosition) {
          doc.addPage();
          yPosition = 40;
        }

        doc.text(client.name || '', col1, yPosition, { width: 80, ellipsis: true });
        doc.text(client.email || '', col2, yPosition, { width: 80, ellipsis: true });
        doc.text(client.phone || '', col3, yPosition, { width: 80, ellipsis: true });
        doc.text(client.panNumber || '', col4, yPosition, { width: 100, ellipsis: true });
        doc.text(client.gstin || '', col5, yPosition, { width: 80, ellipsis: true });

        yPosition += rowHeight;
      });

      doc.end();

      stream.on('finish', () => {
        resolve(filename);
      });

      stream.on('error', reject);
    });
  } catch (error) {
    console.error('PDF export error:', error.message);
    throw error;
  }
};
