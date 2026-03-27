import { useEffect, useState } from 'react';
import { useFlash } from '@/hooks/useFlash';

export default function FlashToast() {
    const [toasts, setToasts] = useState([]);

    useFlash(({ success, error, emailSent }) => {
        const id  = Date.now();
        const msg = success || error;
        const type = success ? 'success' : 'error';

        const lines = [msg];
        if (success && emailSent)  lines.push('📧 Agent notified by email.');
        if (success && !emailSent) lines.push('⚠️ Agent email could not be sent.');

        setToasts(prev => [...prev, { id, type, lines }]);

        // Auto-dismiss after 5 s
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    });

    if (!toasts.length) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`flex items-start gap-3 rounded-lg px-4 py-3 shadow-lg text-white text-sm max-w-sm transition-all
                        ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
                >
                    <span className="text-lg leading-none mt-0.5">
                        {toast.type === 'success' ? '✅' : '❌'}
                    </span>
                    <div className="flex flex-col gap-0.5">
                        {toast.lines.map((line, i) => (
                            <p key={i} className="m-0">{line}</p>
                        ))}
                    </div>
                    <button
                        onClick={() =>
                            setToasts(prev => prev.filter(t => t.id !== toast.id))
                        }
                        className="ml-auto text-white/70 hover:text-white text-lg leading-none"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}