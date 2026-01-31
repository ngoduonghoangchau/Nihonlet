import FingerprintJS from '@fingerprintjs/fingerprintjs';
import type { DeviceInfoDto } from '../types/auth';

// ===== Cached fingerprint to avoid regenerating =====
let cachedFingerprint: string | null = null;

// ===== Get Browser/OS Info for Device Name =====
const getDeviceName = (): string => {
  const userAgent = navigator.userAgent;
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  
  // Detect browser
  if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Edg')) {
    browser = 'Edge';
  } else if (userAgent.includes('Chrome')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Safari')) {
    browser = 'Safari';
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    browser = 'Opera';
  }
  
  // Detect OS
  if (userAgent.includes('Windows NT 10') || userAgent.includes('Windows NT 11')) {
    os = 'Windows';
  } else if (userAgent.includes('Mac OS X')) {
    os = 'macOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    os = 'iOS';
  }
  
  return `${browser} on ${os}`;
};

// ===== Generate Device Fingerprint =====
export const generateFingerprint = async (): Promise<string> => {
  if (cachedFingerprint) {
    return cachedFingerprint;
  }
  
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    cachedFingerprint = result.visitorId;
    return cachedFingerprint;
  } catch (error) {
    console.error('Failed to generate fingerprint:', error);
    // Fallback: Generate a random ID and store in localStorage
    let fallbackId = localStorage.getItem('device_fingerprint');
    if (!fallbackId) {
      fallbackId = crypto.randomUUID().replace(/-/g, '');
      localStorage.setItem('device_fingerprint', fallbackId);
    }
    cachedFingerprint = fallbackId;
    return cachedFingerprint;
  }
};

// ===== Get Device Info DTO =====
export const getDeviceInfo = async (): Promise<DeviceInfoDto> => {
  const fingerprint = await generateFingerprint();
  return {
    fingerprint,
    deviceName: getDeviceName(),
  };
};

// ===== Clear Cached Fingerprint (for testing) =====
export const clearFingerprintCache = (): void => {
  cachedFingerprint = null;
};
