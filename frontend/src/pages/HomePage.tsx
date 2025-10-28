// src/pages/Home.tsx
import { Link as ScrollLink } from "react-scroll";
import {
  GraduationCap,
  Sparkles,
  Workflow,
  ListChecks,
  Gauge,
  HeartPulse,
  Target,
  Layers,
  Radar,
  Users,
  Shield,
  Megaphone,
  Globe2,
  LineChart,
  Briefcase,
  BookOpen,
  ChevronRight,
  Flame,
  Zap,
} from "lucide-react";
import { div } from "framer-motion/client";

type Post = { title: string; href?: string; thumb?: string };

const RECENT_POSTS: Post[] = [
  { title: "Sentiment Analysis là gì?", href: "#sentiment-analysis" },
  { title: "Lý do nên sử dụng Sentiment Analysis?", href: "#ly-do" },
  { title: "Cách hoạt động (tóm tắt quy trình)", href: "#cach-hoat-dong" },
  { title: "Các loại hình phân tích cảm xúc", href: "#cac-loai-hinh-pt-cam-xuc" },
  { title: "Ưu điểm và thách thức", href: "#uu-diem-va-thach-thuc" },
  { title: "Ứng dụng thực tế", href: "#ung-dung-thuc-te" },
  { title: "Về khóa luận của nhóm", href: "#khoa-luan" },
];

