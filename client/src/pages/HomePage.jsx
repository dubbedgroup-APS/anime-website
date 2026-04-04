import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { fetchVideos } from "../api/services";
import { resolveMediaUrl } from "../api/client";
import UploadPanel from "../components/UploadPanel.jsx";
import useAuth from "../hooks/useAuth";

const creators = [
  {
    name: "Elena Voss",
    role: "Audio Curator",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdj_5CGobwNhuzGBTl3PqOQjn_dMSf9B31DZylsON5l1gZPOwngJLV2NnvW1wtt-ctpHg3NRxqXnZcOlWXVrZUAMwXFoD-w5k6_rPWfORkSPtISXr5pYr1VooV-WDLVhvrwL9Pq_CFxelkHwLPxltCqG4WAFCSx3iccPbCNeGqMUHQVa0VE1WYGf_W_IljvyixZCbX9lEW1J3rUVRcJhiuQu8aTk5cUFT9qfM28cG7PrVLax3JOmvEL_Y-PamrfEC4zZt4sq8iEfE",
  },
  {
    name: "Marcus Thorne",
    role: "Studio Director",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCcO1YokYAn_vVZGsFtZ6PbdY-d59fXMGRHhJxVw07sh1ITjhwyHAZ4DHK1qWtZCEUtGhNSnhT9SoEwaCx-De31cyMjGo3nrgRHhXqq7yk14orczhUFnaPxLq36AsB4e7ddc-aS9-o4XM_Vx2UiJ0f00KQVJC58iITcNSd62Dcmmab3HiLtLLbORf70bEwY7BIzcB0fGwcEqjlWsTAPLn2pN2ZNNgHYtgk52lbvfiytQj0qMXK96Ez4nUa4bhSt306K2HcAYJ2Es6E",
  },
  {
    name: "Julian Grey",
    role: "Motion Artist",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCLYxA_6TYL3KHSnExpez-kTzE_46GNalXs2mCdvZj2RHe7iCzSMeZsacRI7oYrefGISGphoL57jO_qN3TNj6Nuf_v6-chWjsAEmYVr2v9RhB858JmWrcFmro6-RTAgS4Rq-vxxTSuHxU6LcjG7LmUf2Csaf3GbI4gygz1wPmx9SViq_TlQjiSmXdU8M49grc4A3fvWPn9ukQUZZVNRpasJ-rQa6-67pYua2K-XzUosb6UW2ENGV7r__Nu6o79xrcRnBnCyJwZc0iY",
  },
  {
    name: "Sarah Chen",
    role: "Visual Editor",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2t8rvaJ5Pt4hfPTyyQUH0aUy6BLL5EB5Ct41JrRhk_1IYIoEll46kP2EZ9MAm1Ai1MRRrF8pzktGXwAIRgrvRkXD0WIT3phjKtY3hIeCeQnXfCh3ahqF2IjrBUe8wbKoIrGlCvQDJjVLQA7IsD-sxfS-SW8-9D27vBM6MGh73-sOFC-sT-mvAbQ04SSFmTgmmFw9fmu3fRvDQSQFyc5lTd483ywVSNPdrhQYo2_HivD1kYgJgsTVE7FsffxMs6W3XKs_weeKiLQE",
  },
  {
    name: "David Park",
    role: "Sound Designer",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC509QmcZuMVHxjm4yRyn6n8bcHDM672-9EbG1a2rQYRibdGag33AKWIoSQsUKuGQ9nlLGkQt3kTDa6dqkd-7CKePPzs-2ZePHSJizp4RnMETaOtlU6ZVp_Kq_DDPaYLE_PDdGPUFzC2eW4uV-WZqoM2CzAzJP_BtsbPA2RRvXJWvC8MPpaicp-zHf7EPT2583jlEUjlghYsm5jHapLohRHQRcIPGdlWAZgWzb9V8Ouc5ReN5p4hovTPJ2fmBw9MLrUq2H5a8WsQS8",
  },
];

