import { PageHeader } from "@/components/ui";
import { UploadDropzone } from "@/components/UploadDropzone";

export default function UploadPage() {
  return <><PageHeader title="Upload Calls" subtitle="Analyze recorded calls with mock AI and store them in your workspace." /><UploadDropzone /></>;
}
