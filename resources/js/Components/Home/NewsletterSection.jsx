import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

const NewsletterSection = () => {
  const [subscribed, setSubscribed] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    email: ''
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    post('/newsletter/subscribe', {
      preserveScroll: true,
      onSuccess: () => {
        setSubscribed(true);
        reset('email');
      }
    });
  };

  return (
    <>
      <style>{`
        * {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        .card-interactive {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-interactive:hover {
          transform: translateY(-4px);
        }
      `}</style>

      <section className="py-16" style={{ backgroundColor: 'hsl(40 30% 94%)' }}>
        <div className="container mx-auto px-4">
          <div
            className="card-interactive border rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl"
            style={{ borderColor: 'hsl(40 20% 88%)' }}
          >
            <div className="p-6 md:p-10 flex flex-col md:flex-row md:items-center gap-8">

              {/* Left: icon + copy */}
              <div className="flex-1">
                <div
                  className="h-12 w-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'hsl(174 62% 32% / 0.1)' }}
                >
                  <Mail className="h-6 w-6" style={{ color: 'hsl(174 62% 32%)' }} />
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight" style={{ color: 'hsl(200 25% 15%)' }}>
                  Never Miss a Listing
                </h3>
                <p style={{ color: 'hsl(200 15% 45%)' }}>
                  Get verified rentals and properties for sale delivered to your inbox as soon as they go live &mdash; no spam, just new listings across Ghana.
                </p>
              </div>

              {/* Right: form / success state */}
              <div className="w-full md:w-auto md:min-w-[22rem]">
                {subscribed ? (
                  <div
                    className="flex items-center gap-3 rounded-lg px-5 py-4"
                    style={{ backgroundColor: 'hsl(174 62% 32% / 0.1)' }}
                  >
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: 'hsl(174 62% 32%)' }} />
                    <p className="font-semibold" style={{ color: 'hsl(174 62% 25%)' }}>
                      You're subscribed! Watch your inbox for new listings.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} noValidate>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="flex-1 rounded-lg px-4 py-3 border outline-none"
                        style={{
                          borderColor: errors.email ? 'hsl(0 72% 51%)' : 'hsl(40 20% 88%)',
                          color: 'hsl(200 25% 15%)',
                          backgroundColor: 'white'
                        }}
                      />
                      <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center justify-center px-6 py-3 text-white font-semibold rounded-lg transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg whitespace-nowrap"
                        style={{
                          backgroundColor: 'hsl(174 62% 32%)',
                          opacity: processing ? 0.7 : 1,
                          cursor: processing ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {processing ? 'Subscribing…' : 'Subscribe'}
                        {!processing && <ArrowRight className="h-4 w-4 ml-2" />}
                      </button>
                    </div>
                    {errors.email && (
                      <p className="text-sm mt-2" style={{ color: 'hsl(0 72% 51%)' }}>
                        {errors.email}
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsletterSection;