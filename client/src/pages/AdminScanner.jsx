import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import toast from 'react-hot-toast';
import { FiCamera, FiPause, FiPlay } from 'react-icons/fi';
import AdminLayout from '../layouts/AdminLayout';
import ScanResultCard from '../components/admin/ScanResultCard';
import { scanCheckIn } from '../services/api';

const SCANNER_ELEMENT_ID = 'dana-qr-reader';
const RESCAN_COOLDOWN_MS = 3000;

// QR codes now encode a full "/verify/<token>" URL (so scanning with a
// generic camera / Google Lens shows the registrant's details), so pull the
// raw token back out of that URL for the check-in API. Falls back to the
// scanned text as-is if it isn't a URL (older QR codes just held the token).
function extractQrToken(decodedText) {
  try {
    const url = new URL(decodedText);
    const segments = url.pathname.split('/').filter(Boolean);
    return segments[segments.length - 1] || decodedText;
  } catch {
    return decodedText;
  }
}

export default function AdminScanner() {
  const scannerRef = useRef(null);
  const lastScanRef = useRef({ text: null, at: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [result, setResult] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleScanSuccess = useCallback(async (decodedText) => {
    const now = Date.now();
    if (lastScanRef.current.text === decodedText && now - lastScanRef.current.at < RESCAN_COOLDOWN_MS) {
      return;
    }
    lastScanRef.current = { text: decodedText, at: now };

    if (processing) return;
    setProcessing(true);

    try {
      const { data } = await scanCheckIn(extractQrToken(decodedText));
      setResult({
        status: 'success',
        title: 'Check-In Successful',
        message: data.message,
        profile: mapProfile(data.data.registration),
        timestamp: now,
      });
      toast.success(data.message);
    } catch (err) {
      const res = err?.response;
      if (res?.status === 409 && res.data?.alreadyCheckedIn) {
        setResult({
          status: 'duplicate',
          title: 'Already Checked In',
          message: res.data.message,
          profile: mapProfile(res.data.data.registration),
          timestamp: now,
        });
        toast(res.data.message, { icon: '⚠️' });
      } else {
        const message = res?.data?.message || 'Invalid QR code or scan failed.';
        setResult({ status: 'error', title: 'Scan Failed', message, profile: null, timestamp: now });
        toast.error(message);
      }
    } finally {
      setProcessing(false);
    }
  }, [processing]);

  useEffect(() => {
    const instance = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = instance;

    instance
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 260, height: 260 } },
        (decodedText) => handleScanSuccess(decodedText),
        () => {} // per-frame scan failure, ignored
      )
      .then(() => setIsRunning(true))
      .catch((err) => setCameraError(err?.message || 'Unable to access camera'));

    return () => {
      if (instance.isScanning) {
        instance.stop().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleScanner = async () => {
    const instance = scannerRef.current;
    if (!instance) return;
    try {
      if (isRunning) {
        await instance.pause(true);
        setIsRunning(false);
      } else {
        await instance.resume();
        setIsRunning(true);
      }
    } catch {
      toast.error('Unable to toggle camera');
    }
  };

  return (
    <AdminLayout title="QR Attendance Scanner">
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-primary-dark flex items-center gap-2">
              <FiCamera /> Camera
            </h3>
            <button
              onClick={toggleScanner}
              className="inline-flex items-center gap-2 rounded-full border border-primary text-primary px-4 py-1.5 text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              {isRunning ? <><FiPause /> Pause</> : <><FiPlay /> Resume</>}
            </button>
          </div>

          <div id={SCANNER_ELEMENT_ID} className="rounded-xl overflow-hidden bg-slate-900 min-h-[320px]" />

          {cameraError && (
            <p className="text-red-500 text-sm mt-4">
              Camera error: {cameraError}. Please allow camera access and reload the page.
            </p>
          )}
          {processing && <p className="text-primary text-sm mt-4 animate-pulse">Verifying QR code...</p>}
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="font-heading font-bold text-primary-dark mb-2">Scan Result</h3>
            <p className="text-sm text-slate-500 mb-4">Point the camera at an attendee&rsquo;s QR code to check them in.</p>
            {result ? (
              <ScanResultCard result={result} />
            ) : (
              <p className="text-slate-400 text-sm text-center py-12">No scans yet. Awaiting a QR code...</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function mapProfile(registration) {
  if (!registration) return null;
  return {
    registrationId: registration.registrationId,
    fullName: registration.fullName,
    company: registration.company,
    registrationType: registration.registrationType,
    mobile: registration.mobile,
  };
}
