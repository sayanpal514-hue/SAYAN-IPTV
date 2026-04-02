# Sayan-IPTV 📺

A modern, high-performance IPTV streaming application built with React, Vite, and Supabase.

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-blue?logo=vercel)](https://sayan-iptv-10.vercel.app/)

## 🚀 Live Demo
Experience the application live here: [https://sayan-iptv-10.vercel.app/](https://sayan-iptv-10.vercel.app/)

## ✨ Features
-   **Live Sports Streaming**: High-quality streaming for IPL and other cricket events.
-   **Modern UI**: Sleek, responsive design built with Tailwind CSS and Radix UI components.
-   **Real-time Updates**: Powered by Supabase for dynamic content management.
-   **HLS.js Integration**: Seamless playback for m38u/HLS streams.

## 📜 Credits
This project utilizes high-quality stream data and M3U playlists from external providers. Special thanks to:

-   **siam3310**: For providing the `crichdmini` M3U/JSON stream source.
    -   Source: `https://raw.githubusercontent.com/siam3310/crichdmini/refs/heads/main/siamscrichd.m3u`

## 🛠️ Tech Stack
-   **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
-   **Database/Auth**: [Supabase](https://supabase.com/)
-   **Streaming**: [HLS.js](https://github.com/video-dev/hls.js/)

## 🛠️ Local Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/sayanpal514-hue/SAYAN-IPTV.git
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

---
Built with ❤️ by Sayan.
