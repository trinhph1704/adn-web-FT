import type { BlogPost } from "../types/home.types";

const posts: BlogPost[] = [
  {
    title: "Xét nghiệm ADN huyết thống là gì?",
    description:
      "Tìm hiểu cách xét nghiệm ADN giúp xác định quan hệ cha con, mẹ con, hoặc anh em với độ chính xác cao.",
    link: "#",
  },
  {
    title: "Bảo mật trong xét nghiệm ADN",
    description:
      "Khám phá cách chúng tôi bảo vệ dữ liệu ADN của bạn với công nghệ mã hóa tiên tiến.",
    link: "#",
  },
  {
    title: "Ứng dụng của xét nghiệm ADN",
    description:
      "Ngoài huyết thống, xét nghiệm ADN còn được sử dụng trong di truyền, y học, và pháp y.",
    link: "#",
  },
];

const BlogSection: React.FC = () => (
  <section className="py-16 bg-white md:py-20">
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <h2 className="mb-8 text-2xl font-bold text-center text-gray-800 md:text-3xl">
        Tin tức & Kiến thức về ADN
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.map((post, index) => (
          <div
            key={index}
            className="p-6 transition-shadow border border-blue-200 rounded-lg shadow-md bg-blue-50 hover:shadow-lg"
          >
            <h3 className="mb-2 text-lg font-semibold text-gray-800 md:text-xl">
              {post.title}
            </h3>
            <p className="mb-4 text-sm text-gray-600 md:text-base">
              {post.description}
            </p>
            <a
              href={post.link}
              className="font-semibold text-blue-600 hover:text-blue-800"
            >
              Đọc thêm →
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BlogSection;
