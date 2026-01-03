import SiswaLayout from "../../../components/layout/layout";
import LogDetail from "./LogDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Tetap gunakan async untuk menangani params Next.js 15
export default async function Page({ params }: PageProps) {
  const { id } = await params; 

  return (
    <SiswaLayout>
        <LogDetail id={Number(id)} />
    </SiswaLayout>
  );
}