export default function HomePage() {
  return (
    <div className="w-full">
      <div className="grid lg:grid-cols-12 gap-6 max-w-7xl mx-auto px-4">
        <div className="lg:col-span-8 space-y-8">
          <header className="space-y-3">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-10 h-10 text-blue-400" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Emotion AI Analyzer – Trang Giới Thiệu <br />
              </h1>
            </div>
          </header>

          <Section title="">
            <p className="text-xl text-gray-300">
              <b>
                Tìm hiểu về Phân tích Cảm xúc (Sentiment Analysis) và ứng dụng
                trong Khóa luận tốt nghiệp.
              </b>
            </p>
          </Section>

          <Section
            title="Mục tiêu cốt lõi của phân tích cảm xúc"
            icon={<Flame className="w-5 h-5 text-blue-400" />}
          >
            <p className="text-gray-300">
              <br />
              Mục tiêu cốt lõi của phân tích cảm xúc là hiểu và định lượng các
              ý kiến, cảm xúc và thái độ chủ quan của con người từ dữ liệu văn
              bản (đánh giá sản phẩm, mạng xã hội…). Công nghệ này dựa vào
              NLP/ML để tự động phân loại thành <b>tích cực</b>, <b>tiêu cực</b>{" "}
              hoặc <b> trung tính</b> và có thể mở rộng sang nhận diện cảm xúc
              (happy, sad, angry…).
            </p>
          </Section>

          <section id="sentiment-analysis" className="scroll-mt-24">
            <Section
              title="Sentiment Analysis là gì?"
              icon={<Zap className="w-5 h-5 text-blue-400" />}
            >
              <p>
                <b>Phân tích cảm xúc (Sentiment Analysis)</b> là quá trình sử
                dụng công nghệ để tự động xác định thái độ – tích cực, tiêu cực,
                hay trung tính – được thể hiện trong một đoạn văn bản. Đây là
                một lĩnh vực con của Trí tuệ Nhân tạo (AI). <br />
              </p>
              <br />

              <figure className="rounded-2xl overflow-hidden border border-gray-700 bg-gray-800">
                <img
                  src="/assets/hero-sentiment.png" /* đặt file ở public/assets/hero-sentiment.png */
                  alt="Sentiment Analysis minh hoạ"
                  className="w-full h-auto object-cover"
                />
                <figcaption className="text-center text-sm text-gray-400 py-3 border-t border-gray-700">
                  Sentiment Analysis là gì?
                </figcaption>
              </figure>
              <br />

              <p>
                Phân tích cảm xúc chủ yếu dựa vào Xử lý Ngôn ngữ Tự nhiên
                (Natural Language Processing – NLP) để máy tính “hiểu” ngôn ngữ
                viết. Nó cũng ứng dụng mạnh mẽ Học máy (Machine Learning – ML)
                và các kỹ thuật Phân tích Văn bản (Text Analytics) để phân loại
                cảm xúc tự động. <br />
              </p>
            </Section>
          </section>

          <section id="ly-do" className="scroll-mt-24">
            <Section
              title="Lý do nên sử dụng Sentiment Analysis?"
              icon={<Sparkles className="w-5 h-5 text-blue-400" />}
            >
              <b>Sử dụng Phân tích cảm xúc (Sentiment Analysis)</b> mang lại
              nhiều lợi ích thiết thực, giúp doanh nghiệp và tổ chức hiểu rõ
              hơn về công chúng và đưa ra quyết định tốt hơn dựa trên dữ liệu
              thực tế thay vì phỏng đoán. Công nghệ này xử lý hiệu quả nguồn
              thông tin khổng lồ. <br />
              <br />
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>
                  <b>Hiểu khách hàng sâu sắc hơn:</b> Phân tích cảm xúc cho
                  phép bạn tự động xử lý hàng ngàn đánh giá, bình luận, phản hồi
                  của khách hàng. Từ đó, bạn nắm bắt được chính xác họ nghĩ gì,
                  cảm nhận ra sao về sản phẩm, dịch vụ, giúp xây dựng mối quan hệ
                  tốt hơn.
                </li>
                <li>
                  <b>Theo dõi danh tiếng thương hiệu hiệu quả:</b> Công cụ
                  Sentiment Analysis giúp theo dõi dư luận về thương hiệu trên
                  mạng xã hội, tin tức, diễn đàn theo thời gian thực. Bạn có thể
                  nhanh chóng biết được công chúng đang nhìn nhận thương hiệu
                  tích cực hay tiêu cực, và tại sao, để có phản ứng phù hợp.
                </li>
                <li>
                  <b>Cải thiện chất lượng sản phẩm và dịch vụ:</b> Bằng cách
                  phân tích các ý kiến đóng góp và phàn nàn tự động, bạn xác định
                  được những điểm khách hàng yêu thích hoặc không hài lòng.
                  Thông tin này rất quan trọng để ưu tiên cải tiến sản phẩm, sửa
                  lỗi, hoặc nâng cấp dịch vụ đúng nhu cầu.
                </li>
                <li>
                  <b>Hỗ trợ ra quyết định dựa trên dữ liệu:</b> Các báo cáo từ
                  phân tích cảm xúc cung cấp cái nhìn khách quan về thị trường và
                  khách hàng. Ban lãnh đạo, bộ phận marketing, và phát triển sản
                  phẩm có thể dựa vào đó để đưa ra các chiến lược kinh doanh,
                  chiến dịch quảng cáo hiệu quả hơn.
                </li>
                <li>
                  <b>Phát hiện sớm và xử lý khủng hoảng:</b> Việc theo dõi liên
                  tục giúp phát hiện sớm các luồng ý kiến tiêu cực tăng đột biến.
                  Điều này cho phép doanh nghiệp chủ động xác định nguyên nhân và
                  xử lý khủng hoảng truyền thông tiềm ẩn trước khi nó lan rộng,
                  bảo vệ hình ảnh thương hiệu.
                </li>
              </ul>
              <br />

              <figure className="rounded-2xl overflow-hidden border border-gray-700 bg-gray-800">
              <img
                    src="/assets/sentiment-analysis-1.jpg" 
                    alt="Sentiment Analysis minh hoạ"
                    className="w-full h-auto object-cover"
                  />
                  <figcaption className="text-center text-sm text-gray-400 py-3 border-t border-gray-700">
                    Sentiment analysis phân loại các ý kiến, đánh giá của người dùng thành các nhóm cảm xúc
                  </figcaption>
              </figure>
            </Section>
          </section>

          <section id="cach-hoat-dong" className="scroll-mt-24">
            <Section
              title="Cách hoạt động (tóm tắt quy trình)"
              icon={<Workflow className="w-5 h-5 text-blue-400" />}
            >
              <ol className="list-decimal pl-5 space-y-2 text-gray-300">
                <li>
                  <h2>
                    <b>Thu thập nguồn dữ liệu văn bản:</b>
                  </h2>
                  <p>
                    Đầu tiên, dữ liệu dưới dạng văn bản cần được tập hợp từ nhiều
                    nguồn đa dạng. Các nguồn này có thể là mạng xã hội, các diễn
                    đàn trực tuyến, trang đánh giá sản phẩm, thư điện tử, hoặc
                    các loại tài liệu chứa văn bản khác.
                  </p>
                  <br />
                  <p>
                    Giai đoạn thu thập này đóng vai trò nền tảng, đảm bảo có đủ
                    nguyên liệu thông tin cho việc phân tích cảm xúc.
                  </p>
                </li>

                <li>
                  <h2>
                    <b>Làm sạch và chuẩn bị dữ liệu (Tiền xử lý)</b>
                  </h2>
                  <p>
                    Tiền xử lý dữ liệu là một giai đoạn thiết yếu nhằm chuẩn bị
                    dữ liệu thô trước khi áp dụng các mô hình học máy (Machine
                    Learning) hay tiến hành phân tích.
                  </p>
                  <br />
                  <p>
                    Quá trình tiền xử lý dữ liệu hướng đến việc làm sạch, biến
                    đổi và cấu trúc lại dữ liệu, mục đích là đảm bảo chất lượng
                    dữ liệu ở mức cao và giúp việc xử lý trở nên thuận tiện hơn.
                  </p>
                  <br />
                  <p>Các bước phổ biến trong tiền xử lý dữ liệu bao gồm:</p>
                  <br />
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <b>Tách từ (Tokenization):</b> Ở bước này, nội dung văn
                      bản gốc được phân tách thành các đơn vị nhỏ hơn như từ đơn,
                      cụm từ, hoặc cả câu. Các đơn vị này, gọi là ‘token’, tạo
                      điều kiện thuận lợi cho việc xử lý và phân tích của hệ
                      thống ở các giai đoạn sau.
                    </li>
                    <li>
                      <b>Loại bỏ từ dừng (Stop Words Removal):</b> Những từ xuất
                      hiện thường xuyên trong ngôn ngữ nhưng ít mang giá trị biểu
                      đạt cảm xúc (ví dụ: “và,” “nhưng,” “là”) sẽ được nhận diện
                      và lược bỏ khỏi dữ liệu.
                    </li>
                    <li>
                      <b>Đưa từ về dạng gốc (Lemmatization):</b> Các biến thể của
                      một từ sẽ được quy về dạng cơ bản, nguyên mẫu của nó. Ví
                      dụ, các từ như “chạy” và “chạy nhanh” sẽ cùng được đưa về
                      gốc là “chạy”. Kỹ thuật này giúp hệ thống nắm bắt ý nghĩa
                      cốt lõi của từ ngữ mà không bị phân tâm bởi các hình thái
                      khác nhau.
                    </li>
                    <li>
                      <b>Chuẩn hóa văn bản (Normalization):</b> Quá trình này bao
                      gồm việc đồng bộ hóa định dạng văn bản, chẳng hạn như
                      chuyển đổi tất cả ký tự sang dạng chữ thường, xử lý các dấu
                      câu không cần thiết, và loại bỏ ký tự đặc biệt. Mục đích là
                      để tránh các sai lệch về ngữ nghĩa có thể phát sinh do sự
                      khác biệt về hình thức.
                    </li>
                  </ul>
                </li>
                <br />

                <figure className="rounded-2xl overflow-hidden border border-gray-700 bg-gray-800">
                  <img
                    src="/assets/Cach-hoat-dong-cua-cong-cu-Sentiment-Analysis.jpg" /* đặt file ở public/assets/hero-sentiment.png */
                    alt="Sentiment Analysis minh hoạ"
                    className="w-full h-auto object-cover"
                  />
                  <figcaption className="text-center text-sm text-gray-400 py-3 border-t border-gray-700">
                    Sentiment Analysis là gì?
                  </figcaption>
                </figure>
                <br />

                <li>
                  <b>Trích xuất các đặc trưng quan trọng từ văn bản</b>
                  <p>
                    Sau khi dữ liệu trải qua giai đoạn tiền xử lý, công đoạn kế
                    tiếp là rút trích những đặc trưng có ý nghĩa từ nội dung văn
                    bản. Quá trình này có thể thực hiện qua các phương pháp như:
                  </p>
                  <br />
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <b>Biểu diễn từ dưới dạng Vector (Word Vectorization):</b>{" "}
                      Áp dụng các kỹ thuật như Bag of Words (BOW) hoặc TF-IDF để
                      chuyển đổi từ ngữ thành các biểu diễn số học (vector) mà
                      thuật toán máy tính có thể hiểu và xử lý được.
                    </li>
                    <li>
                      <b>Nhúng từ (Word Embedding):</b> Sử dụng các mô hình tiên
                      tiến hơn như Word2Vec hoặc GloVe. Các mô hình này tạo ra
                      các vector nhúng, không chỉ biểu diễn từ dưới dạng số mà
                      còn nắm bắt được mối quan hệ ngữ nghĩa và ngữ cảnh của
                      chúng trong không gian vector.
                    </li>
                  </ul>
                </li>
                <br />

                <li>
                  <b>Nhận diện cảm xúc cụ thể (Emotion Detection)</b>
                  <p>
                    Mục tiêu của phương pháp này là xác định các trạng thái cảm
                    xúc cụ thể được biểu lộ trong văn bản, vượt ra ngoài thang
                    đo tích cực-tiêu cực.
                  </p>
                  <br />
                  <p>
                    Các cảm xúc có thể bao gồm sự tức giận, buồn bã, vui vẻ, thất
                    vọng, sợ hãi, lo lắng, hoảng sợ, và nhiều hơn nữa. Hệ thống
                    nhận diện cảm xúc thường dựa vào các bộ từ vựng cảm xúc
                    (lexicons) – những danh sách từ ngữ được gán nhãn cảm xúc
                    tương ứng.
                  </p>
                  <br />
                  <p>
                    Ngoài ra, các bộ phân loại tiên tiến hơn còn ứng dụng các
                    thuật toán học máy (Machine Learning – ML) để đạt độ chính
                    xác cao hơn.
                  </p>
                </li>
                <br />

                <li>
                  <b>Xác định mục đích người dùng (Intent Analysis)</b>
                  <p>
                    Việc <b>nhận diện chính xác ý định của người dùng</b> qua văn
                    bản họ tạo ra có thể mang lại lợi ích lớn cho doanh nghiệp về
                    mặt tối ưu hóa nguồn lực.
                  </p>
                  <br />
                  <p>
                    Bằng cách phân biệt giữa người dùng có ý định mua hàng rõ
                    ràng và người chỉ đang tìm hiểu thông tin, công ty có thể tập
                    trung nỗ lực chăm sóc và marketing vào nhóm khách hàng tiềm
                    năng hơn, tránh lãng phí thời gian và chi phí cho những người
                    chưa sẵn sàng mua.
                  </p>
                  <br />
                  <p>
                    Phân tích ý định giúp doanh nghiệp xác định mục đích thực sự
                    của người tiêu dùng. Nếu phát hiện khách hàng có dấu hiệu sẵn
                    sàng mua, doanh nghiệp có thể tiếp tục theo dõi và áp dụng
                    các chiến lược quảng cáo phù hợp.
                  </p>
                  <br />
                  <p>
                    Ngược lại, nếu người dùng chỉ đang trong giai đoạn tìm hiểu,
                    doanh nghiệp có thể tiết kiệm nguồn lực bằng cách không đẩy
                    mạnh các hoạt động quảng cáo đến họ vào thời điểm đó.
                  </p>
                </li>
              </ol>
            </Section>
          </section>

          <section id="cac-loai-hinh-pt-cam-xuc" className="scroll-mt-24">
            <Section
              title="Các loại hình phân tích cảm xúc"
              icon={<Layers className="w-5 h-5 text-blue-400" />}
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                <Card title="Đa mức độ (Fine-grained)" icon={<Gauge className="w-5 h-5" />}>
                  Thang “Rất tiêu cực → Rất tích cực” để nêu sắc thái chi tiết.
                </Card>
                <Card title="Theo khía cạnh (Aspect-based)" icon={<ListChecks className="w-5 h-5" />}>
                  Gắn cảm xúc với thuộc tính cụ thể (ví dụ: pin, camera, dịch vụ…).
                </Card>
                <Card title="Nhận diện cảm xúc" icon={<HeartPulse className="w-5 h-5" />}>
                  Happy, Sad, Angry, Surprise, Neutral, Fearful, Disgusted…
                </Card>
                <Card title="Phân tích ý định (Intent)" icon={<Radar className="w-5 h-5" />}>
                  Xác định mục đích người dùng dựa trên ngữ cảnh.
                </Card>
              </div>
              <br />

              <figure className="rounded-2xl overflow-hidden border border-gray-700 bg-gray-800">
              <img
                    src="/assets/sentiment-analysis-2.jpg" 
                    alt="Sentiment Analysis minh hoạ"
                    className="w-full h-auto object-cover"
                  />
                  <figcaption className="text-center text-sm text-gray-400 py-3 border-t border-gray-700">
                    Có 4 dạng Sentiment Analysis chính
                  </figcaption>
              </figure>
            </Section>
          </section>

          <section id="uu-diem-va-thach-thuc" className="scroll-mt-24">
            <div className="grid md:grid-cols-2 gap-6">
              <Section title="Ưu điểm" icon={<Shield className="w-5 h-5 text-blue-400" />}>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Tự động hóa, mở rộng với dữ liệu lớn theo thời gian thực.</li>
                  <li>Giảm thiên lệch chủ quan so với đọc thủ công.</li>
                  <li>Hỗ trợ quyết định nhanh dựa trên dữ liệu.</li>
                </ul>
              </Section>

              <Section title="Thách thức" icon={<BookOpen className="w-5 h-5 text-blue-400" />}>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Mỉa mai/ẩn dụ & phụ thuộc ngữ cảnh khó xử lý.</li>
                  <li>Thiên lệch dữ liệu, khác biệt ngôn ngữ/môi trường.</li>
                  <li>Đòi hỏi giám sát chất lượng khi vận hành lâu dài.</li>
                </ul>
              </Section>
            </div>
            <br />

            <figure className="rounded-2xl overflow-hidden border border-gray-700 bg-gray-800">
              <img
                    src="/assets/Uu-nhuoc-diem-cua-Sentiment-Analysis.png" 
                    alt="Sentiment Analysis minh hoạ"
                    className="w-full h-auto object-cover"
                  />
                  <figcaption className="text-center text-sm text-gray-400 py-3 border-t border-gray-700">
                    Ưu – nhược điểm của Sentiment Analysis
                  </figcaption>
            </figure>
          </section>

          <section id="ung-dung-thuc-te" className="scroll-mt-24">
            <Section title="Ứng dụng thực tế" icon={<Briefcase className="w-5 h-5 text-blue-400" />}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AppItem icon={<Users className="w-4 h-4" />} text="Phân tích Voice of Customer (VoC), CSAT, NPS." />
                <AppItem icon={<Megaphone className="w-4 h-4" />} text="Đo hiệu quả chiến dịch & phản hồi truyền thông." />
                <AppItem icon={<Globe2 className="w-4 h-4" />} text="Lắng nghe xã hội & quản lý danh tiếng thương hiệu." />
                <AppItem icon={<Target className="w-4 h-4" />} text="Ưu tiên tính năng & tối ưu trải nghiệm sản phẩm." />
                <AppItem icon={<LineChart className="w-4 h-4" />} text="Market/finance sentiment & phân tích xu hướng." />
                <AppItem icon={<Shield className="w-4 h-4" />} text="Phát hiện khủng hoảng, rủi ro, vi phạm chính sách." />
              </div>
              <br />
              <div>
                <figure className="rounded-2xl overflow-hidden border border-gray-700 bg-gray-800">
                  <img
                    src="/assets/Ung-dung-cong-nghe-Sentiment-Analysis-trong-thuc-te.jpg"
                    alt="Sentiment Analysis minh hoạ"
                    className="w-full h-auto object-cover"
                  />
                  <figcaption className="text-center text-sm text-gray-400 py-3 border-t border-gray-700">
                    Ứng dụng công nghệ Sentiment Analysis trong thực tế
                  </figcaption>
                </figure>
              </div>
            </Section>
          </section>

          <section id="khoa-luan" className="scroll-mt-24">
            <Section title="Về khóa luận của nhóm" icon={<Sparkles className="w-5 h-5 text-blue-400" />}>
              <p className="text-gray-300">
                <b>Emotion AI Analyzer</b> mở rộng từ Sentiment Analysis văn bản sang đa phương thức:
                <i> Text</i>, <i>Audio</i>, <i>Vision</i>. Các mô-đun chính: Text Sentiment, Audio Sentiment,
                Vision Sentiment, Fused Model và Max Fusion (Video). Kết quả gồm phân phối cảm xúc,
                timeline, độ tin cậy và các bảng chi tiết.
              </p>
            </Section>
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="sticky top-6 max-h-[calc(100vh-1.5rem)] overflow-auto space-y-6">
            <div className="bg-gray-800/60 rounded-2xl border border-gray-700">
              <div className="px-5 py-4 border-b border-gray-700 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold">Nội dung bài viết này</h3>
              </div>

              <ul className="divide-y divide-gray-700">
                {RECENT_POSTS.map((p, idx) => (
                  <li key={idx} className="hover:bg-gray-800/60 transition">
                    <a href={p.href ?? "#"} className="flex items-start gap-3 px-5 py-3 group">
                      <div className="w-12 h-12 rounded bg-gray-700/60 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-gray-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-200 leading-snug group-hover:text-blue-300">
                          {p.title}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-blue-300 mt-1" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-800/60 rounded-2xl p-5 border border-gray-700">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Tuyên bố
              </h4>
              <p className="text-sm text-gray-400">
                Trang Home tổng hợp kiến thức về Sentiment Analysis để giới thiệu khóa luận.
                Bố cục tham khảo từ các blog công nghệ; nội dung được biên soạn phù hợp với đề tài nhóm.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------- Small UI helpers ---------- */
function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      <div className="prose prose-invert prose-sm max-w-none">
        <div className="text-gray-300">{children}</div>
      </div>
    </section>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-4 bg-gray-800/50 border border-gray-700">
      <div className="flex items-center gap-2 font-medium mb-2">
        {icon}
        <span>{title}</span>
      </div>
      <p className="text-gray-300 text-sm">{children}</p>
    </div>
  );
}

function AppItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2 bg-gray-800/40 rounded-lg p-3">
      {icon}
      <span className="text-sm text-gray-300">{text}</span>
    </div>
  );
}
