/** @type {import('next').NextConfig} */
const nextConfig = {
  // تكوين إعادة التوجيه للصفحة الرئيسية
  async redirects() {
    return [
      {
        source: '/',
        destination: '/gpa',
        permanent: true,
      },
    ]
  },
  // تحسين تحميل الصور
  images: {
    unoptimized: true,
  },
  // تجاهل أخطاء البناء
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
