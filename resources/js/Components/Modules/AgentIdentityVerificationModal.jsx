import { useState, useEffect, useRef, useCallback } from "react";
import { router } from "@inertiajs/react";

/**
 * AgentIdentityVerificationModal
 * -------------------------------
 * Replaces the old document-upload agent verification flow with a
 * Ghana Card + biometric identity check against the NIA (National
 * Identification Authority).
 *
 * Flow:
 *   1. intro            – "Verify your identity" overview
 *   2. pin               – Enter Ghana Card number + PIN
 *   3. consent            – Accept privacy / verification consent
 *   4. biometric_intro     – Start biometric verification (camera primer)
 *   5. capture               – Live biometric capture (selfie + liveness)
 *   6. nia_verify              – NIA verification (polling)
 *   7. success / failed          – Identity verified (or retry)
 *
 * BACKEND CONTRACT (adjust routes/payloads to match your controllers):
 *   POST /agent-verification/ghana-card
 *        body: { ghana_card_number, ghana_card_pin }
 *        -> 200 { ok: true }  |  422 { message }
 *
 *   POST /agent-verification/consent
 *        body: { consent_accepted: true }
 *        -> 200 { ok: true }
 *
 *   POST /agent-verification/biometric-capture
 *        body: FormData { selfie: Blob, liveness_check: 'blink'|'smile'... }
 *        -> 200 { ok: true, verification_id }
 *
 *   GET  /agent-verification/nia-status?verification_id=...
 *        -> 200 { status: 'pending'|'verified'|'failed', reason? }
 *
 * None of these routes exist yet in the codebase shown to me — wire them
 * up in AgentVerificationController and swap the fetch/router.post calls
 * below if your actual paths differ.
 */

// ----- Icons -----
const ShieldCheck = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const X = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const CheckCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const AlertCircle = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IdCard = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    <circle cx="8" cy="12" r="2" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10h5M13 14h3" />
  </svg>
);
const Lock = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v2h8z" />
  </svg>
);
const Eye = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EyeOff = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M10.584 10.587a2 2 0 002.828 2.83M9.363 5.365A9.466 9.466 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.02 10.02 0 01-4.293 5.302M6.223 6.223A9.978 9.978 0 002.458 12c1.274 4.057 5.064 7 9.542 7a9.958 9.958 0 004.293-.964" />
  </svg>
);
const Camera = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <circle cx="12" cy="13" r="3.5" strokeWidth={2} />
  </svg>
);
const ScanFace = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2M8 20H6a2 2 0 01-2-2v-2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10v1m6-1v1M9 15c.83.63 1.874 1 3 1s2.17-.37 3-1" />
  </svg>
);
const Building = ({ style }) => (
  <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
  </svg>
);

// ----- Step config (drives the progress rail) -----
const STEP_ORDER = ["intro", "pin", "consent", "biometric_intro", "capture", "nia_verify", "success"];
const STEP_LABELS = {
  intro: "Identity",
  pin: "Ghana Card",
  consent: "Consent",
  biometric_intro: "Biometric",
  capture: "Capture",
  nia_verify: "NIA Check",
  success: "Complete",
};

const formatGhanaCardNumber = (raw) => {
  const digits = raw.replace(/[^0-9]/g, "").slice(0, 9);
  if (digits.length <= 9) return digits;
  return digits;
};

const isValidGhanaCard = (num) => /^\d{9}$/.test(num.replace(/[^0-9]/g, ""));