const trending = [
  {
    title: "The Apex Narrative",
    label: "MOST VIEWED",
    description:
      "A cinematic journey across the highest peaks of the Himalayas, dubbed with precision.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCSvvV75g9yycyJiFJcOKFhiZm-lxS8cGiP1tNfSU95nlb-nnmf0A4-vGwH4uVemAn7E1n-v5_9WJEMRVR8A06OwDHcS8TzT7BFG0h7PmUvfpYfL3I_A8KvvOCcx81W0ErNaW0DGtd1FSK85v3qADykYINdiRKSEoUiNwlLVCi8RQHHg__iXKGDhbFDU7ZUCvT3lVjWRCdewPIKsPkuJZgUwI2Hw_bHcSn9n37j6zdFuA8O8FRRJWEumAiZ2GN1TbdtLix33JYoAVc",
  },
  {
    title: "Abyssal Dreams",
    description: "Deep sea exploration series",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-KzfUH_4HeD3kQSLJmrt48cnpnjSgl4R2ipuGyvqJ-iha3v-ok6XS_Ay3Dk3d6qLDQdnJdEXfltotqvTxanbpbbDVLZjWYzwi-8a7ziIJgYhaaxNVXAFyGE3DWLNf_GufH8T9D9p1qmXZAOVCxR5r00nidwCl_bCPsfjyYpE5MfgfFOkfoDZAwMiAHBcapz8c0YYl-ToD7Uy1bD_2QgcNVNaOGksfydoaepIkC5V1kz7IyJOIfEDVo4V3N1uD-mQ-FnQR7JTMUag",
  },
  {
    title: "Global Flux",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCy2UWRPDYPZrTyo-xC-MHjMOdsXuytby2nedNiNd_7A9aZVZC7H31-RIQtDLy2wK_WsHw1wDzsmMEgtiwju5pR0lP0LNbCNn3T2ecDrE2j12rFaijdTR-KLvG2jYj_AkjSPbYaxMi8J7h_vkBM4-5zutHYURDpx_5wSe-EGxesS2kgpECzSH51fPxAw64J7miKM1XNg9UVLRcp5ETNDWHZhPBj_qRwvMzxgN3lxCfJjx0uw3YYVQsYBc8r8tT6b37xT789MAPs4Ss",
  },
  {
    title: "Stellar Drift",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6vvwIDIVfRWoaLfywlezCl0BORfwYziLpqfFc5CP_B7YeafJ44adwzQ4wVj8ogPUywdirSu2kAJlNt4H96msQkRgTcptSW1JThSwqGjkf4Y0aqqvwsgsU12MpBQeNtvGLCNVbqgK6izvTE7YFhJbl2_4MboQS2Lxm0Wntwc_hUjUiRHs5c6ggB4P8xViaQTRqRXJgt8G0CmLxfG2Zf8apUZ8aAXOwmsjmAk2xCtAXYVOKh4KWw2o01TVncS8MzDX9d2Fnw9u3bPI",
  },
];

