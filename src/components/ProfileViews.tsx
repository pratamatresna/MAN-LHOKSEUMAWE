/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Teacher } from '../types';
import { 
  Award, ShieldCheck, MapPin, Search, Filter, BookOpen, 
  School, Compass, CheckCircle2, FileText, Layout, X,
  Play, UserRound
} from 'lucide-react';

interface ProfileViewsProps {
  subTab: string;
}

export default function ProfileViews({ subTab }: ProfileViewsProps) {
  const { teachers } = useSchool();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedOrgProfile, setSelectedOrgProfile] = useState<{name: string, role: string, desc: string, img: string} | null>(null);
  const [sambutanView, setSambutanView] = useState<'video' | 'text'>('video');
  const sambutanTopRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    const el = sambutanTopRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const switchToText = () => {
    setSambutanView('text');
    setTimeout(scrollToTop, 50);
  };

  const switchToVideo = () => {
    setSambutanView('video');
    setTimeout(scrollToTop, 50);
  };

  // Filtered Teacher results
  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const keyFacilities = [
    {
      title: 'Masjid Al-Ikhlas',
      desc: 'Pusat pembinaan ruhiyah, ibadah harian berjamaah, kuliah subuh, serta program setoran hafalan Tahfidz Qur’an.',
      img: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Laboratorium Komputer & CBT',
      desc: 'Dilengkapi dengan 40 unit komputer berspesifikasi modern, jaringan serat optik LAN stabil, serta UPS cadangan daya.',
      img: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Perpustakaan Digital Terakreditasi',
      desc: 'Memiliki koleksi ribuan judul literatur, area baca lesehan yang nyaman, AC, serta akses portal OPAC digital.',
      img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Laboratorium IPA Terpadu',
      desc: 'Pusat sains terpadu yang memadukan ruang praktikum Fisika, Kimia, dan Biologi dengan mikroskop digital dan kit rujukan modern.',
      img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="profile-container">
      {/* 1. SAMBUTAN KEPALA MADRASAH */}
      {subTab === 'sambutan' && (
        <div ref={sambutanTopRef} className="bg-white border rounded-2xl shadow-sm p-6 sm:p-10" id="profile-sambutan">

          {/* ── Toggle Pill Tabs ── */}
          <div className="flex items-center justify-center mb-8">
            <div className="inline-flex bg-slate-100 rounded-full p-1 gap-1 shadow-inner">
              <button
                onClick={switchToVideo}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  sambutanView === 'video'
                    ? 'bg-brand-green text-white shadow-md scale-[1.03]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Play size={14} />
                Video Sambutan
              </button>
              <button
                onClick={switchToText}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  sambutanView === 'text'
                    ? 'bg-brand-green text-white shadow-md scale-[1.03]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserRound size={14} />
                Sambutan Kepala
              </button>
            </div>
          </div>

          {/* ── VIDEO VIEW ── */}
          {sambutanView === 'video' && (
            <div>
              <div className="w-full rounded-2xl overflow-hidden bg-slate-900 shadow-lg border border-slate-200">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Sambutan Kepala Madrasah"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full min-h-[300px] sm:min-h-[450px] md:min-h-[560px]"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-3 font-mono text-center">
                * Catatan: Ini adalah video placeholder sementara.
              </p>

              {/* ── Tombol baca sambutan di bawah video ── */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={switchToText}
                  className="group flex items-center gap-3 bg-white border-2 border-brand-green rounded-2xl px-6 py-4 shadow hover:shadow-lg hover:bg-brand-green transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-brand-green/30 group-hover:border-white/50 flex-shrink-0 transition-all duration-300">
                    <img
                      src="/images/Kepsek_adat_aceh.jpeg"
                      alt="Kepala Madrasah"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-500 group-hover:text-white/70 font-mono uppercase tracking-wider transition-colors duration-300">Baca Sambutan</p>
                    <p className="font-display font-bold text-slate-800 group-hover:text-white text-sm transition-colors duration-300">Suriya, S. Ag., M.Pd</p>
                  </div>
                  <UserRound size={18} className="text-brand-green group-hover:text-white ml-2 transition-colors duration-300" />
                </button>
              </div>
            </div>
          )}

          {/* ── SAMBUTAN TEXT VIEW ── */}
          {sambutanView === 'text' && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-start">
                {/* Foto Kepala */}
                <div className="lg:col-span-1 text-center">
                  <div className="relative inline-block rounded-2xl overflow-hidden border-4 border-brand-green shadow-xl max-w-xs mx-auto">
                    <img
                      src="/images/Kepsek_adat_aceh.jpeg"
                      alt="Suriya, S. Ag., M.Pd"
                      className="w-full h-auto object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                      <p className="font-display font-bold text-sm">Suriya, S. Ag., M.Pd</p>
                      <p className="text-[10px] text-brand-gold font-mono uppercase tracking-wider">Kepala MAN Kota Lhokseumawe</p>
                    </div>
                  </div>

                  {/* Tombol kembali ke video di bawah foto */}
                  <button
                    onClick={switchToVideo}
                    className="mt-5 inline-flex items-center gap-2 text-xs text-slate-500 hover:text-brand-green border border-slate-200 hover:border-brand-green px-4 py-2 rounded-full transition-all duration-200"
                  >
                    <Play size={12} />
                    Tonton Video
                  </button>
                </div>

                {/* Teks Sambutan */}
                <div className="lg:col-span-2 space-y-5">
                  <span className="bg-brand-green/10 text-brand-green font-mono text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Sambutan Resmi
                  </span>
                  <h2 className="text-2xl sm:text-3.5xl font-display font-black text-slate-900 leading-tight">
                    Membentuk Generasi Madani Unggul & Kompetitif
                  </h2>
                  <div className="w-12 h-1 bg-brand-gold rounded"></div>

                  <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 font-sans">
                    <p className="font-semibold italic text-emerald-800">
                      Assalamu'alaikum Warahmatullahi Wabarakatuh,
                    </p>
                    <p>
                      Puji syukur senantiasa kita panjatkan ke hadirat Allah Subhanahu Wa Ta'ala atas curahan rahmat, hidayah, dan bimbingan-Nya sehingga website resmi MAN Kota Lhokseumawe ini dapat hadir sebagai jendela informasi bagi masyarakat luas. Shalawat beserta salam semoga senantiasa terlimpah-curahkan kepada junjungan alam Nabi Besar Muhammad Shallallahu 'Alaihi Wassalam.
                    </p>
                    <p>
                      Di era transformasi digital yang melaju begitu pesat, madrasah dituntut untuk berdiri di baris terdepan dalam menyelaraskan ilmu pengetahuan teknologi (sains) dengan kecerdasan spiritual berbasis akhlak karimah. Website ini bukan sekadar media publikasi statis, melainkan representasi ekosistem pendidikan kami yang terintegrasi, transparan, dan berdaya guna.
                    </p>
                    <p>
                      MAN Kota Lhokseumawe terus berkomitmen memberikan layanan pembelajaran bermutu prima, membina iklim penelitian (riset) mandiri remaja, serta mengukuhkan kompetensi keagamaan siswa melalui penguatan materi kitab rujukan (Tafsir, Hadits, Fiqih) dan program akselerasi Tahfidz Qur'an. Kami bersiap mengantarkan putra-putri terbaik bangsa menggapai perguruan tinggi impian sekaligus menjadi pilar peradaban Islam yang moderat dan unggul.
                    </p>
                    <p className="font-medium pt-4">
                      Wassalamu'alaikum Warahmatullahi Wabarakatuh.
                    </p>
                  </div>

                  {/* Signature */}
                  <div className="border-t pt-5 mt-6 flex justify-between items-center flex-wrap">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Tertanda,</p>
                      <p className="font-display font-extrabold text-slate-900 mt-1">Suriya, S. Ag., M.Pd</p>
                      <p className="text-xs text-brand-green font-mono font-bold uppercase tracking-wider">Kepala MAN Kota Lhokseumawe</p>
                    </div>
                    <div className="w-24 h-12 opacity-40 border-b border-brand-green border-dashed flex items-center justify-center text-[10px] font-mono select-none">
                      [ Tanda Tangan ]
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}


      {/* 2. VISI & MISI */}
      {subTab === 'visi-misi' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="profile-visi-misi">
          {/* VISI */}
          <div className="bg-brand-green text-white p-8 sm:p-12 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 rounded-full blur-3xl"></div>
            <div className="space-y-4">
              <span className="bg-brand-gold text-brand-green-dark text-xs font-mono font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                VISI MADRASAH
              </span>
              <p className="text-2xl sm:text-3xl font-display font-extrabold leading-tight tracking-tight pt-3">
                "Unggul dalam prestasi berdasarkan nilai-nilai Islam"
              </p>
            </div>
            <div className="border-t border-white/20 pt-6 mt-8 flex justify-between items-center">
              <span className="text-xs font-mono text-brand-gold">Rujukan Mutu Kemenag</span>
              <School className="w-10 h-10 text-brand-gold opacity-55" />
            </div>
          </div>

          {/* MISI */}
          <div className="bg-white border p-6 sm:p-10 rounded-2xl shadow-sm space-y-6">
            <span className="bg-brand-green/10 text-brand-green text-xs font-mono font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              MISI MADRASAH
            </span>
            <h3 className="text-xl font-display font-bold text-slate-900 border-l-4 border-brand-gold pl-3">
              Misi Pokok & Strategi Operasional
            </h3>
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-700">
              {[
                'Menghasilkan peserta didik yang berakhlak mulia serta memiliki ilmu pengetahuan dan teknologi yang dapat diterapkan dalam dunia kerja dan kehidupan masyarakat berbangsa serta mengembangkan kemampuan lebih lanjut ke jenjang pendidikan yang lebih tinggi.',
                'Menghasilkan peserta didik yang mampu mengembangkan diri sesuai dengan ilmu pengetahuan yang dimiliki dan tanggap terhadap kepentingan dan kebutuhan masyarakat.',
                'Menghasilkan peserta didik yang memiliki kesadaran dan tanggung jawab sosial untuk memajukan kesejahteraan masyarakat dan bangsa, baik dalam kapasitas sebagai individu yang merupakan bagian dari masyarakat maupun sebagai makhluk yang akan mempertanggungjawabkan semua tindakannya di hadapan ALLAH Yang Maha Kuasa.',
                'Mempersiapkan generasi muda terdidik yang inovatif, kreatif, berakhlak mulia, berwawasan luas, memiliki kesabaran dan mampu bersaing di dalam suasana yang demokratis.'
              ].map((misi, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-brand-gold-light flex items-center justify-center text-brand-gold-dark shrink-0 font-bold text-xs">
                    {i + 1}
                  </div>
                  <p className="leading-relaxed pt-0.5">{misi}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. SEJARAH MADRASAH */}
      {subTab === 'sejarah' && (
        <div className="bg-white border rounded-2xl p-6 sm:p-10 shadow-sm space-y-6 max-w-4xl mx-auto" id="profile-sejarah">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-brand-gold font-mono text-xs font-bold uppercase tracking-widest">LINIMASA PERJALANAN</span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900">Sejarah MAN Kota Lhokseumawe</h2>
            <div className="w-12 h-1 bg-brand-green mx-auto rounded"></div>
          </div>

          <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 font-sans pt-4">
            <p>
              Madrasah Aliyah Negeri (MAN) Kota Lhokseumawe pada mulanya didirikan sebagai rintisan persiapan pendidikan guru dan dai terstruktur di daerah pesisir utara Aceh pada akhir dekade 1980-an. Seiring dengan peningkatan mutu kelulusan yang berkelanjutan dan restrukturisasi kelembagaan di bawah naungan Kementerian Agama Republik Indonesia, statusnya secara definitif dinegerikan berdasarkan Keputusan Menteri Agama (KMA) Republik Indonesia.
            </p>
            <p className="border-l-4 border-brand-gold bg-[#f8f9fa] p-4 rounded-r-lg italic pl-4 text-slate-800 font-medium">
              "Dari sebuah rintisan pemukiman sarana belajar sederhana di pusat kota, MAN Kota Lhokseumawe kini bertumbuh pesat menjadi icon madrasah modern kebanggaan masyarakat Kota Lhokseumawe, Aceh Utara, dan wilayah sekitarnya."
            </p>
            <p>
              Seiring dinamika pemerintahan otonom pembentukan kota administratif Kota Lhokseumawe secara mandiri pada tahun 2001, MAN Kota Lhokseumawe terus menata kemandirian manajemen madrasah, memperluas pembangunan laboratorium komputer, ruang riset, dan memperbanyak kuota kelas unggulan serta asrama siswa tahfidz.
            </p>
            <p>
              Kini, di era Revolusi Industri 4.0, madrasah telah bermetamorfosis sempurna dengan mengintegrasikan sistem pembelajaran asinkronus (E-learning), komputerisasi Computer-Based Test (CBT), pendirian studio podcast sains, serta berhasil meraih akreditasi "A" Unggul berkali-kali secara konsisten dari Badan Akreditasi Nasional Sekolah/Madrasah.
            </p>
          </div>
        </div>
      )}

      {/* 4. STRUKTUR ORGANISASI */}
      {subTab === 'struktur' && (
        <div className="bg-white border rounded-2xl p-6 sm:p-10 shadow-sm space-y-8" id="profile-struktur">
          <div className="text-center space-y-2">
            <span className="text-brand-gold font-mono text-xs font-bold uppercase tracking-widest">BAGAN INTEGRATIV</span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900">Struktur Organisasi Kepemimpinan</h2>
            <div className="w-12 h-1 bg-brand-gold mx-auto rounded"></div>
          </div>

          {/* Simple Structured responsive Tree Diagram */}
          <div className="space-y-0 pt-6 overflow-x-auto min-w-[700px] lg:min-w-0 pb-4">
            {/* Level 1: Kepala */}
            <div className="flex justify-center">
              <div 
                onClick={() => setSelectedOrgProfile({name: 'Suriya, S. Ag., M.Pd', role: 'Kepala Madrasah', desc: 'Penanggung Jawab Utama & Manajer', img: '/images/Suriya, S.Ag., M.Pd.jpg'})}
                className="bg-white border-2 border-slate-200 text-slate-800 p-4 rounded-xl text-center w-64 shadow-sm relative z-10 flex flex-col items-center cursor-pointer transition-all hover:bg-brand-gold/15 hover:border-brand-gold hover:shadow-md"
              >
                <img src="/images/Suriya, S.Ag., M.Pd.jpg" alt="Kepala Madrasah" className="w-20 h-20 object-cover rounded-full border-2 border-brand-gold mb-3 shadow-sm" />
                <p className="text-[10px] font-mono text-brand-gold-dark uppercase tracking-wider font-bold">Kepala Madrasah</p>
                <p className="font-display font-bold text-sm mt-1">Suriya, S. Ag., M.Pd</p>
                <p className="text-[9px] text-slate-500 font-sans mt-0.5">Penanggung Jawab Utama & Manajer</p>
              </div>
            </div>

            {/* Link line to Level 2 */}
            <div className="h-6 w-0.5 bg-slate-300 mx-auto"></div>
            <div className="w-[256px] h-0.5 bg-slate-300 mx-auto"></div>
            <div className="w-[256px] mx-auto flex justify-between">
              <div className="h-4 w-0.5 bg-slate-300"></div>
              <div className="h-4 w-0.5 bg-slate-300"></div>
            </div>

            {/* Level 2: Komite & Tata Usaha */}
            <div className="flex justify-center space-x-12 relative">
              <div 
                onClick={() => setSelectedOrgProfile({name: 'Muhammad Rahmat,S.HI, M.H.', role: 'Ketua Komite Hubungan Orangtua', desc: 'Penasihat Strategis Madrasah', img: '/images/Muhammad Rahmat,S.HI, M.H..png'})}
                className="bg-white border-2 border-slate-200 text-slate-800 p-4 rounded-xl text-center w-52 shadow-sm relative z-10 flex flex-col items-center cursor-pointer transition-all hover:bg-brand-gold/15 hover:border-brand-gold hover:shadow-md"
              >
                <img src="/images/Suriya, S.Ag., M.Pd.jpg" alt="Ketua Komite Hubungan Orangtua" className="w-16 h-16 object-cover rounded-full border-2 border-brand-gold-dark mb-3 shadow-sm" />
                <p className="text-[9px] font-mono text-brand-gold-dark uppercase tracking-wider font-bold">Ketua Komite Hubungan Orangtua</p>
                <p className="font-display font-bold text-xs mt-1">Muhammad Rahmat,S.HI, M.H.</p>
                <p className="text-[9px] text-slate-500 font-sans mt-0.5">Penasihat Strategis Madrasah</p>
              </div>

              <div 
                onClick={() => setSelectedOrgProfile({name: 'Nurhabsah, S.Pd', role: 'Kepala Tata Usaha', desc: 'Urusan Administrasi, Keuangan & Sarpras', img: '/images/Nurhabsah, S.Pd.jpg'})}
                className="bg-white border-2 border-slate-200 text-slate-800 p-4 rounded-xl text-center w-52 shadow-sm relative z-10 flex flex-col items-center cursor-pointer transition-all hover:bg-brand-gold/15 hover:border-brand-gold hover:shadow-md"
              >
                <img src="/images/Nurhabsah, S.Pd.jpg" alt="Kepala Tata Usaha" className="w-16 h-16 object-cover rounded-full border-2 border-slate-300 mb-3 shadow-sm" />
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold">Kepala Tata Usaha</p>
                <p className="font-display font-bold text-xs mt-1">Nurhabsah, S.Pd</p>
                <p className="text-[9px] text-slate-500 font-sans mt-0.5">Urusan Administrasi, Keuangan & Sarpras</p>
              </div>
            </div>

            {/* Link line to Level 3 */}
            <div className="h-6 w-0.5 bg-slate-300 mx-auto"></div>
            
            {/* Level 3: Wakil Kepala (Waka) */}
            <div className="max-w-4xl mx-auto relative">
              {/* Horizontal line spanning centers of 4 columns (12.5% to 87.5%) */}
              <div className="absolute top-0 inset-x-[12.5%] h-0.5 bg-slate-300 z-0"></div>
              
              {/* Vertical drops to each of the 4 boxes */}
              <div className="absolute top-0 left-[12.5%] h-4 w-0.5 bg-slate-300 -translate-x-1/2"></div>
              <div className="absolute top-0 left-[37.5%] h-4 w-0.5 bg-slate-300 -translate-x-1/2"></div>
              <div className="absolute top-0 left-[62.5%] h-4 w-0.5 bg-slate-300 -translate-x-1/2"></div>
              <div className="absolute top-0 left-[87.5%] h-4 w-0.5 bg-slate-300 -translate-x-1/2"></div>

              <div className="grid grid-cols-4 gap-4 pt-4 relative z-10">
                <div 
                  onClick={() => setSelectedOrgProfile({name: 'Siscori Sriningsih Mulyati, S.T', role: 'Waka Kurikulum', desc: '', img: '/images/Siscori Sriningsih Mulyati, S.T.jpg'})}
                  className="bg-white border-2 border-slate-200 text-slate-800 p-3 rounded-lg text-center shadow-sm flex flex-col items-center cursor-pointer transition-all hover:bg-brand-gold/15 hover:border-brand-gold hover:shadow-md"
                >
                  <img src="/images/Siscori Sriningsih Mulyati, S.T.jpg" alt="Waka Kurikulum" className="w-14 h-14 object-cover rounded-full border border-brand-green mb-2 shadow-sm" />
                  <p className="text-[8px] font-mono text-brand-green font-bold uppercase tracking-wider">Waka Kurikulum</p>
                  <p className="font-display font-bold text-xs mt-1">Siscori Sriningsih Mulyati, S.T</p>
                </div>

                <div 
                  onClick={() => setSelectedOrgProfile({name: 'Eny Sahara, S.Pd., M. Pd', role: 'Waka Kesiswaan', desc: '', img: '/images/Eny Sahara, S.Pd., M.Pd.jpg'})}
                  className="bg-white border-2 border-slate-200 text-slate-800 p-3 rounded-lg text-center shadow-sm flex flex-col items-center cursor-pointer transition-all hover:bg-brand-gold/15 hover:border-brand-gold hover:shadow-md"
                >
                  <img src="/images/Eny Sahara, S.Pd., M.Pd.jpg" alt="Waka Kesiswaan" className="w-14 h-14 object-cover rounded-full border border-brand-green mb-2 shadow-sm" />
                  <p className="text-[8px] font-mono text-brand-green font-bold uppercase tracking-wider">Waka Kesiswaan</p>
                  <p className="font-display font-bold text-xs mt-1">Eny Sahara, S.Pd., M. Pd</p>
                </div>

                <div 
                  onClick={() => setSelectedOrgProfile({name: 'Masrizal, S.Pd.I', role: 'Waka Sarpras', desc: '', img: '/images/Masrizal, S.Pd.I.jpg'})}
                  className="bg-white border-2 border-slate-200 text-slate-800 p-3 rounded-lg text-center shadow-sm flex flex-col items-center cursor-pointer transition-all hover:bg-brand-gold/15 hover:border-brand-gold hover:shadow-md"
                >
                  <img src="/images/Masrizal, S.Pd.I.jpg" alt="Waka Sarpras" className="w-14 h-14 object-cover rounded-full border border-brand-green mb-2 shadow-sm" />
                  <p className="text-[8px] font-mono text-brand-green font-bold uppercase tracking-wider">Waka Sarpras</p>
                  <p className="font-display font-bold text-xs mt-1">Masrizal, S.Pd.I</p>
                </div>

                <div 
                  onClick={() => setSelectedOrgProfile({name: 'Fuadi.T, S.Pd.I., M.Pd', role: 'Waka Humas', desc: '', img: '/images/Fuadi.T, S.Pd.I., M.Pd.jpg'})}
                  className="bg-white border-2 border-slate-200 text-slate-800 p-3 rounded-lg text-center shadow-sm flex flex-col items-center cursor-pointer transition-all hover:bg-brand-gold/15 hover:border-brand-gold hover:shadow-md"
                >
                  <img src="/images/Fuadi.T, S.Pd.I., M.Pd.jpg" alt="Waka Humas" className="w-14 h-14 object-cover rounded-full border border-brand-green mb-2 shadow-sm" />
                  <p className="text-[8px] font-mono text-brand-green font-bold uppercase tracking-wider">Waka Humas</p>
                  <p className="font-display font-bold text-xs mt-1">Fuadi.T, S.Pd.I., M.Pd</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Org Chart Modal */}
          {selectedOrgProfile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedOrgProfile(null)}>
              <div 
                className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl transform transition-all relative overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="absolute top-0 left-0 w-full h-24 bg-brand-green"></div>
                <button 
                  onClick={() => setSelectedOrgProfile(null)}
                  className="absolute top-3 right-3 text-white hover:text-slate-200 p-1 bg-black/20 rounded-full"
                >
                  <X size={18} />
                </button>
                
                <div className="relative pt-6 flex flex-col items-center">
                  <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg mb-4 z-10 relative">
                    <img 
                      src={selectedOrgProfile.img} 
                      alt={selectedOrgProfile.name} 
                      className="w-full h-full object-cover rounded-full border border-slate-100"
                    />
                  </div>
                  
                  <h3 className="font-display font-black text-xl text-slate-900 text-center">{selectedOrgProfile.name}</h3>
                  <p className="text-brand-green font-bold text-sm mt-1">{selectedOrgProfile.role}</p>
                  
                  {selectedOrgProfile.desc && (
                    <div className="mt-4 bg-slate-50 border p-3 rounded-lg w-full text-center">
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{selectedOrgProfile.desc}</p>
                    </div>
                  )}
                  
                  <div className="w-full mt-6 pt-4 border-t border-slate-100 flex justify-center">
                    <button 
                      onClick={() => setSelectedOrgProfile(null)}
                      className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full transition-colors"
                    >
                      Tutup Profil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. DATA GURU & STAF */}
      {subTab === 'guru' && (
        <div className="space-y-6" id="profile-guru">
          <div className="text-center space-y-2">
            <span className="text-brand-gold font-mono text-xs font-bold uppercase tracking-widest">SISTEM GURU DIRETKORI</span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900">Direktori Guru & Staf Pengajar</h2>
            <div className="w-12 h-1 bg-brand-green mx-auto rounded"></div>
            <p className="text-xs text-slate-500 max-w-xl mx-auto mt-2">Daftar tenaga pendidik profesional yang berdedikasi tinggi serta ahli dalam pengampu bidang masing-masing.</p>
          </div>

          {/* Search and Filters */}
          <div className="p-4 bg-slate-50 border rounded-xl flex flex-col md:flex-row gap-3.5 items-center justify-between" id="teacher-filter-bar">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari guru berdasarkan nama, mapel, atau status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs border border-slate-205 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-brand-green"
              />
            </div>

            {/* Dropdown status Filter */}
            <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-700">Status Kepegawaian:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-slate-205 bg-white text-slate-800 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-brand-green"
              >
                <option value="ALL">Semua Guru ({teachers.length})</option>
                <option value="PNS">Pegawai Negeri Sipil (PNS)</option>
                <option value="PPPK">PPPK Kementerian Agama</option>
                <option value="Honororer">Guru Honorer / Praktisi</option>
              </select>
            </div>
          </div>

          {/* Teacher Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredTeachers.map((teacher) => (
              <div 
                key={teacher.id}
                onClick={() => setSelectedTeacher(teacher)}
                className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div className="p-5 flex items-start space-x-4">
                  {/* Photo Profile */}
                  <img 
                    src={teacher.imageUrl} 
                    alt={teacher.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-150"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <span className="bg-brand-gold/15 text-brand-gold-dark text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      {teacher.status}
                    </span>
                    <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                      {teacher.name}
                    </h3>
                    <p className="text-xs text-brand-green font-medium">
                      {teacher.role}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3.5 bg-slate-50 border-t flex flex-col text-xs text-slate-600 gap-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">NIP:</span>
                    <span className="font-mono text-slate-700 font-semibold">{teacher.nip === 'PNS' ? '-' : teacher.nip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mata Pelajaran:</span>
                    <span className="font-medium text-slate-800">{teacher.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gender:</span>
                    <span>{teacher.gender === 'L' ? 'Laki-laki (Ikhwan)' : 'Perempuan (Akhwat)'}</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredTeachers.length === 0 && (
              <div className="col-span-full text-center py-12 p-4 bg-slate-50 border border-dashed rounded-xl">
                <p className="text-stone-550 font-medium">Guru atau Staf pengajar yang Anda cari tidak ditemukan.</p>
                <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
              </div>
            )}
          </div>

          {/* Teacher Modal */}
          {selectedTeacher && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedTeacher(null)}>
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="relative h-32 bg-brand-green">
                  <button 
                    onClick={() => setSelectedTeacher(null)}
                    className="absolute top-4 right-4 text-white hover:text-brand-gold bg-black/20 hover:bg-black/40 rounded-full p-1.5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="px-6 pb-6 relative">
                  <div className="flex justify-center -mt-16 mb-4">
                    <img 
                      src={selectedTeacher.imageUrl} 
                      alt={selectedTeacher.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md bg-white"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-center space-y-1 mb-6">
                    <span className="bg-brand-gold/15 text-brand-gold-dark text-[10px] font-mono font-extrabold px-2 py-0.5 rounded uppercase tracking-wider inline-block mb-1">
                      {selectedTeacher.status}
                    </span>
                    <h3 className="font-display font-black text-xl text-slate-900 leading-tight">
                      {selectedTeacher.name}
                    </h3>
                    <p className="text-sm text-brand-green font-bold">
                      {selectedTeacher.role}
                    </p>
                  </div>
                  
                  <div className="space-y-3 text-sm text-slate-600 bg-slate-50 rounded-xl p-4 border">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500">NIP</span>
                      <span className="font-mono text-slate-800 font-semibold">{selectedTeacher.nip === 'PNS' ? '-' : selectedTeacher.nip}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500">Mata Pelajaran</span>
                      <span className="font-medium text-slate-800">{selectedTeacher.subject}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Jenis Kelamin</span>
                      <span className="font-medium text-slate-800">{selectedTeacher.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. FASILITAS MADRASAH */}
      {subTab === 'fasilitas' && (
        <div className="space-y-8" id="profile-fasilitas">
          <div className="text-center space-y-2">
            <span className="text-brand-gold font-mono text-xs font-bold uppercase tracking-widest">SARANA PRASARANA</span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900">Fasilitas Penunjang Pendidikan</h2>
            <div className="w-12 h-1 bg-brand-green mx-auto rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {keyFacilities.map((fac, idx) => (
              <div 
                key={idx}
                className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col md:flex-row"
              >
                <div className="md:w-1/2 h-52 md:h-full relative overflow-hidden bg-slate-100">
                  <img 
                    src={fac.img} 
                    alt={fac.title}
                    className="w-full h-full object-cover group-hover:scale-105 duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="md:w-1/2 p-6 flex flex-col justify-center space-y-2.5">
                  <h3 className="font-display font-extrabold text-base text-brand-green">
                    {fac.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {fac.desc}
                  </p>
                  <div className="flex items-center space-x-1 text-[10px] text-brand-gold-dark font-sans font-bold">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                    <span>Tersedia & Siap Digunakan</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. AKREDITASI & PRESTASI */}
      {subTab === 'akreditasi' && (
        <div className="space-y-8" id="profile-akreditasi">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Akreditasi certificate Card */}
            <div className="lg:col-span-1 bg-gradient-to-br from-brand-green to-brand-green-dark text-white p-8 rounded-2xl border border-brand-gold shadow-md text-center space-y-4">
              <Award className="w-16 h-16 text-brand-gold mx-auto animate-float" />
              <div className="space-y-1">
                <h3 className="text-xs font-mono font-bold text-brand-gold-light uppercase tracking-widest">Akreditasi Madrasah</h3>
                <div className="text-4xl font-display font-black tracking-tight text-white py-2">
                  A (UNGGUL)
                </div>
                <p className="text-xs text-slate-200">Berdasarkan Keputusan Badan Akreditasi Nasional Pendidikan Dasar dan Menengah (BAN-PDM) Republik Indonesia.</p>
              </div>
              <div className="border-t border-white/20 pt-4 text-xs font-mono text-brand-gold-light space-y-1 text-center">
                <p>No Sertifikat: BAN/MA-431/2025</p>
                <p>Berlaku s.d: Desember 2030</p>
              </div>
              <span className="inline-block bg-white/10 text-white border border-white/20 font-bold px-3 py-1 text-[10px] rounded uppercase">
                Valid & Terverifikasi
              </span>
            </div>

            {/* Right Prestasi list */}
            <div className="lg:col-span-2 bg-white border p-6 sm:p-10 rounded-2xl shadow-sm space-y-6">
              <span className="bg-brand-green/10 text-brand-green text-xs font-mono font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Prestasi Madrasah
              </span>
              <h3 className="text-xl font-display font-black text-slate-900 border-l-4 border-brand-gold pl-3">
                Lintas Penghargaan Akademik & Madrasah
              </h3>
              
              <div className="space-y-4">
                {[
                  {
                    year: '2026',
                    award: 'Medali Emas Bidang Astronomi Kejuaraan OSN Nasional',
                    desc: 'Diberikan oleh Balai Pengembangan Talenta Indonesia (BPTI) Kemendikbudristek.'
                  },
                  {
                    year: '2025',
                    award: 'Juara I Madrasah Sehat Tingkat Kemenag Provinsi Aceh',
                    desc: 'Evaluasi integrasi kebersihan kantin, lingkungan belajar, dan pemupukan sisa limbah organik.'
                  },
                  {
                    year: '2025',
                    award: 'Peringkat Terbaik II Lomba Riset Remaja Indonesia (Karya Ilmiah)',
                    desc: 'Riset pemanfaatan air asin tambak Lhokseumawe sebagai energi listrik sel volta sederhana.'
                  },
                  {
                    year: '2024',
                    award: 'Juara Umum Pekan Seni & Olahraga Madrasah (Aksioma) Regional',
                    desc: 'Meraih medali emas terbanyak cabang Pidato Bahasa Arab, Kaligrafi, Tenis Meja, dan Tahfidz.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 border rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-brand-gold-light flex items-center justify-center text-brand-gold-dark font-display font-extrabold text-sm shrink-0 border border-brand-gold/20">
                      {item.year}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-extrabold text-sm text-slate-900 leading-tight">{item.award}</h4>
                      <p className="text-xs text-slate-500 font-sans">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Riwayat Akreditasi */}
          <div className="bg-white border rounded-2xl shadow-sm p-6 sm:p-10 space-y-6">
            <h3 className="text-xl font-display font-black text-slate-900 border-l-4 border-brand-green pl-3">
              Riwayat Akreditasi Madrasah
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl bg-slate-50">
                <div>
                  <h4 className="font-display font-bold text-slate-900">Akreditasi A (Unggul)</h4>
                  <p className="text-xs text-slate-500">Tahun 2025 - 2030</p>
                </div>
                <div className="mt-2 sm:mt-0 px-3 py-1 bg-brand-green/10 text-brand-green rounded text-xs font-bold border border-brand-green/20 text-center">
                  Status: Aktif
                </div>
              </div>
              <p className="text-xs text-slate-400 font-mono italic">
                * Data historis akreditasi tahun sebelumnya sedang dalam proses sinkronisasi dengan database madrasah.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 8. ZONA INTEGRITAS (ZI) */}
      {subTab === 'zi' && (
        <div className="space-y-6" id="profile-zi">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div className="flex items-center">
              {/* Person-on-computer icon styled with app theme */}
              <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center mr-2">
                <span className="text-2xl text-brand-green">👨‍💻</span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h2 className="text-lg md:text-xl font-display font-black text-slate-900">Penilaian Mandiri Pembangunan Zona Integritas Tahun 2026</h2>
              <span className="bg-brand-gold text-white px-3 py-1 rounded text-xs shadow-sm font-bold whitespace-nowrap uppercase tracking-wider">Sesuai Permenpan 90 Tahun 2021</span>
            </div>
          </div>
          
          <div className="w-full overflow-x-auto text-[13px] font-sans">
            <table className="w-full border-collapse border border-slate-200 min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border border-slate-200 text-center font-bold text-slate-700">
                  <td className="p-2.5 border border-slate-200 w-12">No.</td>
                  <td className="p-2.5 border border-slate-200">Komponen Pengungkit</td>
                  <td className="p-2.5 border border-slate-200 w-16">Nilai</td>
                  <td className="p-2.5 border border-slate-200 w-16">%</td>
                  <td className="p-2.5 border border-slate-200 w-12">No.</td>
                  <td className="p-2.5 border border-slate-200">Komponen Hasil</td>
                  <td className="p-2.5 border border-slate-200 w-16">Nilai</td>
                  <td className="p-2.5 border border-slate-200 w-20">%</td>
                </tr>
              </thead>
              <tbody>
                {/* Row 1 */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-2 border border-slate-200 text-center text-slate-600">1</td>
                  <td className="p-2 border border-slate-200">
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded shadow-sm font-medium">Manajemen Perubahan (4)</span>
                      <span className="inline-block bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-1 rounded font-bold shadow-sm">Ev</span>
                    </div>
                  </td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">4</td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">100%</td>
                  
                  <td className="p-2 border border-slate-200 text-center text-slate-600">1</td>
                  <td className="p-2 border border-slate-200">
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="inline-block bg-brand-green/10 text-brand-green border border-brand-green/20 px-2 py-1 rounded shadow-sm font-bold">Birokrasi Bersih Akuntabel (22.5)</span>
                      <span className="inline-block bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-1 rounded font-bold shadow-sm">Ev</span>
                    </div>
                  </td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">18.13</td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">80.56%</td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-2 border border-slate-200 text-center text-slate-600">2</td>
                  <td className="p-2 border border-slate-200">
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded shadow-sm font-medium">Penataan Tatalaksana (3.5)</span>
                      <span className="inline-block bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-1 rounded font-bold shadow-sm">Ev</span>
                    </div>
                  </td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">3.5</td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">100%</td>
                  
                  <td className="p-2 border border-slate-200 text-center text-slate-600">2</td>
                  <td className="p-2 border border-slate-200">
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="inline-block bg-brand-green/10 text-brand-green border border-brand-green/20 px-2 py-1 rounded shadow-sm font-bold">Pelayanan Publik Prima (17.5)</span>
                      <span className="inline-block bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-1 rounded font-bold shadow-sm">Ev</span>
                    </div>
                  </td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">13.13</td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">75%</td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-2 border border-slate-200 text-center text-slate-600">3</td>
                  <td className="p-2 border border-slate-200">
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded shadow-sm font-medium">Penataan Sistem Manajemen Sdm Aparatur (5)</span>
                      <span className="inline-block bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-1 rounded font-bold shadow-sm">Ev</span>
                    </div>
                  </td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">5</td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">100%</td>
                  
                  <td colSpan={2} className="p-2 border border-slate-200 text-center font-black text-brand-green bg-slate-50 uppercase tracking-wider">TOTAL KOMPONEN HASIL (40)</td>
                  <td className="p-2 border border-slate-200 text-center font-black text-slate-900 bg-slate-50">31.25</td>
                  <td className="p-2 border border-slate-200 text-center font-black text-slate-900 bg-slate-50">78.13%</td>
                </tr>

                {/* Row 4 */}
                <tr className="hover:bg-slate-50 transition-colors bg-white">
                  <td className="p-2 border border-slate-200 text-center text-slate-600">4</td>
                  <td className="p-2 border border-slate-200">
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded shadow-sm font-medium">Penguatan Akuntabilitas (5)</span>
                      <span className="inline-block bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-1 rounded font-bold shadow-sm">Ev</span>
                    </div>
                  </td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">5</td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">100%</td>
                  
                  <td colSpan={4} rowSpan={4} className="p-4 border border-slate-200 text-center align-middle bg-white">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6 mb-6">
                      <span className="text-xl font-display font-black text-brand-green uppercase tracking-wide">Indeks PMPZI Satuan Kerja</span>
                      <span className="text-2xl font-black text-brand-gold">79.13</span>
                    </div>
                    <button className="bg-brand-gold text-white px-6 py-2.5 rounded shadow-sm hover:bg-yellow-600 transition-colors font-bold tracking-wide">Lihat Penilaian ZI Secara Lengkap</button>
                  </td>
                </tr>

                {/* Row 5 */}
                <tr className="hover:bg-slate-50 transition-colors bg-white">
                  <td className="p-2 border border-slate-200 text-center text-slate-600">5</td>
                  <td className="p-2 border border-slate-200">
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded shadow-sm font-medium">Penguatan Pengawasan (7.5)</span>
                      <span className="inline-block bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-1 rounded font-bold shadow-sm">Ev</span>
                    </div>
                  </td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">7.5</td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">100%</td>
                </tr>

                {/* Row 6 */}
                <tr className="hover:bg-slate-50 transition-colors bg-white">
                  <td className="p-2 border border-slate-200 text-center text-slate-600">6</td>
                  <td className="p-2 border border-slate-200">
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded shadow-sm font-medium">Peningkatan Kualitas Pelayanan Publik (5)</span>
                      <span className="inline-block bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-1 rounded font-bold shadow-sm">Ev</span>
                    </div>
                  </td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">5</td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">100%</td>
                </tr>

                {/* TOTAL ASPEK PEMENUHAN */}
                <tr className="bg-slate-50">
                  <td colSpan={2} className="p-2 border border-slate-200 text-center font-black text-brand-green uppercase tracking-wider">TOTAL ASPEK PEMENUHAN (30)</td>
                  <td className="p-2 border border-slate-200 text-center font-black text-slate-900">30</td>
                  <td className="p-2 border border-slate-200 text-center font-black text-slate-900">100%</td>
                </tr>

                {/* Reform 1 */}
                <tr className="hover:bg-slate-50 transition-colors bg-white">
                  <td className="p-2 border border-slate-200 text-center text-slate-600">1</td>
                  <td className="p-2 border border-slate-200">
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded shadow-sm font-medium">Manajemen Perubahan (4)</span>
                      <span className="inline-block bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-1 rounded font-bold shadow-sm">Ev</span>
                    </div>
                  </td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">4</td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">100%</td>
                  
                  <td colSpan={4} rowSpan={8} className="p-4 border border-slate-200 text-center align-middle bg-white">
                    <button className="bg-brand-green text-white px-8 py-3 rounded shadow-sm hover:bg-brand-green-light transition-colors text-[14px] font-bold tracking-wide w-full max-w-sm">
                      Kirim Hasil Penilaian Zona Integritas Ke Menteri Agama
                    </button>
                  </td>
                </tr>

                {/* Reform 2 */}
                <tr className="hover:bg-slate-50 transition-colors bg-white">
                  <td className="p-2 border border-slate-200 text-center text-slate-600">2</td>
                  <td className="p-2 border border-slate-200">
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded shadow-sm font-medium">Penataan Tatalaksana (3.5)</span>
                      <span className="inline-block bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-1 rounded font-bold shadow-sm">Ev</span>
                    </div>
                  </td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">3.5</td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">100%</td>
                </tr>

                {/* Reform 3 */}
                <tr className="hover:bg-slate-50 transition-colors bg-white">
                  <td className="p-2 border border-slate-200 text-center text-slate-600">3</td>
                  <td className="p-2 border border-slate-200">
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded shadow-sm font-medium">Penataan Sistem Manajemen Sdm Aparatur (5)</span>
                      <span className="inline-block bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-1 rounded font-bold shadow-sm">Ev</span>
                    </div>
                  </td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">0</td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">0%</td>
                </tr>

                {/* Reform 4 */}
                <tr className="hover:bg-slate-50 transition-colors bg-white">
                  <td className="p-2 border border-slate-200 text-center text-slate-600">4</td>
                  <td className="p-2 border border-slate-200">
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded shadow-sm font-medium">Penguatan Akuntabilitas (5)</span>
                      <span className="inline-block bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-1 rounded font-bold shadow-sm">Ev</span>
                    </div>
                  </td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">0</td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">0%</td>
                </tr>

                {/* Reform 5 */}
                <tr className="hover:bg-slate-50 transition-colors bg-white">
                  <td className="p-2 border border-slate-200 text-center text-slate-600">5</td>
                  <td className="p-2 border border-slate-200">
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded shadow-sm font-medium">Penguatan Pengawasan (7.5)</span>
                      <span className="inline-block bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-1 rounded font-bold shadow-sm">Ev</span>
                    </div>
                  </td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">6.5</td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">86.67%</td>
                </tr>

                {/* Reform 6 */}
                <tr className="hover:bg-slate-50 transition-colors bg-white">
                  <td className="p-2 border border-slate-200 text-center text-slate-600">6</td>
                  <td className="p-2 border border-slate-200">
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded shadow-sm font-medium">Peningkatan Kualitas Pelayanan Publik (5)</span>
                      <span className="inline-block bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-1 rounded font-bold shadow-sm">Ev</span>
                    </div>
                  </td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">3.88</td>
                  <td className="p-2 border border-slate-200 text-center font-medium text-slate-700">77.5%</td>
                </tr>

                {/* TOTAL ASPEK REFORM */}
                <tr className="bg-slate-50">
                  <td colSpan={2} className="p-2 border border-slate-200 text-center font-black text-brand-green uppercase tracking-wider">TOTAL ASPEK REFORM (30)</td>
                  <td className="p-2 border border-slate-200 text-center font-black text-slate-900">17.88</td>
                  <td className="p-2 border border-slate-200 text-center font-black text-slate-900">59.58%</td>
                </tr>
                
                {/* TOTAL KOMPONEN PENGUNGKIT */}
                <tr className="bg-slate-50">
                  <td colSpan={2} className="p-2 border border-slate-200 text-center font-black text-brand-green uppercase tracking-wider">TOTAL KOMPONEN PENGUNGKIT (60)</td>
                  <td className="p-2 border border-slate-200 text-center font-black text-slate-900">47.88</td>
                  <td className="p-2 border border-slate-200 text-center font-black text-slate-900">79.79%</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