const AgentIdentityVerificationModal = ({ isOpen, onClose, agentData, onVerified }) => {
  const [currentStep, setCurrentStep] = useState("intro");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const [ghanaCardNumber, setGhanaCardNumber] = useState("");
  const [ghanaCardPin, setGhanaCardPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  const [consentChecks, setConsentChecks] = useState({
    nia_share: false,
    terms: false,
  });

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [livenessPrompt, setLivenessPrompt] = useState("Look straight at the camera");

  const [verificationId, setVerificationId] = useState(null);
  const [niaFailReason, setNiaFailReason] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const pollRef = useRef(null);

  // ---------- Reset everything when the modal opens ----------
  useEffect(() => {
    if (isOpen) {
      setCurrentStep("intro");
      setIsProcessing(false);
      setError(null);
      setGhanaCardNumber("");
      setGhanaCardPin("");
      setShowPin(false);
      setConsentChecks({ nia_share: false, terms: false });
      setCameraReady(false);
      setCameraError(null);
      setCapturedImage(null);
      setVerificationId(null);
      setNiaFailReason(null);
    }
  }, [isOpen]);

  // ---------- Camera lifecycle ----------
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch (err) {
      setCameraError(
        err?.name === "NotAllowedError"
          ? "Camera access was denied. Please allow camera permission and try again."
          : "Could not access your camera. Check that no other app is using it."
      );
      setCameraReady(false);
    }
  }, []);

  useEffect(() => {
    if (currentStep === "capture") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [currentStep, startCamera, stopCamera]);

  // Cleanup camera + polling on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [stopCamera]);

  // ---------- Step 2: Ghana Card + PIN ----------
  const handlePinSubmit = () => {
    setError(null);

    if (!isValidGhanaCard(ghanaCardNumber)) {
      setError("Enter a valid Ghana Card personal number (9 digits, e.g. GHA-123456789-0).");
      return;
    }
    if (!ghanaCardPin || ghanaCardPin.length < 4) {
      setError("Enter the PIN associated with your Ghana Card.");
      return;
    }

    setIsProcessing(true);
    router.post(
      "/agent-verification/ghana-card",
      {
        ghana_card_number: `GHA-${ghanaCardNumber}`,
        ghana_card_pin: ghanaCardPin,
      },
      {
        preserveScroll: true,
        onSuccess: () => setCurrentStep("consent"),
        onError: (errs) => {
          setError(Object.values(errs)[0] || "We couldn't validate that Ghana Card. Please check the details and try again.");
        },
        onFinish: () => setIsProcessing(false),
      }
    );
  };

  // ---------- Step 3: Consent ----------
  const allConsentGiven = consentChecks.nia_share && consentChecks.terms;

  const handleConsentSubmit = () => {
    if (!allConsentGiven) return;
    setError(null);
    setIsProcessing(true);

    router.post(
      "/agent-verification/consent",
      { consent_accepted: true },
      {
        preserveScroll: true,
        onSuccess: () => setCurrentStep("biometric_intro"),
        onError: (errs) => setError(Object.values(errs)[0] || "Something went wrong recording your consent."),
        onFinish: () => setIsProcessing(false),
      }
    );
  };

  // ---------- Step 5: Capture ----------
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const size = Math.min(video.videoWidth, video.videoHeight) || 480;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const offsetX = (video.videoWidth - size) / 2;
    const offsetY = (video.videoHeight - size) / 2;
    ctx.translate(size, 0);
    ctx.scale(-1, 1); // mirror to match the preview
    ctx.drawImage(video, offsetX, offsetY, size, size, 0, 0, size, size);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setLivenessPrompt("Look straight at the camera");
    startCamera();
  };

  const handleSubmitBiometric = async () => {
    if (!capturedImage) return;
    setError(null);
    setIsProcessing(true);

    try {
      const blob = await (await fetch(capturedImage)).blob();
      const formData = new FormData();
      formData.append("selfie", blob, "biometric-capture.jpg");
      formData.append("liveness_check", "blink");

      router.post("/agent-verification/biometric-capture", formData, {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: (page) => {
          const newVerificationId = page?.props?.verification_id ?? null;
          setVerificationId(newVerificationId);
          setCurrentStep("nia_verify");
        },
        onError: (errs) => {
          setError(Object.values(errs)[0] || "We couldn't process that capture. Please retake your photo.");
        },
        onFinish: () => setIsProcessing(false),
      });
    } catch (err) {
      setError("Something went wrong preparing your photo. Please retake it.");
      setIsProcessing(false);
    }
  };

  // ---------- Step 6: NIA verification (poll) ----------
  useEffect(() => {
    if (currentStep !== "nia_verify") return;

    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch(
          `/agent-verification/nia-status${verificationId ? `?verification_id=${verificationId}` : ""}`,
          { headers: { Accept: "application/json" } }
        );
        const json = await res.json();
        if (cancelled) return;

        if (json.status === "verified") {
          clearInterval(pollRef.current);
          setCurrentStep("success");
          onVerified?.();
        } else if (json.status === "failed") {
          clearInterval(pollRef.current);
          setNiaFailReason(json.reason || "NIA could not confirm your identity from the details provided.");
          setCurrentStep("failed");
        }
        // 'pending' — keep polling
      } catch {
        // network hiccup — keep polling, don't fail the whole flow on one bad request
      }
    };

    poll();
    pollRef.current = setInterval(poll, 3000);

    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [currentStep, verificationId, onVerified]);

  const handleRetryAfterFailure = () => {
    setNiaFailReason(null);
    setCapturedImage(null);
    setCurrentStep("biometric_intro");
  };

  const handleClose = () => {
    if (isProcessing) return;
    stopCamera();
    if (pollRef.current) clearInterval(pollRef.current);
    onClose?.();
  };

  if (!isOpen) return null;

  const stepIndex = STEP_ORDER.indexOf(currentStep === "failed" ? "nia_verify" : currentStep);

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes aivmModalIn { from { opacity: 0; transform: translateY(16px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes aivmBackdropIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes aivmSheetUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes aivmPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes aivmScan { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }

        .aivm-overlay {
          position: fixed; inset: 0; background-color: rgba(15, 23, 26, 0.55);
          display: flex; align-items: center; justify-content: center; z-index: 1000;
          padding: 1.5rem; animation: aivmBackdropIn 0.2s ease-out; overflow-y: auto;
        }
        .aivm-modal {
          background-color: white; border-radius: 1.25rem; width: 100%; max-width: 32rem;
          max-height: 92vh; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(15, 23, 26, 0.35);
          animation: aivmModalIn 0.25s ease-out; display: flex; flex-direction: column; margin: auto;
        }
        .aivm-header {
          padding: 1.5rem 1.75rem 1.125rem; border-bottom: 1px solid hsl(40 20% 90%);
          display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-shrink: 0;
        }
        .aivm-header-left { display: flex; align-items: center; gap: 0.875rem; min-width: 0; }
        .aivm-header-icon {
          width: 2.75rem; height: 2.75rem; border-radius: 0.75rem;
          background: linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .aivm-header-title { font-size: 1.1875rem; font-weight: 700; color: hsl(200 25% 15%); margin-bottom: 0.125rem; line-height: 1.25; }
        .aivm-header-subtitle { font-size: 0.8125rem; color: hsl(200 15% 45%); }
        .aivm-close-btn {
          padding: 0.5rem; border: none; background-color: hsl(40 20% 95%); cursor: pointer;
          border-radius: 0.625rem; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
          transition: background-color 0.15s;
        }
        .aivm-close-btn:hover:not(:disabled) { background-color: hsl(40 20% 90%); }
        .aivm-close-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .aivm-rail { display: flex; align-items: center; gap: 0.25rem; padding: 0.875rem 1.75rem 0; flex-shrink: 0; }
        .aivm-rail-dot {
          flex: 1; height: 0.25rem; border-radius: 999px; background-color: hsl(40 20% 90%);
          transition: background-color 0.2s;
        }
        .aivm-rail-dot--done { background-color: hsl(174 62% 32%); }
        .aivm-rail-dot--current { background-color: hsl(174 62% 32% / 0.45); }

        .aivm-body { padding: 1.75rem; overflow-y: auto; flex: 1; }

        .aivm-banner {
          padding: 0.875rem 1rem; border-radius: 0.75rem; display: flex; gap: 0.625rem;
          align-items: flex-start; margin-bottom: 1.25rem;
        }
        .aivm-banner--error { background-color: hsl(0 72% 51% / 0.06); border: 1px solid hsl(0 72% 51% / 0.25); }
        .aivm-banner--info { background-color: hsl(48 96% 89%); border: 1px solid hsl(48 96% 70%); }

        .aivm-center { display: flex; flex-direction: column; align-items: center; text-align: center; }
        .aivm-icon-circle {
          width: 4.5rem; height: 4.5rem; border-radius: 50%; display: flex; align-items: center;
          justify-content: center; margin-bottom: 1.25rem; background-color: hsl(174 62% 32% / 0.1);
        }
        .aivm-title { font-size: 1.1875rem; font-weight: 700; color: hsl(200 25% 15%); margin-bottom: 0.5rem; }
        .aivm-text { font-size: 0.875rem; color: hsl(200 15% 45%); line-height: 1.6; max-width: 24rem; margin-bottom: 1.5rem; }

        .aivm-checklist { list-style: none; padding: 0; margin: 0 0 1.5rem; width: 100%; text-align: left; }
        .aivm-checklist li {
          display: flex; align-items: center; gap: 0.625rem; padding: 0.625rem 0;
          border-bottom: 1px solid hsl(40 20% 92%); font-size: 0.8125rem; color: hsl(200 25% 15%);
        }
        .aivm-checklist li:last-child { border-bottom: none; }

        .aivm-field { margin-bottom: 1.25rem; text-align: left; }
        .aivm-label { display: block; font-size: 0.875rem; font-weight: 600; color: hsl(200 25% 15%); margin-bottom: 0.5rem; }
        .aivm-input-wrap { position: relative; display: flex; align-items: center; }
        .aivm-input-prefix {
          position: absolute; left: 0.875rem; font-size: 0.9375rem; font-weight: 600; color: hsl(200 15% 45%);
          pointer-events: none;
        }
        .aivm-input {
          width: 100%; padding: 0.75rem 0.875rem; border: 1px solid hsl(40 20% 88%); border-radius: 0.625rem;
          font-size: 1rem; font-family: inherit; box-sizing: border-box; letter-spacing: 0.02em;
        }
        .aivm-input--with-prefix { padding-left: 3.25rem; }
        .aivm-input--with-suffix { padding-right: 2.75rem; }
        .aivm-input:focus { outline: none; border-color: hsl(174 62% 32%); box-shadow: 0 0 0 3px hsl(174 62% 32% / 0.12); }
        .aivm-input-suffix-btn {
          position: absolute; right: 0.5rem; padding: 0.375rem; border: none; background: transparent;
          cursor: pointer; display: flex; align-items: center; justify-content: center; color: hsl(200 15% 45%);
        }
        .aivm-hint { font-size: 0.75rem; color: hsl(200 15% 55%); margin-top: 0.375rem; }

        .aivm-consent-row {
          display: flex; gap: 0.75rem; padding: 0.875rem; border: 1px solid hsl(40 20% 88%);
          border-radius: 0.75rem; margin-bottom: 0.75rem; text-align: left; cursor: pointer;
          transition: border-color 0.15s, background-color 0.15s;
        }
        .aivm-consent-row:hover { border-color: hsl(174 62% 32% / 0.4); }
        .aivm-consent-row--checked { border-color: hsl(174 62% 32%); background-color: hsl(174 62% 32% / 0.04); }
        .aivm-consent-row input { accent-color: hsl(174 62% 32%); width: 1.125rem; height: 1.125rem; min-width: 1.125rem; margin-top: 0.125rem; cursor: pointer; }
        .aivm-consent-row-title { font-size: 0.8125rem; font-weight: 600; color: hsl(200 25% 15%); margin-bottom: 0.125rem; }
        .aivm-consent-row-desc { font-size: 0.78rem; color: hsl(200 15% 45%); line-height: 1.5; }

        .aivm-camera-frame {
          position: relative; width: 15rem; height: 15rem; border-radius: 50%; overflow: hidden;
          margin: 0 auto 1.25rem; background-color: hsl(200 25% 10%); border: 3px solid hsl(174 62% 32% / 0.35);
        }
        .aivm-camera-frame video, .aivm-camera-frame img {
          width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1);
        }
        .aivm-camera-frame img { transform: scaleX(1); }
        .aivm-scan-line {
          position: absolute; left: 0; right: 0; height: 2px; background: hsl(174 70% 55%);
          box-shadow: 0 0 8px hsl(174 70% 55%); animation: aivmScan 2.2s ease-in-out infinite;
        }
        .aivm-camera-placeholder {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: hsl(0 0% 100% / 0.5);
        }

        .aivm-nia-spinner {
          width: 3.5rem; height: 3.5rem; border-radius: 50%; border: 3px solid hsl(174 62% 32% / 0.2);
          border-top-color: hsl(174 62% 32%); animation: spin 1s linear infinite; margin-bottom: 1.25rem;
        }
        .aivm-nia-step {
          display: flex; align-items: center; gap: 0.625rem; font-size: 0.8125rem; color: hsl(200 15% 45%);
          margin-bottom: 0.5rem; animation: aivmPulse 1.8s ease-in-out infinite;
        }

        .aivm-footer {
          padding: 1.25rem 1.75rem; border-top: 1px solid hsl(40 20% 90%); background-color: hsl(40 30% 98%);
          display: flex; gap: 0.75rem; flex-shrink: 0;
        }
        .aivm-btn {
          padding: 0.875rem 1.25rem; border-radius: 0.625rem; font-weight: 600; font-size: 0.875rem;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          min-height: 3rem; transition: filter 0.15s, background-color 0.15s; border: none;
        }
        .aivm-btn:disabled { cursor: not-allowed; }
        .aivm-btn--secondary { border: 1px solid hsl(40 20% 88%); background-color: white; color: hsl(200 15% 45%); }
        .aivm-btn--secondary:hover:not(:disabled) { background-color: hsl(40 20% 96%); }
        .aivm-btn--primary { background: linear-gradient(135deg, hsl(174 62% 32%) 0%, hsl(174 50% 25%) 100%); color: white; }
        .aivm-btn--primary:hover:not(:disabled) { filter: brightness(1.06); }
        .aivm-btn--primary:disabled { background: hsl(200 15% 65%); }

        @media (max-width: 640px) {
          .aivm-overlay { padding: 0; align-items: flex-end; }
          .aivm-modal { max-height: 96vh; max-width: 100%; border-radius: 1.25rem 1.25rem 0 0; animation: aivmSheetUp 0.28s ease-out; }
          .aivm-header { padding: 1.125rem 1.125rem 1rem; }
          .aivm-body { padding: 1.125rem; }
          .aivm-footer { padding: 1rem 1.125rem; flex-direction: column-reverse; }
          .aivm-footer .aivm-btn { width: 100%; flex: 1 1 auto !important; }
          .aivm-camera-frame { width: 12rem; height: 12rem; }
        }
      `}</style>

      <div className="aivm-overlay" onClick={(e) => { if (e.target === e.currentTarget && !isProcessing) handleClose(); }}>
        <div className="aivm-modal">
          {/* Header */}
          <div className="aivm-header">
            <div className="aivm-header-left">
              <div className="aivm-header-icon">
                <ShieldCheck style={{ height: "1.375rem", width: "1.375rem", color: "white" }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <h2 className="aivm-header-title">Verify Your Identity</h2>
                <p className="aivm-header-subtitle">
                  {agentData?.name ? `Agent verification for ${agentData.name}` : "Ghana Card + biometric verification"}
                </p>
              </div>
            </div>
            <button onClick={handleClose} disabled={isProcessing} className="aivm-close-btn">
              <X style={{ height: "1.25rem", width: "1.25rem", color: "hsl(200 15% 45%)" }} />
            </button>
          </div>

          {/* Progress rail */}
          {currentStep !== "success" && (
            <div className="aivm-rail">
              {STEP_ORDER.slice(0, 6).map((step, i) => (
                <div
                  key={step}
                  className={`aivm-rail-dot ${i < stepIndex ? "aivm-rail-dot--done" : i === stepIndex ? "aivm-rail-dot--current" : ""}`}
                />
              ))}
            </div>
          )}

          <div className="aivm-body">
            {error && (
              <div className="aivm-banner aivm-banner--error">
                <AlertCircle style={{ height: "1.125rem", width: "1.125rem", color: "hsl(0 72% 51%)", flexShrink: 0, marginTop: "0.1rem" }} />
                <p style={{ fontSize: "0.8125rem", color: "hsl(0 72% 40%)", margin: 0, lineHeight: 1.5 }}>{error}</p>
              </div>
            )}

            {/* ---------- Step: intro ---------- */}
            {currentStep === "intro" && (
              <div className="aivm-center">
                <div className="aivm-icon-circle">
                  <IdCard style={{ height: "2rem", width: "2rem", color: "hsl(174 62% 32%)" }} />
                </div>
                <h3 className="aivm-title">Let's confirm it's really you</h3>
                <p className="aivm-text">
                  We verify every agent's identity against the National Identification Authority (NIA) using your
                  Ghana Card. It only takes a couple of minutes.
                </p>
                <ul className="aivm-checklist">
                  <li><IdCard style={{ height: "1rem", width: "1rem", color: "hsl(174 62% 32%)", flexShrink: 0 }} /> Your Ghana Card number and PIN</li>
                  <li><Camera style={{ height: "1rem", width: "1rem", color: "hsl(174 62% 32%)", flexShrink: 0 }} /> Camera access for a live selfie</li>
                  <li><ShieldCheck style={{ height: "1rem", width: "1rem", color: "hsl(174 62% 32%)", flexShrink: 0 }} /> Good lighting and a clear face view</li>
                </ul>
              </div>
            )}

            {/* ---------- Step: pin ---------- */}
            {currentStep === "pin" && (
              <div>
                <div className="aivm-field">
                  <label className="aivm-label">Ghana Card Number</label>
                  <div className="aivm-input-wrap">
                    <span className="aivm-input-prefix">GHA-</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={ghanaCardNumber}
                      onChange={(e) => setGhanaCardNumber(formatGhanaCardNumber(e.target.value))}
                      placeholder="123456789"
                      className="aivm-input aivm-input--with-prefix"
                      disabled={isProcessing}
                    />
                  </div>
                  <p className="aivm-hint">Enter the 9 digits after "GHA-" on your card, e.g. GHA-123456789-0.</p>
                </div>

                <div className="aivm-field">
                  <label className="aivm-label">Ghana Card PIN</label>
                  <div className="aivm-input-wrap">
                    <input
                      type={showPin ? "text" : "password"}
                      inputMode="numeric"
                      value={ghanaCardPin}
                      onChange={(e) => setGhanaCardPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 8))}
                      placeholder="Enter your PIN"
                      className="aivm-input aivm-input--with-suffix"
                      disabled={isProcessing}
                    />
                    <button type="button" className="aivm-input-suffix-btn" onClick={() => setShowPin((v) => !v)} tabIndex={-1}>
                      {showPin ? <EyeOff style={{ height: "1.125rem", width: "1.125rem" }} /> : <Eye style={{ height: "1.125rem", width: "1.125rem" }} />}
                    </button>
                  </div>
                  <p className="aivm-hint" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Lock style={{ height: "0.8rem", width: "0.8rem" }} /> Your PIN is sent securely and never stored in plain text.
                  </p>
                </div>
              </div>
            )}

            {/* ---------- Step: consent ---------- */}
            {currentStep === "consent" && (
              <div>
                <p style={{ fontSize: "0.875rem", color: "hsl(200 25% 15%)", marginBottom: "1.125rem", lineHeight: 1.6 }}>
                  Before we continue, please review and accept the following:
                </p>

                <label className={`aivm-consent-row ${consentChecks.nia_share ? "aivm-consent-row--checked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={consentChecks.nia_share}
                    onChange={(e) => setConsentChecks((prev) => ({ ...prev, nia_share: e.target.checked }))}
                  />
                  <div>
                    <p className="aivm-consent-row-title">Share my details with the NIA</p>
                    <p className="aivm-consent-row-desc">
                      I consent to RentTrustGH sending my Ghana Card number and a live biometric capture to the
                      National Identification Authority solely to confirm my identity.
                    </p>
                  </div>
                </label>

                <label className={`aivm-consent-row ${consentChecks.terms ? "aivm-consent-row--checked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={consentChecks.terms}
                    onChange={(e) => setConsentChecks((prev) => ({ ...prev, terms: e.target.checked }))}
                  />
                  <div>
                    <p className="aivm-consent-row-title">Accept verification terms</p>
                    <p className="aivm-consent-row-desc">
                      I confirm the information I provide is accurate and understand that providing false
                      information may result in my account being suspended.
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* ---------- Step: biometric_intro ---------- */}
            {currentStep === "biometric_intro" && (
              <div className="aivm-center">
                <div className="aivm-icon-circle">
                  <ScanFace style={{ height: "2rem", width: "2rem", color: "hsl(174 62% 32%)" }} />
                </div>
                <h3 className="aivm-title">Ready for your biometric capture</h3>
                <p className="aivm-text">
                  We'll open your camera and ask you to look straight ahead. Find a well-lit spot, remove sunglasses
                  or a face covering, and hold your device at eye level.
                </p>
              </div>
            )}

            {/* ---------- Step: capture ---------- */}
            {currentStep === "capture" && (
              <div className="aivm-center">
                <div className="aivm-camera-frame">
                  {capturedImage ? (
                    <img src={capturedImage} alt="Captured selfie preview" />
                  ) : cameraReady ? (
                    <>
                      <video ref={videoRef} autoPlay playsInline muted />
                      <div className="aivm-scan-line" />
                    </>
                  ) : (
                    <div className="aivm-camera-placeholder">
                      {cameraError ? (
                        <AlertCircle style={{ height: "1.75rem", width: "1.75rem" }} />
                      ) : (
                        <div style={{ width: "1.75rem", height: "1.75rem", border: "2px solid hsl(0 0% 100% / 0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                      )}
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} style={{ display: "none" }} />

                {cameraError ? (
                  <p className="aivm-text" style={{ color: "hsl(0 72% 45%)" }}>{cameraError}</p>
                ) : capturedImage ? (
                  <p className="aivm-text">Happy with this photo? Submit it, or retake it if your face wasn't clearly visible.</p>
                ) : (
                  <p className="aivm-text">{livenessPrompt}</p>
                )}

                {!capturedImage && cameraReady && (
                  <button type="button" onClick={handleCapture} className="aivm-btn aivm-btn--primary" style={{ minWidth: "10rem" }}>
                    <Camera style={{ height: "1.125rem", width: "1.125rem" }} /> Capture Photo
                  </button>
                )}
                {cameraError && (
                  <button type="button" onClick={startCamera} className="aivm-btn aivm-btn--secondary" style={{ minWidth: "10rem" }}>
                    Try Again
                  </button>
                )}
              </div>
            )}

            {/* ---------- Step: nia_verify ---------- */}
            {currentStep === "nia_verify" && (
              <div className="aivm-center">
                <div className="aivm-nia-spinner" />
                <h3 className="aivm-title">Verifying with NIA</h3>
                <p className="aivm-text">This usually takes less than a minute. Please don't close this window.</p>
                <div style={{ width: "100%", maxWidth: "18rem" }}>
                  <div className="aivm-nia-step"><CheckCircle style={{ height: "1rem", width: "1rem", color: "hsl(152 60% 40%)" }} /> Ghana Card details submitted</div>
                  <div className="aivm-nia-step"><CheckCircle style={{ height: "1rem", width: "1rem", color: "hsl(152 60% 40%)" }} /> Biometric capture received</div>
                  <div className="aivm-nia-step" style={{ animationDelay: "0.3s" }}>Matching against NIA records…</div>
                </div>
              </div>
            )}

            {/* ---------- Step: failed ---------- */}
            {currentStep === "failed" && (
              <div className="aivm-center">
                <div className="aivm-icon-circle" style={{ backgroundColor: "hsl(0 72% 51% / 0.1)" }}>
                  <AlertCircle style={{ height: "2rem", width: "2rem", color: "hsl(0 72% 51%)" }} />
                </div>
                <h3 className="aivm-title">We couldn't verify your identity</h3>
                <p className="aivm-text">
                  {niaFailReason || "The NIA couldn't match your details. Double-check your Ghana Card details and try the biometric capture again."}
                </p>
              </div>
            )}

            {/* ---------- Step: success ---------- */}
            {currentStep === "success" && (
              <div className="aivm-center">
                <div className="aivm-icon-circle" style={{ backgroundColor: "hsl(152 60% 40% / 0.1)" }}>
                  <CheckCircle style={{ height: "2rem", width: "2rem", color: "hsl(152 60% 40%)" }} />
                </div>
                <h3 className="aivm-title">Identity Verified</h3>
                <p className="aivm-text">
                  Your identity has been confirmed against the NIA. Your agent account is now verified and ready to
                  list properties.
                </p>
                {agentData?.name && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "hsl(174 62% 32%)", fontWeight: 600, marginBottom: "0.5rem" }}>
                    <Building style={{ height: "1rem", width: "1rem" }} /> {agentData.name}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="aivm-footer">
            {currentStep === "intro" && (
              <button type="button" onClick={() => setCurrentStep("pin")} className="aivm-btn aivm-btn--primary" style={{ flex: 1 }}>
                Start Verification
              </button>
            )}

            {currentStep === "pin" && (
              <>
                <button type="button" onClick={() => setCurrentStep("intro")} disabled={isProcessing} className="aivm-btn aivm-btn--secondary" style={{ flex: 1 }}>
                  Back
                </button>
                <button type="button" onClick={handlePinSubmit} disabled={isProcessing} className="aivm-btn aivm-btn--primary" style={{ flex: 2 }}>
                  {isProcessing ? <span style={{ width: "1rem", height: "1rem", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 1s linear infinite" }} /> : "Continue"}
                </button>
              </>
            )}

            {currentStep === "consent" && (
              <>
                <button type="button" onClick={() => setCurrentStep("pin")} disabled={isProcessing} className="aivm-btn aivm-btn--secondary" style={{ flex: 1 }}>
                  Back
                </button>
                <button type="button" onClick={handleConsentSubmit} disabled={isProcessing || !allConsentGiven} className="aivm-btn aivm-btn--primary" style={{ flex: 2 }}>
                  {isProcessing ? <span style={{ width: "1rem", height: "1rem", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 1s linear infinite" }} /> : "Accept & Continue"}
                </button>
              </>
            )}

            {currentStep === "biometric_intro" && (
              <button type="button" onClick={() => setCurrentStep("capture")} className="aivm-btn aivm-btn--primary" style={{ flex: 1 }}>
                <Camera style={{ height: "1.125rem", width: "1.125rem" }} /> Start Biometric Verification
              </button>
            )}

            {currentStep === "capture" && capturedImage && (
              <>
                <button type="button" onClick={handleRetake} disabled={isProcessing} className="aivm-btn aivm-btn--secondary" style={{ flex: 1 }}>
                  Retake
                </button>
                <button type="button" onClick={handleSubmitBiometric} disabled={isProcessing} className="aivm-btn aivm-btn--primary" style={{ flex: 2 }}>
                  {isProcessing ? <span style={{ width: "1rem", height: "1rem", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 1s linear infinite" }} /> : "Submit for Verification"}
                </button>
              </>
            )}

            {currentStep === "failed" && (
              <>
                <button type="button" onClick={handleClose} className="aivm-btn aivm-btn--secondary" style={{ flex: 1 }}>
                  Close
                </button>
                <button type="button" onClick={handleRetryAfterFailure} className="aivm-btn aivm-btn--primary" style={{ flex: 2 }}>
                  Try Again
                </button>
              </>
            )}

            {currentStep === "success" && (
              <button type="button" onClick={handleClose} className="aivm-btn aivm-btn--primary" style={{ flex: 1 }}>
                Done
              </button>
            )}

            {currentStep === "nia_verify" && (
              <button type="button" disabled className="aivm-btn aivm-btn--secondary" style={{ flex: 1, opacity: 0.6 }}>
                Verifying…
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentIdentityVerificationModal;