import SiswaLayout from "../../components/layout/layout";
import RiwayatDetailView from "./RiwayatDetail"; // Import component yang baru dibuat

interface PageProps {
  params: Promise<{ id: string }>;
}

// Tetap gunakan async untuk menangani params Next.js 15
export default async function Page({ params }: PageProps) {
  const { id } = await params; 

  return (
    <SiswaLayout>
      {/* Lempar ID ke Client Component */}
      <RiwayatDetailView id={Number(id)} />
    </SiswaLayout>
  );
}