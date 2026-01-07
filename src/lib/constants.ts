// API constants
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Droplet sizes (DigitalOcean-like)
export const DROPLET_SIZES = [
  { slug: 's-1vcpu-1gb', name: 'Basic 1GB', vcpus: 1, memory: 1024, disk: 25, price: 6 },
  { slug: 's-1vcpu-2gb', name: 'Basic 2GB', vcpus: 1, memory: 2048, disk: 50, price: 12 },
  { slug: 's-2vcpu-4gb', name: 'Basic 4GB', vcpus: 2, memory: 4096, disk: 80, price: 24 },
  { slug: 's-4vcpu-8gb', name: 'Basic 8GB', vcpus: 4, memory: 8192, disk: 160, price: 48 },
  { slug: 's-8vcpu-16gb', name: 'Basic 16GB', vcpus: 8, memory: 16384, disk: 320, price: 96 },
] as const;

// Regions
export const REGIONS = [
  { slug: 'nyc1', name: 'New York 1', country: 'USA', flag: '🇺🇸' },
  { slug: 'sfo3', name: 'San Francisco 3', country: 'USA', flag: '🇺🇸' },
  { slug: 'ams3', name: 'Amsterdam 3', country: 'Netherlands', flag: '🇳🇱' },
  { slug: 'sgp1', name: 'Singapore 1', country: 'Singapore', flag: '🇸🇬' },
  { slug: 'lon1', name: 'London 1', country: 'UK', flag: '🇬🇧' },
  { slug: 'fra1', name: 'Frankfurt 1', country: 'Germany', flag: '🇩🇪' },
] as const;

// OS Images
export const OS_IMAGES = [
  { slug: 'ubuntu-22-04-x64', name: 'Ubuntu 22.04 LTS', type: 'Linux' },
  { slug: 'ubuntu-20-04-x64', name: 'Ubuntu 20.04 LTS', type: 'Linux' },
  { slug: 'debian-12-x64', name: 'Debian 12', type: 'Linux' },
  { slug: 'centos-stream-9-x64', name: 'CentOS Stream 9', type: 'Linux' },
  { slug: 'fedora-39-x64', name: 'Fedora 39', type: 'Linux' },
] as const;

// Status colors
export const STATUS_COLORS = {
  active: 'bg-green-500',
  running: 'bg-green-500',
  pending: 'bg-yellow-500',
  processing: 'bg-blue-500',
  offline: 'bg-red-500',
  error: 'bg-red-500',
  cancelled: 'bg-gray-500',
} as const;

// Product categories
export const PRODUCT_CATEGORIES = [
  'Réseau',
  'Stockage',
  'Serveur',
  'Sécurité',
  'Accessoires',
] as const;

// User roles
export const USER_ROLES = ['client', 'seller', 'admin'] as const;

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

// Date format
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';

// Currency
export const CURRENCY = 'EUR';
export const CURRENCY_SYMBOL = '€';
