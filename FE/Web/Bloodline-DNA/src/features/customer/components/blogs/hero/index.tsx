import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../../ui/Breadcrumb";

interface BlogHeroProps {
  isVisible: boolean;
}

export const BlogHero: React.FC<BlogHeroProps> = ({ isVisible }) => {
  return (
    <section className="relative w-full py-20 overflow-hidden md:py-28 bg-blue-50">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0,50 C25,80 75,20 100,50 L100,100 L0,100 Z" fill="#1e40af"/></svg>
      </div>
      <div className="container relative z-10 px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="/" className="text-blue-600 hover:text-blue-800">Trang Chủ</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><span className="font-semibold text-blue-900">Blog Y Tế</span></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <h1 className="mb-4 text-4xl font-bold leading-tight text-blue-900 md:text-5xl lg:text-6xl">Blog Y Tế
          <span className="block mt-2 text-2xl font-medium text-blue-700 md:text-3xl">
            Kiến Thức Sức Khỏe
          </span>
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">Khám phá những bài viết chuyên sâu về sức khỏe, y học và lối sống khỏe mạnh từ đội ngũ chuyên gia hàng đầu.</p>
      </div>
    </section>
  );
};