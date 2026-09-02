import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
const { Parser } = require('json2csv');

function formatDateTime(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

@Injectable()
export class GenerateCsvService {
  async generateCsv(logs: any): Promise<string> {
    const reportDir = path.join(process.cwd(), 'uploads', 'report');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const flat = logs.map((f) => ({
      title: f.title,
      type: f.type,
      amount: f.amount,
      warehouse: f.warehouse?.name || '',
      category: f.category?.name || '',
      createdBy: f.createdBy?.username || '',
      createdAt: f.createdAt ? formatDateTime(f.createdAt) : '',
      transactionDate: f.date ? formatDate(f.date) : '',
      note: f.note || '',
    }));
    const parser = new Parser();
    const csv = parser.parse(flat);

    // return relative URL for download, so frontend can use window.open directly
    return csv;
  }
}