const fallbackThumb =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDjsdhJI7WbNFHM4dr6ieWXSdrOvScNZuNpPwc21TcPdIhuBXgNUJeae22XVhiQ4r7VUvtg5pWnmt6Sy_lkXrboNuuV32giTEvGC9kFQOzimRttpV00mvE4D1ep7gN9a-pbbpFIiLROrWJUgjjkW7qfR9RAaqTkehtqqZkFPRGY6cMYp6623SKIN2TjT5kfvwkNOAV2MT75I41an2fPcH-vm2eGXj8xiMcXX9Ttmd8iC4ETgyq_XGJSSZGwJVw1SeN1RvHU592hDXk";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const items = await fetchVideos();
        setVideos(items);
        setError("");
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Could not load videos right now."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const featuredVideo = useMemo(() => videos[0], [videos]);

  return (
    <div className="space-y-20">
      <section className="relative min-h-[520px] overflow-hidden rounded-3xl">
        <div className="absolute inset-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFBn8HVI2sFWSa3Y4AqME_v5A2H0kc3AvakH_hHQ-YWc4jtmJMhYxUP96cTC6lTpSNoi5NbIhVt5Ga77A_QVJ-IGKERnHO2DTQ9X_phI4Za0c7WyrPuF3VynQoZJxUdxYpuUReq1oQVEpA0Kdqbe4dR3L6a9-O0dMboGJ8whks1eDT-N0ojAnWZDiOnjFMtPaRCA-uAW6VrwJU9D45OYXomoAX8Gn_3KExVLiN5x7F07mwQ8ckRMaH66PGPi7VNyqeFzRRbtu5Bzg"
            alt="Cinematic digital landscape"
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-8 p-10 sm:p-12">
          <span className="inline-block rounded-full bg-surface-container-high px-4 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            Featured technology
          </span>
          <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface sm:text-6xl lg:text-7xl">
            Discover the future of
            <br />
            <span className="text-gradient">content dubbing</span>
          </h1>
          <p className="text-base leading-relaxed text-on-surface-variant sm:text-lg">
            Experience localized entertainment like never before. High-fidelity
            audio artifacts curated for the modern digital connoisseur.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to={featuredVideo ? `/player/${featuredVideo._id}` : "/login"}
              className="rounded-md bg-gradient-to-r from-primary to-primary-dim px-8 py-4 text-sm font-bold text-on-primary-fixed shadow-lg shadow-primary-dim/20 transition hover:opacity-90"
            >
              Start exploring
            </Link>
            <Link
              to="/playlists"
              className="rounded-full border border-outline-variant/20 bg-white/5 px-8 py-4 text-sm font-semibold text-on-surface transition hover:bg-white/10"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-headline font-bold text-on-surface">
            Digital Curators
          </h2>
          <span className="text-sm font-medium text-primary">View all creators</span>
        </div>
        <div className="no-scrollbar flex gap-6 overflow-x-auto pb-4">
          {creators.map((creator) => (
            <div
              key={creator.name}
              className="group flex min-w-[110px] flex-col items-center gap-3"
            >
              <div className="h-20 w-20 rounded-full border-2 border-primary/20 p-1 transition-all group-hover:border-primary">
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <span className="text-xs font-medium text-on-surface-variant group-hover:text-primary">
                {creator.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {isAuthenticated && user?.canUpload ? <UploadPanel /> : null}
      {isAuthenticated && !user?.canUpload ? (
        <div className="glass-card rounded-2xl p-6 text-sm text-on-surface-variant">
          Only the owner account can upload videos. Your account can still watch,
          save playlists, and keep a personal history.
        </div>
      ) : null}

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-headline font-bold text-on-surface">
            Latest Artifacts
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              className="glass-card rounded-full p-2 text-on-surface hover:bg-white/10"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              type="button"
              className="glass-card rounded-full p-2 text-on-surface hover:bg-white/10"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="glass-card rounded-2xl p-6 text-on-surface-variant">
            Loading videos...
          </div>
        ) : null}
        {error ? (
          <div className="glass-card rounded-2xl p-6 text-coral">{error}</div>
        ) : null}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <Link
              key={video._id}
              to={`/player/${video._id}`}
              className="group block"
            >
              <div className="glass-card relative mb-4 aspect-video overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-[1.02]">
                <img
                  src={resolveMediaUrl(video.thumbnailPath) || fallbackThumb}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 text-[10px] font-bold text-white">
                  {video.duration || "12:45"}
                </div>
              </div>
              <div className="px-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-on-surface transition-colors group-hover:text-primary">
                    {video.title}
                  </h3>
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">
                    more_vert
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-on-surface-variant">
                  <span>{video.category || "General"}</span>
                  <span className="h-1 w-1 rounded-full bg-outline-variant"></span>
                  <span>{video.views || 0} Views</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <h2 className="text-4xl font-headline font-bold text-on-surface">
          Trending Masterpieces
        </h2>
        <div className="grid auto-rows-[250px] grid-cols-1 gap-6 md:grid-cols-4">
          <div className="group relative overflow-hidden rounded-xl glass-card md:col-span-2 md:row-span-2">
            <img
              src={trending[0].image}
              alt={trending[0].title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent opacity-80" />
            <div className="absolute bottom-0 left-0 space-y-4 p-8">
              <span className="inline-block rounded bg-primary px-2 py-1 text-[10px] font-bold text-on-primary-fixed">
                {trending[0].label}
              </span>
              <h3 className="text-3xl font-headline font-bold text-white">
                {trending[0].title}
              </h3>
              <p className="text-sm text-slate-300">{trending[0].description}</p>
              <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
                Watch now
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl glass-card md:col-span-2">
            <img
              src={trending[1].image}
              alt={trending[1].title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 transition-all group-hover:bg-black/20" />
            <div className="absolute bottom-4 left-6">
              <h4 className="text-xl font-headline font-bold text-white">
                {trending[1].title}
              </h4>
              <p className="text-xs text-slate-300">{trending[1].description}</p>
            </div>
          </div>

          {trending.slice(2).map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-xl glass-card"
            >
              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-4 left-6">
                <h4 className="text-lg font-headline font-bold text-white">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-20 flex flex-col items-center gap-4 border-t border-white/5 bg-surface/20 px-8 py-12 text-xs uppercase tracking-widest text-on-surface-variant">
        <div className="flex flex-wrap gap-8">
          <span className="transition-colors hover:text-white">About</span>
          <span className="transition-colors hover:text-white">Privacy</span>
          <span className="transition-colors hover:text-white">Terms</span>
          <span className="transition-colors hover:text-white">Support</span>
        </div>
        <p className="font-headline text-lg font-bold text-on-surface">
          Domain Dubbing
        </p>
        <p>© 2024 Domain Dubbing. Digital Curator.</p>
      </footer>
    </div>
  );
};

export default HomePage;
