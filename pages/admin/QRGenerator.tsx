import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../services/api';

interface QRFormValues {
  targetUrl: string;
  commentText: string;
}

export const QRGenerator: React.FC = () => {
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<QRFormValues>({
    defaultValues: {
      targetUrl: window.location.origin + '/#/order',
      commentText: ''
    }
  });

  const mutation = useMutation({
    mutationFn: api.generateQrPdf,
    onSuccess: (data) => {
      setGeneratedPdfUrl(data.pdfUrl);
    }
  });

  const onSubmit = (data: QRFormValues) => {
    setGeneratedPdfUrl(null);
    mutation.mutate(data);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-2">QR Generator</h1>
      <p className="text-neutral-500 mb-8">Generate printable QR codes for order entry points.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden h-fit">
          <div className="p-6 border-b border-neutral-100 bg-neutral-50">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-primary rounded-full"></span>
              Configuration
            </h2>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-neutral-700">Target URL</label>
              <input 
                {...register('targetUrl', { 
                  required: 'Target URL is required',
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'Must be a valid URL starting with http:// or https://'
                  }
                })}
                placeholder="https://..."
                className={`w-full px-4 py-2 bg-neutral-50 border ${errors.targetUrl ? 'border-red-500' : 'border-neutral-200'} rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all`}
              />
              {errors.targetUrl && <p className="text-xs text-red-500">{errors.targetUrl.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-neutral-700">Shift Notes / Comment (Optional)</label>
              <textarea 
                {...register('commentText')}
                placeholder="e.g. Night Shift Entry A"
                className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none h-24 resize-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={mutation.isPending}
              className="w-full py-3 bg-neutral-900 text-white font-bold rounded-lg hover:bg-black transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                'Generate PDF'
              )}
            </button>
          </form>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-center items-center p-8 text-center h-[400px]">
          {generatedPdfUrl ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                 <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900">PDF Ready!</h3>
                <p className="text-neutral-500 mt-2">Your QR code sheet has been generated.</p>
              </div>
              <a 
                href={generatedPdfUrl}
                download="gl-qr-code.pdf"
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-black font-bold rounded-lg hover:brightness-105 transition-all shadow-lg shadow-primary/20"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </a>
            </div>
          ) : (
            <div className="text-neutral-400 space-y-4">
              <div className="w-24 h-24 bg-neutral-100 rounded-xl mx-auto flex items-center justify-center">
                <svg className="w-12 h-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4h2v-4zM6 6h2v2H6V6zm0 12h2v2H6v-2zm12 0h2v2h-2v-2zm-6-8h2v2h-2V10zm-6 0h2v2H6V10z" />
                </svg>
              </div>
              <p>Fill out the form to generate a printable QR code PDF.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};