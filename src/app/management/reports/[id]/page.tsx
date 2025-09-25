import ReportDetailView from "@/features/reports/presentation/views/report-detail-view";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <ReportDetailView reportId={params.id} />;
}
