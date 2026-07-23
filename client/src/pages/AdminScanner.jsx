import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import toast from 'react-hot-toast';
import { FiCamera, FiPause, FiPlay } from 'react-icons/fi';
import AdminLayout from '../layouts/AdminLayout';
import ScanResultCard from '../components/admin/ScanResultCard';
import { scanCheckIn, verifyRegistration } from '../services/api';

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

export default function AdminScanner() {
  const scannerRef = useRef(null);
  const lastScanRef = useRef({ text: null, at: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [result, setResult] = useState(null);
  const [processing, setProcessing] = useState(false);

  // html5-qrcode's `isScanning` flag stays true whether the camera is
  // actively scanning or merely paused (it only flips on start()/stop()),
  // so pause/resume state has to be tracked via our own `isRunning` state
  // instead of querying the instance.
  const pauseCamera = useCallback(() => {
    const instance = scannerRef.current;
    if (!instance || !isRunning) return;
    try {
      instance.pause(true);
      setIsRunning(false);
    } catch {
      // already paused/stopped — nothing to do
    }
  }, [isRunning]);

  const resumeCamera = useCallback(() => {
    const instance = scannerRef.current;
    if (!instance || isRunning) return;
    try {
      instance.resume();
      setIsRunning(true);
    } catch {
      // already scanning — nothing to do
    }
  }, [isRunning]);

  // Step 1: scanning a QR code only looks the attendee up and shows their
  // details — nothing is written to the database yet. This mirrors how a
  // real check-in desk works: the staff member sees who it is before
  // waving them through, rather than the scan itself silently checking
  // someone in.
  const handleScanSuccess = useCallback(async (decodedText) => {
    const now = Date.now();
    if (lastScanRef.current.text === decodedText && now - lastScanRef.current.at < RESCAN_COOLDOWN_MS) {
      return;
    }
    lastScanRef.current = { text: decodedText, at: now };

    if (processing) return;
    setProcessing(true);
    pauseCamera();
    const qrToken = extractQrToken(decodedText);

    try {
      const { data } = await verifyRegistration(qrToken);
      const reg = data.data;

      if (reg.status === 'cancelled') {
        setResult({
          status: 'error',
          title: 'Registration Cancelled',
          message: `${reg.fullName}'s registration has been cancelled and cannot be checked in.`,
          profile: mapProfile(reg),
          timestamp: now,
        });
      } else if (reg.isCheckedIn) {
        setResult({
          status: 'duplicate',
          title: 'Already Checked In',
          message: `${reg.fullName} was already checked in at ${new Date(reg.checkedInAt).toLocaleTimeString('en-IN')}.`,
          profile: mapProfile(reg),
          timestamp: now,
        });
      } else {
        setResult({
          status: 'preview',
          title: 'Attendee Found',
          message: `Confirm check-in for ${reg.fullName}?`,
          profile: mapProfile(reg),
          qrToken,
          timestamp: now,
        });
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Invalid QR code or scan failed.';
      setResult({ status: 'error', title: 'Scan Failed', message, profile: null, timestamp: now });
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  }, [processing, pauseCamera]);

  // Step 2: staff explicitly confirms — this is the only action that
  // actually marks the attendee as checked in.
  const handleConfirmCheckIn = useCallback(async (qrToken) => {
    setProcessing(true);
    try {
      const { data } = await scanCheckIn(qrToken);
      setResult({
        status: 'success',
        title: 'Check-In Successful',
        message: data.message,
        profile: mapProfile(data.data.registration),
        timestamp: Date.now(),
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
          timestamp: Date.now(),
        });
      } else {
        const message = res?.data?.message || 'Check-in failed. Please try again.';
        setResult({ status: 'error', title: 'Check-In Failed', message, profile: null, timestamp: Date.now() });
        toast.error(message);
      }
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setResult(null);
    resumeCamera();
  }, [resumeCamera]);

  // instance.start() below only runs once on mount, so the callback it's
  // given would otherwise permanently close over that render's stale
  // `handleScanSuccess` (and in turn stale `processing`/`isRunning`).
  // Routing through a ref that's kept current every render means the
  // camera always dispatches to the latest version.
  const handleScanSuccessRef = useRef(handleScanSuccess);
  useEffect(() => {
    handleScanSuccessRef.current = handleScanSuccess;
  }, [handleScanSuccess]);

  useEffect(() => {
    const instance = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = instance;

    instance
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 260, height: 260 } },
        (decodedText) => handleScanSuccessRef.current(decodedText),
        () => {} // per-frame scan failure, ignored
      )
      .then(() => setIsRunning(true))
      .catch((err) => setCameraError(err?.message || 'Unable to access camera'));

    return () => {
      if (instance.isScanning) {
        instance.stop().catch(() => {});
      }
    };
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
      <div className="max-w-xl mx-auto">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-primary-dark flex items-center gap-2">
              <FiCamera /> {result ? 'Attendee Details' : 'Camera'}
            </h3>
            {!result && (
              <button
                onClick={toggleScanner}
                className="inline-flex items-center gap-2 rounded-full border border-primary text-primary px-4 py-1.5 text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                {isRunning ? <><FiPause /> Pause</> : <><FiPlay /> Resume</>}
              </button>
            )}
          </div>

          {/* The scanner element must stay mounted at all times — html5-qrcode
              binds to this DOM node directly, so removing it from the tree
              (rather than just hiding it) would kill the running camera
              instance. Scanning a QR code pauses it and shows the details
              panel below in its place; Cancel/Scan Next un-hides it again. */}
          <div className={result ? 'hidden' : ''}>
            <div id={SCANNER_ELEMENT_ID} className="rounded-xl overflow-hidden bg-slate-900 min-h-[320px]" />
            {cameraError && (
              <p className="text-red-500 text-sm mt-4">
                Camera error: {cameraError}. Please allow camera access and reload the page.
              </p>
            )}
            {processing && <p className="text-primary text-sm mt-4 animate-pulse">Looking up QR code...</p>}
            <p className="text-slate-400 text-sm text-center py-6">Point the camera at an attendee&rsquo;s QR code to look them up.</p>
          </div>

          {result && (
            <ScanResultCard
              result={result}
              processing={processing}
              onConfirm={handleConfirmCheckIn}
              onDismiss={handleDismiss}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
