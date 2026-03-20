import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Globe, 
  Award, 
  CheckCircle, 
  Target, 
  Shield, 
  PieChart, 
  Briefcase, 
  Layout as LayoutIcon, 
  Mail,
  ShieldCheck
} from 'lucide-react';

export const InvestorsCenter = () => {
  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Innovative Minds Institute",
    "url": "https://iminstitute.online/",
    "areaServed": "Africa",
    "foundingDate": "2024",
    "sameAs": [
      "https://iminstitute.online/"
    ]
  };

  return (
    <div className="min-h-screen bg-white font-inter text-gray-900">
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* SECTION 1: HERO HEADER */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white pt-20 pb-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-6">
            <TrendingUp size={16} /> Investment & Grant Readiness Portal
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Investors & Grants Center
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light mb-8">
            "Building Africa’s Most Accessible AI-Powered Academic Support System"
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Innovative Minds Institute (IMI) is a scalable education technology platform providing affordable, 
            AI-assisted academic support to university students across Zambia and expanding across Africa.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Official URL</p>
              <p className="font-medium text-blue-600 truncate">iminstitute.online</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Founded</p>
              <p className="font-medium text-gray-900">2024</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Sector</p>
              <p className="font-medium text-gray-900">EdTech / AI</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Model</p>
              <p className="font-medium text-gray-900">Hybrid AI + Human</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PROBLEM STATEMENT */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">The Education Access Gap in Africa</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Higher education in Africa faces a critical crisis of access and support. 
                With university failure rates climbing and overcrowded classrooms, students are left without personalized guidance.
              </p>
              <ul className="space-y-4">
                {[
                  "High university failure rates due to lack of support",
                  "Limited access to affordable, quality tutoring",
                  "Overcrowded classrooms (1:100+ ratios)",
                  "Rural digital inequality and connectivity issues",
                  "Prohibitive private tutor costs ($10-20/hour)"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 min-w-[20px] text-[#D62828]"><CheckCircle size={20} /></div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Affordability Comparison</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-600">Traditional Private Tutoring</span>
                    <span className="font-bold text-red-600">~K2,500 / semester</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-600">IMI AI-Hybrid Model</span>
                    <span className="font-bold text-green-600">K100 / semester</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '4%' }}></div>
                  </div>
                  <p className="text-xs text-green-600 mt-2 font-medium">96% More Affordable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: OUR SOLUTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The IMI AI-Academic Support Model</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A scalable, technology-first approach to democratizing academic success.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Users className="text-blue-600" />, title: "AI-Powered Matching", desc: "Instantly connects students with subject-matter experts and peer tutors." },
              { icon: <Award className="text-green-600" />, title: "Accessible Pricing", desc: "Flat K100/semester fee ensures no student is left behind due to cost." },
              { icon: <LayoutIcon className="text-purple-600" />, title: "Exam Preparation", desc: "Comprehensive banks of mock exams and past papers with AI grading." },
              { icon: <PieChart className="text-orange-600" />, title: "Smart Analytics", desc: "Personalized dashboards tracking progress and identifying weak points." },
              { icon: <Globe className="text-cyan-600" />, title: "Mobile-First", desc: "Optimized for low-bandwidth environments and basic smartphones." },
              { icon: <Shield className="text-red-600" />, title: "Verified Tutors", desc: "Rigorous vetting process ensures quality and safety for all learners." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-4 p-3 bg-gray-50 rounded-lg w-fit">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: MEASURABLE IMPACT */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Measurable & Projected Impact</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <h3 className="text-blue-800 font-bold mb-4 flex items-center gap-2"><Target size={20}/> Phase 1: Zambia</h3>
              <ul className="space-y-3 text-sm text-blue-900">
                <li>• 5,000+ Active Students</li>
                <li>• 15+ Partner Universities</li>
                <li>• 85% Exam Pass Rate Target</li>
                <li>• 500+ Jobs for Tutors Created</li>
              </ul>
            </div>
            <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
              <h3 className="text-purple-800 font-bold mb-4 flex items-center gap-2"><Globe size={20}/> Phase 2: SADC</h3>
              <ul className="space-y-3 text-sm text-purple-900">
                <li>• 50,000+ Active Students</li>
                <li>• Expansion to Malawi, Zimbabwe, Botswana</li>
                <li>• Multilingual AI Support</li>
                <li>• Cross-border Academic Standards</li>
              </ul>
            </div>
            <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
              <h3 className="text-green-800 font-bold mb-4 flex items-center gap-2"><TrendingUp size={20}/> Phase 3: Pan-Africa</h3>
              <ul className="space-y-3 text-sm text-green-900">
                <li>• 1M+ Students Impacted</li>
                <li>• Continental Accreditation</li>
                <li>• Full AI Localization</li>
                <li>• Sustainable EdTech Ecosystem</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: REVENUE MODEL */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Financial Sustainability Model</h2>
              <p className="text-gray-400 mb-8">
                IMI operates on a high-volume, low-margin model designed for the African context. 
                Our cloud-native infrastructure ensures low marginal costs per new user.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-gray-800 rounded-lg h-fit"><Briefcase className="text-green-400" /></div>
                  <div>
                    <h3 className="font-bold text-lg">Primary Revenue</h3>
                    <p className="text-gray-400 text-sm">K100 ($4) per semester student access fee. Affordable, recurring, and scalable.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-3 bg-gray-800 rounded-lg h-fit"><Award className="text-yellow-400" /></div>
                  <div>
                    <h3 className="font-bold text-lg">Secondary Revenue</h3>
                    <p className="text-gray-400 text-sm">Premium 1-on-1 tutoring commissions, institutional licensing, and certification programs.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
              <h3 className="text-xl font-bold mb-6 border-b border-gray-700 pb-4">Efficiency Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-xs uppercase">Marginal Cost</p>
                  <p className="text-2xl font-bold text-white">Low</p>
                  <p className="text-xs text-gray-500">Per additional user</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Scalability</p>
                  <p className="text-2xl font-bold text-green-400">Infinite</p>
                  <p className="text-xs text-gray-500">Cloud Infrastructure</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Retention</p>
                  <p className="text-2xl font-bold text-blue-400">High</p>
                  <p className="text-xs text-gray-500">Semester-based</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Market</p>
                  <p className="text-2xl font-bold text-yellow-400">Growing</p>
                  <p className="text-xs text-gray-500">Youth Population</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: PITCH DECK */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Investor Pitch Deck</h2>
            <p className="text-gray-600">Overview of our vision, traction, and roadmap.</p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { title: "Vision", content: "Democratizing Academic Success Across Africa through technology." },
              { title: "Problem", content: "University students lack affordable academic support and guidance." },
              { title: "Solution", content: "Hybrid AI + Human tutor model accessible via mobile." },
              { title: "Market", content: "Rapidly growing youth population in Zambia and SADC region." },
              { title: "Product", content: "Tutor matching, mock exams, AI study planning, analytics." },
              { title: "Traction", content: "Early adoption in key universities, high student interest." },
              { title: "Revenue", content: "Semester subscription model + institutional partnerships." },
              { title: "Advantage", content: "First-mover, localized content, extreme affordability." },
              { title: "Impact", content: "Aligned with SDG 4, 8, 9, and 10. Measurable outcomes." },
              { title: "Tech", content: "Scalable cloud architecture, secure data, AI routing." },
              { title: "Roadmap", content: "Year 1: Zambia. Year 2: SADC. Year 3: Pan-Africa." },
              { title: "The Ask", content: "Seeking strategic investors and grant partners for expansion." }
            ].map((slide, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors group">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">Slide {i + 1}</span>
                  <div className="h-2 w-2 rounded-full bg-gray-300 group-hover:bg-blue-500 transition-colors"></div>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{slide.title}</h3>
                <p className="text-sm text-gray-600">{slide.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: ABH ALIGNMENT */}
      <section className="py-16 bg-gradient-to-br from-[#D62828] to-[#a51d1d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3">
              <h2 className="text-3xl font-bold mb-6">Africa’s Business Heroes Alignment</h2>
              <p className="text-white/80 mb-6">
                IMI is built to embody the core values of the ABH prize: Impact, Innovation, and Sustainability.
              </p>
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <p className="font-bold text-lg mb-2">"It’s African Time"</p>
                <p className="text-sm text-white/80">We are solving African problems with African-led solutions, tailored for our unique digital and economic landscape.</p>
              </div>
            </div>
            <div className="md:w-2/3 grid sm:grid-cols-2 gap-6">
              {[
                { title: "Impact", desc: "Directly improving education outcomes and creating jobs for tutors." },
                { title: "Scalability", desc: "Digital-first model allows rapid expansion across borders." },
                { title: "Innovation", desc: "Leveraging AI to bridge the human resource gap in education." },
                { title: "Sustainability", desc: "Profit-for-purpose model ensures long-term viability." }
              ].map((item, i) => (
                <div key={i} className="bg-white text-gray-900 p-6 rounded-xl shadow-lg">
                  <h3 className="font-bold text-xl mb-2 text-[#D62828]">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: GRANT READINESS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Grant Compliance & Readiness</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Governance Structure", items: ["Founder-led leadership", "Transparent operations", "Ethical framework"] },
              { title: "Financial Accountability", items: ["Structured revenue model", "Scalable cost structure", "Transparent fee system"] },
              { title: "Monitoring & Evaluation", items: ["Student progress tracking", "Performance analytics", "Outcome measurement"] },
              { title: "Sustainability Plan", items: ["Recurring revenue model", "Low operational overhead", "Scalable technology"] },
              { title: "Risk Mitigation", items: ["Data security protocols", "Regulatory compliance", "AI fallback systems"] },
              { title: "Inclusion Strategy", items: ["Low semester pricing", "Mobile-first design", "Rural accessibility focus"] }
            ].map((area, i) => (
              <div key={i} className="border border-gray-200 p-6 rounded-xl hover:bg-gray-50 transition-colors">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="bg-gray-100 text-gray-600 h-6 w-6 rounded-full flex items-center justify-center text-xs">{i + 1}</span>
                  {area.title}
                </h3>
                <ul className="space-y-2">
                  {area.items.map((item, j) => (
                    <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                      <CheckCircle size={14} className="mt-0.5 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: SDG ALIGNMENT */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12">Sustainable Development Goals</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { id: 4, title: "Quality Education", color: "bg-[#C5192D]" },
              { id: 8, title: "Decent Work", color: "bg-[#A21942]" },
              { id: 9, title: "Innovation", color: "bg-[#FD6925]" },
              { id: 10, title: "Reduced Inequalities", color: "bg-[#DD1367]" }
            ].map((sdg) => (
              <div key={sdg.id} className="flex flex-col items-center group">
                <div className={`${sdg.color} text-white w-24 h-24 rounded-xl flex flex-col items-center justify-center shadow-lg transform group-hover:-translate-y-2 transition-transform`}>
                  <span className="text-3xl font-bold">{sdg.id}</span>
                  <span className="text-[10px] uppercase font-bold mt-1">SDG</span>
                </div>
                <p className="mt-3 font-medium text-gray-900">{sdg.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: ETHICAL AI */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShieldCheck size={48} className="mx-auto text-gray-400 mb-6" />
          <h2 className="text-2xl font-bold mb-4">Ethical AI & Data Protection</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            We are committed to the responsible use of Artificial Intelligence. Our systems are designed to eliminate algorithmic bias, 
            protect student privacy, and comply with GDPR and local data protection regulations. We prioritize transparency 
            in how our AI assists—never replaces—the human learning experience.
          </p>
        </div>
      </section>

      {/* SECTION 11: CONTACT */}
      <section className="py-20 bg-gray-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">Partner With Us</h2>
          <p className="text-gray-400 mb-10">
            Join us in shaping the future of education in Africa. Request our full investor pack or schedule a strategic discussion.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:investors@iminstitute.online" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#D62828] hover:bg-[#b01e1e] text-white rounded-full font-bold transition-colors">
              <Mail size={20} /> Request Investor Pack
            </a>
            <a href="mailto:partners@iminstitute.online" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-gray-600 hover:bg-gray-800 text-white rounded-full font-bold transition-colors">
              <Briefcase size={20} /> Strategic Partnership
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
