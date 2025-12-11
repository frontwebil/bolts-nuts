import { Footer } from "@/components/layout/Footer/Footer";
import { Header } from "@/components/layout/Header/Header";
import { ReduxProviderWrapper } from "@/providers/ReduxMainProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProviderWrapper>
      <Header />
      {children}
      <Footer />
    </ReduxProviderWrapper>
  );
}
