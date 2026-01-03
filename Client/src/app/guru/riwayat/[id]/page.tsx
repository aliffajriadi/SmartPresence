import Header from "../../components/layout/layout";
import RiwayatDetail from "./RiwayatDetail";
interface PageProps {
  params: Promise<{ id: string }>;
}

// Tetap gunakan async untuk menangani params Next.js 15
export default async function Page({ params }: PageProps) {
  const { id } = await params; 

  return (
    <Header>
      <RiwayatDetail id={Number(id)} />
    </Header>
  );
}