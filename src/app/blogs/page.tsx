import { Footer, Header } from "@/components/shared";
import Link from "next/link";

export const metadata = {
  title: "Tin tức & Kiến thức | ADN Huyết Thống",
  description:
    "Tin tức và kiến thức về xét nghiệm ADN huyết thống, bảo mật và ứng dụng.",
};

const posts = [
  {
    title: "Xét nghiệm ADN huyết thống là gì?",
    excerpt:
      "Tìm hiểu cách xét nghiệm ADN giúp xác định quan hệ cha con, mẹ con, hoặc anh em với độ chính xác cao.",
    tag: "Kiến thức",
  },
  {
    title: "Bảo mật trong xét nghiệm ADN",
    excerpt:
      "Khám phá cách chúng tôi bảo vệ dữ liệu ADN của bạn với công nghệ mã hóa tiên tiến.",
    tag: "Bảo mật",
  },
  {
    title: "Ứng dụng của xét nghiệm ADN",
    excerpt:
      "Ngoài huyết thống, xét nghiệm ADN còn được sử dụng trong di truyền, y học, và pháp y.",
    tag: "Ứng dụng",
  },
  {
    title: "Quy trình lấy mẫu ADN tại nhà",
    excerpt:
      "Hướng dẫn chi tiết cách lấy mẫu tăm bông miệng an toàn và đúng chuẩn.",
    tag: "Hướng dẫn",
  },
  {
    title: "Xét nghiệm ADN cho trẻ em",
    excerpt:
      "Những lưu ý quan trọng khi thực hiện xét nghiệm ADN cho trẻ nhỏ.",
    tag: "Tư vấn",
  },
];

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <Header />
      <main className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <section className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
            Tin tức & Kiến thức về ADN
          </h1>
          <p className="max-w-3xl mx-auto text-sm text-gray-600 md:text-base">
            Cập nhật thông tin mới nhất về xét nghiệm ADN huyết thống, bảo mật
            và ứng dụng trong cuộc sống.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.title}
              className="p-6 bg-white border border-blue-100 rounded-xl shadow-sm transition-shadow hover:shadow-lg"
            >
              <span className="inline-flex px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full">
                {post.tag}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-gray-800">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{post.excerpt}</p>
              <Link
                href="/blogs"
                className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                Đọc thêm →
              </Link>
            </div>
          ))}
        </section>

        <section className="mt-12 text-center">
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            Cần tư vấn?
          </h2>
          <p className="mb-6 text-sm text-gray-600 md:text-base">
            Liên hệ với đội ngũ chuyên gia để được giải đáp mọi thắc mắc về xét
            nghiệm ADN.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Liên hệ ngay
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
