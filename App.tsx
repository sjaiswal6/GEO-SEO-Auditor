
import React, { useState } from 'react';
import { analyzeBlog } from './services/geminiService';
import { AnalysisState, AuditResult } from './types';
import ScoreGauge from './components/ScoreGauge';
import ImprovementCard from './components/ImprovementCard';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [useContent, setUseContent] = useState(false);
  const [state, setState] = useState<AnalysisState>({
    loading: false,
    error: null,
    result: null
  });

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url && !content) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await analyzeBlog(url, useContent ? content : undefined);
      setState({ loading: false, error: null, result });
    } catch (err: any) {
      setState({ 
        loading: false, 
        error: err.message || 'An unexpected error occurred.', 
        result: null 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <span className="text-xl font-bold tracking-tight">Audito <span className="text-indigo-600">AI</span></span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">How it works</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">GEO Guide</a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-slate-900">
            Optimize for <span className="text-indigo-600">Humans</span> and <span className="text-emerald-500">Engines.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Standard SEO is no longer enough. Audito audits your content for traditional search ranking and 
            modern Generative Engine Optimization (GEO) to ensure AI models cite your work.
          </p>

          <form onSubmit={handleAudit} className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-xl border border-slate-100">
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="url"
                placeholder="https://yourblog.com/post-link"
                className="flex-1 px-6 py-4 rounded-xl focus:outline-none text-slate-800 placeholder:text-slate-400"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required={!useContent}
              />
              <button
                type="submit"
                disabled={state.loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {state.loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : 'Run Audit'}
              </button>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-4 text-xs font-medium text-slate-500">
               <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={useContent} 
                    onChange={(e) => setUseContent(e.target.checked)} 
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" 
                  />
                  Manually paste content instead
               </label>
            </div>

            {useContent && (
              <textarea
                placeholder="Paste your blog content here..."
                className="w-full mt-4 p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[200px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required={useContent}
              />
            )}
          </form>

          {state.error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 max-w-lg mx-auto">
              {state.error}
            </div>
          )}
        </section>

        {/* Results Dashboard */}
        {state.result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <ScoreGauge 
                score={state.result.seoScore} 
                label="SEO Score" 
                colorClass="text-indigo-600" 
              />
              <ScoreGauge 
                score={state.result.geoScore} 
                label="GEO Score" 
                colorClass="text-emerald-500" 
              />
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">
                 <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Metadata Analysis</h3>
                 <div className="space-y-4">
                    <div>
                      <span className="block text-xs font-bold text-slate-500 uppercase">Title Tag</span>
                      <p className="text-sm text-slate-800 font-medium">{state.result.metaTags.title}</p>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-500 uppercase">Description</span>
                      <p className="text-sm text-slate-600 line-clamp-2">{state.result.metaTags.description}</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* SEO Analysis */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  <h2 className="text-2xl font-bold">SEO Audit Results</h2>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
                  <p className="text-indigo-900 leading-relaxed italic">"{state.result.seoSummary}"</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <h3 className="font-semibold text-slate-800">SEO Improvements</h3>
                  {state.result.seoImprovements.map((item, idx) => (
                    <ImprovementCard key={idx} item={item} />
                  ))}
                </div>
              </div>

              {/* GEO Analysis */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <h2 className="text-2xl font-bold">GEO Audit Results</h2>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
                  <p className="text-emerald-900 leading-relaxed italic">"{state.result.geoSummary}"</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <h3 className="font-semibold text-slate-800">GEO Recommendations</h3>
                  {state.result.geoImprovements.map((item, idx) => (
                    <ImprovementCard key={idx} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Educational Section */}
            <div className="mt-20 p-10 bg-slate-900 rounded-3xl text-white">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-bold mb-4">What is Generative Engine Optimization?</h2>
                <p className="text-slate-400 mb-6 text-lg">
                  GEO is the new frontier of search. Unlike traditional SEO which focuses on keywords and backlinks, 
                  GEO focuses on making your content "discoverable" and "citeable" by AI models like Gemini and GPT-4.
                </p>
                <ul className="space-y-4 text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center text-xs">1</span>
                    <span><strong>Citeability:</strong> Including authoritative quotes and statistics that AI models can attribute to you.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center text-xs">2</span>
                    <span><strong>Entity Density:</strong> Clearly defining relationships between people, places, and things.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center text-xs">3</span>
                    <span><strong>Contextual Relevance:</strong> Structuring data so LLMs can easily parse your core thesis.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {!state.result && !state.loading && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <h3 className="font-bold text-xl mb-2">Keyword Density</h3>
              <p className="text-slate-500 text-sm">We analyze how well you balance traditional keyword usage without stuffing.</p>
            </div>
            <div className="p-8">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="font-bold text-xl mb-2">Fact-Checking</h3>
              <p className="text-slate-500 text-sm">Generative engines favor factual, well-supported content with high E-E-A-T.</p>
            </div>
            <div className="p-8">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              </div>
              <h3 className="font-bold text-xl mb-2">Citation Potential</h3>
              <p className="text-slate-500 text-sm">Find out if your content structure encourages AI models to cite you as a source.</p>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-sm">
            © 2024 Audito AI. Built for the future of search.
          </div>
          <div className="flex gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
