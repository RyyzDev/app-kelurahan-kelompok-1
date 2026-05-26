import React from 'react'
import '../App.css'
import './MainPage.css'
import heroImg from '../assets/hero.png'

export default function MainPage() {
  return (
    <div className="mp-root">
      <header className="mp-header">
        <button className="mp-menu" aria-label="menu">☰</button>
        <h1 className="mp-title">Kelurahan Nusantara</h1>
        <button className="mp-profile" aria-label="profile">A</button>
      </header>

      <main className="mp-main">
        <section className="mp-hero">
          <img src={heroImg} alt="Hero" className="mp-hero-img" />
          <div className="mp-search">
            <input type="search" placeholder="Cari layanan atau berita" />
          </div>
        </section>

        <section className="mp-quick">
          <button className="mp-quick-btn">Surat</button>
          <button className="mp-quick-btn">Keluarga</button>
          <button className="mp-quick-btn">RT/RW</button>
          <button className="mp-quick-btn">Pengaduan</button>
        </section>

        <section className="mp-services">
          <h2>Pelayanan Utama</h2>
          <div className="mp-cards">
            <article className="mp-card">
              <div className="mp-card-icon">📄</div>
              <div>
                <h3>Permohonan Surat</h3>
                <p>Ajukan surat keterangan, domisili, dan lain-lain.</p>
              </div>
            </article>
            <article className="mp-card">
              <div className="mp-card-icon">👪</div>
              <div>
                <h3>Kartu Keluarga</h3>
                <p>Update data keluarga dan cetak KK.</p>
              </div>
            </article>
            <article className="mp-card">
              <div className="mp-card-icon">📍</div>
              <div>
                <h3>Peta & Info RT</h3>
                <p>Informasi wilayah RT/RW dan fasilitas.</p>
              </div>
            </article>
            <article className="mp-card">
              <div className="mp-card-icon">⚠️</div>
              <div>
                <h3>Pengaduan</h3>
                <p>Lapor masalah lingkungan atau layanan.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="mp-news">
          <h2>Berita & Pengumuman</h2>
          <ul>
            <li>
              <strong>Posyandu Anak</strong> — 12 Juni 2026
            </li>
            <li>
              <strong>Pembagian Bantuan</strong> — 5 Juni 2026
            </li>
          </ul>
        </section>
      </main>

      <nav className="mp-bottomnav" aria-label="bottom navigation">
        <button className="bn-item active">Home</button>
        <button className="bn-item">Layanan</button>
        <button className="bn-item">Peta</button>
        <button className="bn-item">Profil</button>
      </nav>
    </div>
  )
}
